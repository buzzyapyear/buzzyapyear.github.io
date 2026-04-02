import { CONFIG, FIELD } from './constants.js';
import { distance, clamp, angleBetween, normalize, magnitude } from './utils.js';

export class Player {
  constructor(team, roleIndex, formation) {
    this.team = team; // 0 = left (player), 1 = right (AI)
    this.role = CONFIG.ROLES[roleIndex];
    this.roleIndex = roleIndex;
    this.number = roleIndex + 1;

    // Home position in field coordinates
    const pos = formation[roleIndex];
    this.homeX = FIELD.left + pos.x * FIELD.width;
    this.homeY = FIELD.top + pos.y * FIELD.height;

    this.x = this.homeX;
    this.y = this.homeY;
    this.vx = 0;
    this.vy = 0;
    this.radius = CONFIG.PLAYER_RADIUS;

    // Direction the player is facing
    this.facingAngle = team === 0 ? 0 : Math.PI;

    this.isActive = false; // human-controlled
    this.color = team === 0 ? CONFIG.TEAM_A_COLOR : CONFIG.TEAM_B_COLOR;
    this.lightColor = team === 0 ? CONFIG.TEAM_A_LIGHT : CONFIG.TEAM_B_LIGHT;

    // Stamina
    this.stamina = CONFIG.STAMINA_MAX;

    // Tackle cooldown
    this.tackleCooldown = 0;
    this.lastTackleTime = 0;
  }

  get speed() {
    if (this.isActive) return CONFIG.PLAYER_SPEED;
    if (this.role === 'GK') return CONFIG.KEEPER_SPEED;
    return CONFIG.AI_SPEED;
  }

  canKick(ball) {
    return distance(this, ball) < CONFIG.KICK_RANGE + ball.radius && ball.isOnGround();
  }

  canTackle() {
    return Date.now() - this.lastTackleTime > CONFIG.TACKLE_COOLDOWN;
  }

  moveTo(targetX, targetY, speed) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      this.vx = 0;
      this.vy = 0;
      return;
    }

    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.facingAngle = Math.atan2(dy, dx);
  }

  applyInput(input, isSprinting) {
    let dx = 0;
    let dy = 0;

    if (input.isDown('w')) dy = -1;
    if (input.isDown('s')) dy = 1;
    if (input.isDown('a')) dx = -1;
    if (input.isDown('d')) dx = 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const invSqrt2 = 0.7071;
      dx *= invSqrt2;
      dy *= invSqrt2;
    }

    let speed = this.speed;
    if (isSprinting && this.stamina > 0) {
      speed *= CONFIG.SPRINT_MULTIPLIER;
      this.stamina = Math.max(0, this.stamina - CONFIG.STAMINA_DRAIN);
    } else {
      this.stamina = Math.min(CONFIG.STAMINA_MAX, this.stamina + CONFIG.STAMINA_REGEN);
    }

    this.vx = dx * speed;
    this.vy = dy * speed;

    if (dx !== 0 || dy !== 0) {
      this.facingAngle = Math.atan2(dy, dx);
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Clamp to field (goalkeepers stay in their area)
    if (this.role === 'GK') {
      if (this.team === 0) {
        this.x = clamp(this.x, FIELD.left, FIELD.left + CONFIG.PENALTY_AREA_DEPTH);
      } else {
        this.x = clamp(this.x, FIELD.right - CONFIG.PENALTY_AREA_DEPTH, FIELD.right);
      }
    } else {
      this.x = clamp(this.x, FIELD.left + this.radius, FIELD.right - this.radius);
    }
    this.y = clamp(this.y, FIELD.top + this.radius, FIELD.bottom - this.radius);

    // Non-active players regen stamina
    if (!this.isActive) {
      this.stamina = Math.min(CONFIG.STAMINA_MAX, this.stamina + CONFIG.STAMINA_REGEN * 0.5);
    }
  }

  resetToHome() {
    this.x = this.homeX;
    this.y = this.homeY;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = this.team === 0 ? 0 : Math.PI;
  }

  draw(ctx) {
    // Body circle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = this.isActive ? CONFIG.ACTIVE_INDICATOR : this.lightColor;
    ctx.lineWidth = this.isActive ? 3 : 1.5;
    ctx.stroke();

    // Active player indicator ring
    if (this.isActive) {
      ctx.strokeStyle = CONFIG.ACTIVE_INDICATOR;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Direction indicator
    const dirX = this.x + Math.cos(this.facingAngle) * this.radius * 0.8;
    const dirY = this.y + Math.sin(this.facingAngle) * this.radius * 0.8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(dirX, dirY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Jersey number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.number, this.x, this.y);

    // Stamina bar (only for active player)
    if (this.isActive) {
      const barWidth = this.radius * 2;
      const barHeight = 3;
      const barX = this.x - barWidth / 2;
      const barY = this.y + this.radius + 8;

      // Background
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Fill
      const fillRatio = this.stamina / CONFIG.STAMINA_MAX;
      ctx.fillStyle = fillRatio > 0.3 ? '#4caf50' : '#ff5722';
      ctx.fillRect(barX, barY, barWidth * fillRatio, barHeight);
    }
  }
}
