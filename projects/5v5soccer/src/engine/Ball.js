import { CONFIG, FIELD } from './constants.js';
import { clamp } from './utils.js';

export class Ball {
  constructor() {
    this.x = FIELD.centerX;
    this.y = FIELD.centerY;
    this.vx = 0;
    this.vy = 0;
    this.radius = CONFIG.BALL_RADIUS;
    // Cross "height" simulation
    this.height = 0; // 0 = on ground, > 0 = in air
    this.vHeight = 0;
    this.shadowOffset = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Friction
    this.vx *= CONFIG.BALL_FRICTION;
    this.vy *= CONFIG.BALL_FRICTION;

    // Stop micro-movement
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;

    // Speed cap
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > CONFIG.BALL_MAX_SPEED) {
      const ratio = CONFIG.BALL_MAX_SPEED / speed;
      this.vx *= ratio;
      this.vy *= ratio;
    }

    // Height simulation for crosses
    if (this.height > 0 || this.vHeight > 0) {
      this.height += this.vHeight;
      this.vHeight -= 0.3; // gravity
      if (this.height <= 0) {
        this.height = 0;
        this.vHeight = 0;
        // Ball bounces slightly on landing
        this.vx *= 0.7;
        this.vy *= 0.7;
      }
      this.shadowOffset = this.height * 0.5;
    }

    // Wall bounces (top/bottom)
    if (this.y - this.radius < FIELD.top) {
      this.y = FIELD.top + this.radius;
      this.vy *= -CONFIG.BALL_BOUNCE_DAMPING;
    }
    if (this.y + this.radius > FIELD.bottom) {
      this.y = FIELD.bottom - this.radius;
      this.vy *= -CONFIG.BALL_BOUNCE_DAMPING;
    }

    // Side walls — goal check handled by Game
    if (this.x - this.radius < FIELD.left) {
      if (this.y < FIELD.goalTop || this.y > FIELD.goalBottom) {
        this.x = FIELD.left + this.radius;
        this.vx *= -CONFIG.BALL_BOUNCE_DAMPING;
      }
    }
    if (this.x + this.radius > FIELD.right) {
      if (this.y < FIELD.goalTop || this.y > FIELD.goalBottom) {
        this.x = FIELD.right - this.radius;
        this.vx *= -CONFIG.BALL_BOUNCE_DAMPING;
      }
    }
  }

  kick(angle, power) {
    this.vx = Math.cos(angle) * power;
    this.vy = Math.sin(angle) * power;
  }

  loft(angle, power, loftPower) {
    this.vx = Math.cos(angle) * power;
    this.vy = Math.sin(angle) * power;
    this.height = 1;
    this.vHeight = loftPower;
  }

  isOnGround() {
    return this.height <= 0;
  }

  reset() {
    this.x = FIELD.centerX;
    this.y = FIELD.centerY;
    this.vx = 0;
    this.vy = 0;
    this.height = 0;
    this.vHeight = 0;
    this.shadowOffset = 0;
  }

  draw(ctx) {
    // Shadow when ball is in air
    if (this.height > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + this.shadowOffset, this.radius + 1, this.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ball
    const drawY = this.y - this.height;
    ctx.fillStyle = CONFIG.BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = CONFIG.BALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Small highlight
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(this.x - 1.5, drawY - 1.5, this.radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}
