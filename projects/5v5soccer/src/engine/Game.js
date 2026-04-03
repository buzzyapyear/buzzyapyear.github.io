import { CONFIG, FIELD, DIFFICULTY } from './constants.js';
import { Ball } from './Ball.js';
import { Player } from './Player.js';
import { Input } from './Input.js';
import { EventBus } from './EventBus.js';
import { drawField } from './Field.js';
import { updateAIPlayer, findClosestPlayer, makeAttackingRun } from './AI.js';
import { updateGoalkeeper } from './Goalkeeper.js';
import { distance, angleBetween, resolveCircleOverlap } from './utils.js';

const STATES = {
  KICKOFF: 'KICKOFF',
  PLAYING: 'PLAYING',
  GOAL_SCORED: 'GOAL_SCORED',
  HALFTIME: 'HALFTIME',
  FULLTIME: 'FULLTIME',
};

export class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = new Input();
    this.events = new EventBus();
    this.ball = new Ball();
    this.practiceMode = options.practiceMode || false;
    this.difficulty = DIFFICULTY[options.difficulty || 'easy'];

    this.state = STATES.KICKOFF;
    this.stateTimer = 0;
    this.score = [0, 0];
    this.clock = 0; // seconds elapsed
    this.half = 1;
    this.possession = -1; // -1 = none, 0 = team A, 1 = team B
    this.lastScoringTeam = -1;
    this.ballCarrier = null; // player currently holding the ball

    // Cross state
    this.crossInFlight = false;
    this.crossLandingX = 0;
    this.crossLandingY = 0;
    this._possessionLockUntil = 0;

    this.players = [];
    this._createPlayers();
    this._setActivePlayer();

    this.animationId = null;
    this.lastTime = 0;
    this.running = false;
  }

  _createPlayers() {
    // Team A (player team, left side)
    for (let i = 0; i < 5; i++) {
      this.players.push(new Player(0, i, CONFIG.FORMATION_A));
    }
    // Team B (AI team, right side)
    for (let i = 0; i < 5; i++) {
      this.players.push(new Player(1, i, CONFIG.FORMATION_B));
    }
  }

  getTeamPlayers(team) {
    return this.players.filter(p => p.team === team);
  }

  _setActivePlayer() {
    const teamA = this.getTeamPlayers(0).filter(p => p.role !== 'GK');
    const closest = findClosestPlayer(teamA, this.ball.x, this.ball.y);
    this.players.forEach(p => p.isActive = false);
    if (closest) closest.isActive = true;
  }

  switchActivePlayer() {
    const teamA = this.getTeamPlayers(0).filter(p => p.role !== 'GK');
    const currentActive = teamA.find(p => p.isActive);

    // Find nearest non-active player to ball
    const candidates = teamA.filter(p => p !== currentActive);
    const nearest = findClosestPlayer(candidates, this.ball.x, this.ball.y);

    if (nearest) {
      this.players.forEach(p => p.isActive = false);
      nearest.isActive = true;
    }
  }

  start() {
    this.input.attach();
    this.running = true;
    this.lastTime = performance.now();
    this.stateTimer = Date.now();
    this._scheduleLoop();
  }

  stop() {
    this.running = false;
    this.input.detach();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _tick() {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 1 / 30);
    // Skip if called too frequently (prevents double-ticking from RAF + interval)
    if (dt < 0.001) return;
    this.lastTime = now;

    try {
      this._update(dt);
      this._draw();
    } catch (e) {
      console.error('[Game] loop error:', e.message, e.stack);
    }
  }

  _scheduleLoop() {
    // RAF for smooth rendering in real browsers
    const rafLoop = () => {
      if (!this.running) return;
      this._tick();
      this.animationId = requestAnimationFrame(rafLoop);
    };
    this.animationId = requestAnimationFrame(rafLoop);

    // setInterval fallback for headless/preview environments where RAF doesn't fire
    this._intervalId = setInterval(() => this._tick(), 1000 / 60);
  }

  _update(dt) {
    const now = Date.now();

    switch (this.state) {
      case STATES.KICKOFF:
        if (now - this.stateTimer > CONFIG.KICKOFF_DELAY_MS) {
          this.state = STATES.PLAYING;
          this.events.emit('stateChange', { state: this.state });
        }
        break;

      case STATES.PLAYING:
        this._updatePlaying(dt);
        // Advance clock
        this.clock += dt;
        this.events.emit('tick', {
          clock: this.clock,
          score: [...this.score],
          possession: this.possession,
        });

        // Check halftime
        if (this.half === 1 && this.clock >= CONFIG.HALF_DURATION_SECONDS) {
          this.state = STATES.HALFTIME;
          this.stateTimer = now;
          this.events.emit('halftime', { score: [...this.score] });
        }
        // Check fulltime
        if (this.clock >= CONFIG.MATCH_DURATION_SECONDS) {
          this.state = STATES.FULLTIME;
          this.events.emit('fulltime', { score: [...this.score] });
        }
        break;

      case STATES.GOAL_SCORED:
        if (now - this.stateTimer > CONFIG.GOAL_CELEBRATION_MS) {
          this._resetForKickoff();
          this.state = STATES.KICKOFF;
          this.stateTimer = now;
          this.events.emit('stateChange', { state: this.state });
        }
        break;

      case STATES.HALFTIME:
        if (now - this.stateTimer > CONFIG.HALFTIME_DELAY_MS) {
          this.half = 2;
          this._resetForKickoff();
          this.state = STATES.KICKOFF;
          this.stateTimer = now;
          this.events.emit('stateChange', { state: this.state });
        }
        break;

      case STATES.FULLTIME:
        // Game over — do nothing
        break;
    }

    this.input.clearJustPressed();
  }

  _updatePlaying(dt) {
    const activePlayer = this.players.find(p => p.isActive);
    const teamA = this.getTeamPlayers(0);
    const teamB = this.getTeamPlayers(1);
    const isSprinting = this.input.isDown(' ');

    // Handle human player input
    if (activePlayer) {
      activePlayer.applyInput(this.input, isSprinting);

      const hasPossession = this.possession === 0;

      const isCarrier = this.ballCarrier === activePlayer;

      if (hasPossession && isCarrier) {
        // OFFENSE controls — active player has the ball
        // J = Shoot — aim at corners away from keeper
        if (this.input.wasJustPressed('j')) {
          this._releaseBall();
          const goalX = FIELD.right;
          // Find the opponent keeper
          const oppKeeper = this.getTeamPlayers(1).find(p => p.role === 'GK');
          const keeperY = oppKeeper ? oppKeeper.y : FIELD.centerY;
          // Aim at the far side from the keeper (the corner they're furthest from)
          const goalHalf = CONFIG.GOAL_WIDTH / 2;
          const keeperOffset = keeperY - FIELD.centerY; // positive = keeper below center
          // Target the opposite corner with some randomness
          const targetCorner = -Math.sign(keeperOffset || (Math.random() - 0.5));
          const goalY = FIELD.centerY + targetCorner * (goalHalf * 0.6 + Math.random() * goalHalf * 0.3);
          const angle = angleBetween(this.ball, { x: goalX, y: goalY });
          this.ball.kick(angle, CONFIG.SHOOT_POWER);
        }
        // K = Pass
        if (this.input.wasJustPressed('k')) {
          this._releaseBall();
          const passTargets = teamA.filter(p => p !== activePlayer && p.role !== 'GK');
          const target = findClosestPlayer(passTargets, this.ball.x + 50, this.ball.y);
          if (target) {
            const angle = angleBetween(this.ball, target);
            this.ball.kick(angle, CONFIG.PASS_POWER);
            // Switch control to the pass recipient
            this.players.forEach(p => p.isActive = false);
            target.isActive = true;
          }
        }
        // L = Cross
        if (this.input.wasJustPressed('l')) {
          this._releaseBall();
          this._performCross(activePlayer, teamA);
        }
      } else if (!this.practiceMode) {
        // DEFENSE controls (disabled in practice mode)
        // J = Tackle
        if (this.input.wasJustPressed('j') && activePlayer.canTackle()) {
          this._performTackle(activePlayer, teamB);
        }
        // K = Switch player
        if (this.input.wasJustPressed('k')) {
          this.switchActivePlayer();
        }
      }
    }

    // In practice mode, always treat as having possession so offense controls work
    if (this.practiceMode) {
      this.possession = 0;
    }

    const releaseBall = () => this._releaseBall();
    const diff = this.difficulty;

    // Update AI for team A (non-active teammates — use null difficulty so your team isn't nerfed)
    for (const p of teamA) {
      if (p.isActive) continue;
      if (p.role === 'GK') {
        updateGoalkeeper(p, this.ball, this.ballCarrier, releaseBall, null);
      } else if (this.crossInFlight && this.possession === 0 && (p.role === 'FWD' || p.role === 'MID')) {
        makeAttackingRun(p, this.crossLandingX, this.crossLandingY, this.ball, releaseBall);
      } else {
        updateAIPlayer(p, this.ball, teamA, teamB, this.possession, this.ballCarrier, releaseBall, null);
      }
    }

    // Update AI for team B — frozen in practice mode, difficulty-affected
    if (!this.practiceMode) {
      for (const p of teamB) {
        if (p.role === 'GK') {
          updateGoalkeeper(p, this.ball, this.ballCarrier, releaseBall, diff);
        } else {
          updateAIPlayer(p, this.ball, teamB, teamA, this.possession, this.ballCarrier, releaseBall, diff);
        }
      }
    }

    // Update all players
    for (const p of this.players) {
      p.update();
    }

    // Update ball
    this.ball.update();

    // Cross state: keep the attacking run active even after ball lands,
    // until someone picks it up or 3 seconds pass
    if (this.crossInFlight) {
      if (this.ball.isOnGround() && !this._crossLandedTime) {
        this._crossLandedTime = Date.now();
      }
      // End cross state when ball is picked up or 3s after landing
      if (this.ballCarrier || (this._crossLandedTime && Date.now() - this._crossLandedTime > 3000)) {
        this.crossInFlight = false;
        this._crossLandedTime = null;
      }
    }

    // Player-ball collisions
    this._handlePlayerBallCollisions();

    // Player-player collisions
    this._handlePlayerPlayerCollisions();

    // Check for goals
    this._checkGoals();
  }

  _performCross(player, team) {
    const isWide = player.y < FIELD.top + FIELD.height * 0.33 || player.y > FIELD.bottom - FIELD.height * 0.33;
    const oppGoalX = FIELD.right;
    const penaltyAreaX = oppGoalX - CONFIG.PENALTY_AREA_DEPTH;

    if (isWide) {
      // Cross into the box — land near the penalty spot, not deep by the goal line
      const isTopWing = player.y < FIELD.centerY;
      // Land in the front half of the penalty area (between edge and halfway to goal)
      this.crossLandingX = penaltyAreaX + CONFIG.PENALTY_AREA_DEPTH * (0.2 + Math.random() * 0.3);
      // Target the center/near-post area — where a runner arriving from midfield can meet it
      this.crossLandingY = isTopWing
        ? FIELD.centerY + (Math.random() * 0.2) * CONFIG.GOAL_WIDTH  // slightly below center
        : FIELD.centerY - (Math.random() * 0.2) * CONFIG.GOAL_WIDTH; // slightly above center

      const angle = angleBetween(this.ball, { x: this.crossLandingX, y: this.crossLandingY });
      this.ball.loft(angle, CONFIG.CROSS_POWER, 4);
      this.crossInFlight = true;

      // AI will handle the attacking run and finish — no player switch
      this.events.emit('cross', { landingX: this.crossLandingX, landingY: this.crossLandingY });
    } else {
      // Through ball from central position
      const targetX = this.ball.x + 120;
      const targetY = this.ball.y + (Math.random() - 0.5) * 60;
      const angle = angleBetween(this.ball, { x: targetX, y: targetY });
      this.ball.kick(angle, CONFIG.PASS_POWER * 1.3);
    }
  }

  _performTackle(player, opponents) {
    // If there's a ball carrier, target them specifically
    const target = (this.ballCarrier && this.ballCarrier.team !== player.team)
      ? this.ballCarrier
      : findClosestPlayer(opponents, player.x, player.y);
    if (!target) return;

    const dist = distance(player, target);
    player.lastTackleTime = Date.now();

    // Generous tackle range (boosted by difficulty)
    const tackleBonus = this.difficulty.tackleRangeBonus || 0;
    if (dist < CONFIG.TACKLE_RANGE + CONFIG.PLAYER_RADIUS * 2 + 10 + tackleBonus) {
      // Successful tackle — release ball and knock it toward tackling player
      this._releaseBall();
      const angleToPlayer = angleBetween(target, player);
      const spread = (Math.random() - 0.5) * 0.5;
      this.ball.kick(angleToPlayer + spread, CONFIG.PASS_POWER * 0.7);
      this.possession = player.team;
      // Lock possession AND prevent AI pickup based on difficulty
      const lockMs = this.difficulty.aiPickupCooldownMs || 300;
      this._possessionLockUntil = Date.now() + lockMs;
      this.events.emit('tackle', { success: true });
    } else {
      // Lunge toward the ball carrier / nearest opponent
      player.moveTo(target.x, target.y, player.speed * 1.8);
      this.events.emit('tackle', { success: false });
    }
  }

  _handlePlayerBallCollisions() {
    const now = Date.now();
    const possessionLocked = now < this._possessionLockUntil;

    // If someone already carries the ball, only check if an opponent can tackle it away
    if (this.ballCarrier) {
      // Snap ball to carrier
      this._snapBallToCarrier();

      // Check if an opponent is close enough to auto-dispossess (body challenge)
      for (const player of this.players) {
        if (player.team === this.ballCarrier.team) continue;
        const dist = distance(player, this.ballCarrier);
        if (dist < player.radius + this.ballCarrier.radius + 2) {
          // Body challenge chance varies by difficulty
          const challengeProb = this.difficulty.bodyChallengeProbability;
          if (Math.random() < challengeProb) {
            const angle = angleBetween(this.ballCarrier, player);
            this._releaseBall();
            this.ball.kick(angle + (Math.random() - 0.5) * 0.8, CONFIG.PASS_POWER * 0.3);
          }
        }
      }
      return;
    }

    // No carrier — check who picks up the loose ball
    const pickupOnCooldown = now < (this._pickupCooldownUntil || 0);
    if (!pickupOnCooldown) this._lastReleaser = null;

    for (const player of this.players) {
      const dist = distance(player, this.ball);
      if (dist < player.radius + this.ball.radius + 4 && this.ball.isOnGround()) {
        // Pickup cooldown blocks AI opponent and the player who just released the ball
        if (pickupOnCooldown && (player.team === 1 || player === this._lastReleaser)) continue;
        // Respect tackle lock
        if (possessionLocked && player.team !== this.possession) continue;

        this.ballCarrier = player;
        this.possession = player.team;

        // Auto-switch control to the teammate who receives the ball
        // (but not during a cross — let AI finish that)
        if (player.team === 0 && !player.isActive && !this.crossInFlight) {
          this.players.forEach(p => p.isActive = false);
          player.isActive = true;
        }
        this.ball.vx = 0;
        this.ball.vy = 0;
        this._snapBallToCarrier();
        break;
      }
    }
  }

  _snapBallToCarrier() {
    if (!this.ballCarrier) return;
    const carrier = this.ballCarrier;
    const offset = carrier.radius + this.ball.radius + 2;
    this.ball.x = carrier.x + Math.cos(carrier.facingAngle) * offset;
    this.ball.y = carrier.y + Math.sin(carrier.facingAngle) * offset;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  _releaseBall() {
    this._lastReleaser = this.ballCarrier; // remember who kicked it
    this.ballCarrier = null;
    // Cooldown before AI can pick up the loose ball — scales with difficulty
    const cooldown = this.difficulty.aiPickupCooldownMs || 150;
    this._pickupCooldownUntil = Date.now() + cooldown;
  }

  _handlePlayerPlayerCollisions() {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        const a = this.players[i];
        const b = this.players[j];
        const overlap = resolveCircleOverlap(a, a.radius, b, b.radius);
        if (overlap) {
          a.x -= overlap.pushX;
          a.y -= overlap.pushY;
          b.x += overlap.pushX;
          b.y += overlap.pushY;
        }
      }
    }
  }

  _checkGoals() {
    // Ball past left goal line (team B scores)
    if (this.ball.x - this.ball.radius < FIELD.left &&
        this.ball.y > FIELD.goalTop && this.ball.y < FIELD.goalBottom) {
      this.score[1]++;
      this.lastScoringTeam = 1;
      this.state = STATES.GOAL_SCORED;
      this.stateTimer = Date.now();
      this.events.emit('goal', { team: 1, score: [...this.score] });
    }
    // Ball past right goal line (team A scores)
    if (this.ball.x + this.ball.radius > FIELD.right &&
        this.ball.y > FIELD.goalTop && this.ball.y < FIELD.goalBottom) {
      this.score[0]++;
      this.lastScoringTeam = 0;
      this.state = STATES.GOAL_SCORED;
      this.stateTimer = Date.now();
      this.events.emit('goal', { team: 0, score: [...this.score] });
    }
  }

  _resetForKickoff() {
    this.ball.reset();
    this.ballCarrier = null;
    for (const p of this.players) {
      p.resetToHome();
    }
    this.possession = -1;
    this.crossInFlight = false;
    this._setActivePlayer();
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    drawField(ctx);

    // Draw players (goalkeepers first, then outfield, then ball on top)
    const gks = this.players.filter(p => p.role === 'GK');
    const outfield = this.players.filter(p => p.role !== 'GK');
    for (const p of gks) p.draw(ctx);
    for (const p of outfield) p.draw(ctx);

    this.ball.draw(ctx);

    // Practice mode label
    if (this.practiceMode) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('PRACTICE MODE', FIELD.left + 8, FIELD.bottom + 16);
    }

    // Cross landing indicator
    if (this.crossInFlight) {
      ctx.strokeStyle = 'rgba(255,255,0,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(this.crossLandingX, this.crossLandingY, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // State overlays (drawn on canvas as fallback, React HUD is primary)
    this._drawStateOverlay(ctx);
  }

  _drawStateOverlay(ctx) {
    if (this.state === STATES.KICKOFF) {
      this._drawOverlayText(ctx, 'KICK OFF');
    } else if (this.state === STATES.GOAL_SCORED) {
      this._drawOverlayText(ctx, 'GOAL!', '#ffff00', 48);
    } else if (this.state === STATES.HALFTIME) {
      this._drawOverlayText(ctx, 'HALF TIME');
    } else if (this.state === STATES.FULLTIME) {
      this._drawOverlayText(ctx, 'FULL TIME', '#ffffff', 40);
      const scoreText = `${this.score[0]} - ${this.score[1]}`;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(scoreText, FIELD.centerX, FIELD.centerY + 40);
    }
  }

  _drawOverlayText(ctx, text, color = '#ffffff', size = 36) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD.centerX - 150, FIELD.centerY - 40, 300, 60);

    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, FIELD.centerX, FIELD.centerY);
  }
}
