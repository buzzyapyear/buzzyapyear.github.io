import { CONFIG, FIELD } from './constants.js';
import { distance, angleBetween } from './utils.js';

export function findClosestPlayer(players, x, y) {
  let closest = null;
  let minDist = Infinity;
  for (const p of players) {
    const d = distance(p, { x, y });
    if (d < minDist) {
      minDist = d;
      closest = p;
    }
  }
  return closest;
}

export function isUnderPressure(player, opponents) {
  for (const opp of opponents) {
    if (distance(player, opp) < CONFIG.PRESSURE_DISTANCE) {
      return true;
    }
  }
  return false;
}

function getOpponentGoalX(team) {
  return team === 0 ? FIELD.right : FIELD.left;
}

export function updateAIPlayer(player, ball, teammates, opponents, possession, ballCarrier, releaseBall, diff) {
  if (player.role === 'GK') return;

  const oppGoalX = getOpponentGoalX(player.team);
  const teamHasPossession = possession === player.team;
  const iAmCarrier = ballCarrier === player;
  const ballIsLoose = ballCarrier === null;

  // Difficulty: scale AI movement speed
  const speedMult = diff ? diff.aiSpeedMultiplier : 1.0;

  if (iAmCarrier) {
    // Hesitation: if AI just got the ball, pause briefly before acting
    if (diff && diff.aiHesitationMs > 0) {
      if (!player._gotBallAt) player._gotBallAt = Date.now();
      if (Date.now() - player._gotBallAt < diff.aiHesitationMs) {
        // Stand still, hesitating
        player.vx = 0;
        player.vy = 0;
        return;
      }
    }

    const distToGoal = Math.abs(player.x - oppGoalX);

    if (distToGoal < CONFIG.SHOOT_RANGE) {
      // Shoot at goal — accuracy affected by difficulty
      releaseBall();
      player._gotBallAt = null;
      const accuracy = diff ? diff.aiShootAccuracy : 0.85;
      let goalY = FIELD.centerY;
      if (Math.random() < accuracy) {
        // On target
        goalY += (Math.random() - 0.5) * CONFIG.GOAL_WIDTH * 0.8;
      } else {
        // Miss — aim outside the goal
        goalY += (Math.random() < 0.5 ? -1 : 1) * (CONFIG.GOAL_WIDTH * 0.6 + Math.random() * 80);
      }
      const angle = angleBetween(ball, { x: oppGoalX, y: goalY });
      ball.kick(angle, CONFIG.SHOOT_POWER * (0.8 + Math.random() * 0.4));
    } else if (isUnderPressure(player, opponents)) {
      // Pass — with possible error based on difficulty
      releaseBall();
      player._gotBallAt = null;
      const passTargets = teammates.filter(p => p !== player && p.role !== 'GK');
      if (passTargets.length > 0) {
        const target = passTargets[Math.floor(Math.random() * passTargets.length)];
        let angle = angleBetween(ball, target);
        const errorChance = diff ? diff.aiPassErrorChance : 0.05;
        if (Math.random() < errorChance) {
          angle += (Math.random() - 0.5) * 1.2; // misplaced pass
        }
        ball.kick(angle, CONFIG.PASS_POWER);
      }
    } else {
      // Dribble toward goal (slower when carrying)
      player.moveTo(oppGoalX, FIELD.centerY + (Math.random() - 0.5) * 100, player.speed * 0.7 * speedMult);
    }
  } else if (ballIsLoose) {
    player._gotBallAt = null;
    const closestTeammateToBall = findClosestPlayer(
      teammates.filter(p => p.role !== 'GK'),
      ball.x, ball.y
    );
    if (closestTeammateToBall === player) {
      player.moveTo(ball.x, ball.y, player.speed * speedMult);
    } else {
      holdFormation(player, ball, teamHasPossession, speedMult);
    }
  } else if (teamHasPossession) {
    player._gotBallAt = null;
    holdFormation(player, ball, true, speedMult);
  } else {
    player._gotBallAt = null;
    const closestDefender = findClosestPlayer(
      teammates.filter(p => p.role !== 'GK'),
      ballCarrier.x, ballCarrier.y
    );
    if (closestDefender === player) {
      player.moveTo(ballCarrier.x, ballCarrier.y, player.speed * speedMult);
    } else {
      holdFormation(player, ball, false, speedMult);
    }
  }
}

function holdFormation(player, ball, teamHasPossession, speedMult = 1.0) {
  const ballShiftX = (ball.x - FIELD.centerX) * 0.3;
  const ballShiftY = (ball.y - FIELD.centerY) * 0.2;

  let extraShiftX = 0;
  let extraShiftY = 0;

  // Gentle wandering so players never stand perfectly still
  const t = Date.now() * 0.001;
  const wobbleId = player.roleIndex * 1.7; // unique per player
  extraShiftX += Math.sin(t + wobbleId) * 8;
  extraShiftY += Math.cos(t * 0.8 + wobbleId) * 8;

  if (teamHasPossession) {
    // Supporting run: push forward and spread wide to create space
    const forwardDir = player.team === 0 ? 1 : -1;
    extraShiftX += forwardDir * 40;
    // Drift away from ball Y to create passing lanes
    const yOffset = player.y - ball.y;
    extraShiftY += Math.sign(yOffset) * 20;
  } else {
    // Defensive: shift toward own goal
    extraShiftX += player.team === 0 ? -30 : 30;
  }

  const targetX = player.homeX + ballShiftX + extraShiftX;
  const targetY = player.homeY + ballShiftY + extraShiftY;

  player.moveTo(targetX, targetY, player.speed * 0.7 * speedMult);
}

export function makeAttackingRun(player, targetX, targetY, ball, releaseBall) {
  if (ball.isOnGround() && distance(player, ball) < CONFIG.KICK_RANGE + ball.radius + 10) {
    // Ball has landed and we're in range — finish it!
    if (releaseBall) releaseBall();
    const goalX = player.team === 0 ? FIELD.right : FIELD.left;
    const goalY = FIELD.centerY + (Math.random() - 0.5) * CONFIG.GOAL_WIDTH * 0.6;
    const angle = angleBetween(ball, { x: goalX, y: goalY });
    ball.kick(angle, CONFIG.SHOOT_POWER * 1.2);
  } else {
    // Predict where the ball will be in ~20 frames based on current velocity
    const predictX = ball.x + ball.vx * 20;
    const predictY = ball.y + ball.vy * 20;
    // Sprint directly toward the ball's predicted position
    player.moveTo(predictX, predictY, player.speed * 1.6);
  }
}
