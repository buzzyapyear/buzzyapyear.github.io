import { CONFIG, FIELD } from './constants.js';

export function drawField(ctx) {
  const { CANVAS_WIDTH, CANVAS_HEIGHT, FIELD_MARGIN, LINE_WIDTH, LINE_COLOR,
    FIELD_COLOR, FIELD_STRIPE_COLOR, CENTER_CIRCLE_RADIUS,
    GOAL_WIDTH, GOAL_DEPTH, PENALTY_AREA_WIDTH, PENALTY_AREA_DEPTH } = CONFIG;

  // Background
  ctx.fillStyle = FIELD_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Grass stripes
  const stripeWidth = FIELD.width / 10;
  ctx.fillStyle = FIELD_STRIPE_COLOR;
  for (let i = 0; i < 10; i += 2) {
    ctx.fillRect(FIELD.left + i * stripeWidth, FIELD.top, stripeWidth, FIELD.height);
  }

  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;

  // Outer boundary
  ctx.strokeRect(FIELD.left, FIELD.top, FIELD.width, FIELD.height);

  // Center line
  ctx.beginPath();
  ctx.moveTo(FIELD.centerX, FIELD.top);
  ctx.lineTo(FIELD.centerX, FIELD.bottom);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(FIELD.centerX, FIELD.centerY, CENTER_CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Center spot
  ctx.fillStyle = LINE_COLOR;
  ctx.beginPath();
  ctx.arc(FIELD.centerX, FIELD.centerY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Penalty areas
  const penaltyTop = FIELD.centerY - PENALTY_AREA_WIDTH / 2;
  // Left penalty area
  ctx.strokeRect(FIELD.left, penaltyTop, PENALTY_AREA_DEPTH, PENALTY_AREA_WIDTH);
  // Right penalty area
  ctx.strokeRect(FIELD.right - PENALTY_AREA_DEPTH, penaltyTop, PENALTY_AREA_DEPTH, PENALTY_AREA_WIDTH);

  // Goal area (smaller box)
  const goalAreaWidth = GOAL_WIDTH + 40;
  const goalAreaDepth = 40;
  const goalAreaTop = FIELD.centerY - goalAreaWidth / 2;
  ctx.strokeRect(FIELD.left, goalAreaTop, goalAreaDepth, goalAreaWidth);
  ctx.strokeRect(FIELD.right - goalAreaDepth, goalAreaTop, goalAreaDepth, goalAreaWidth);

  // Penalty spots
  ctx.fillStyle = LINE_COLOR;
  ctx.beginPath();
  ctx.arc(FIELD.left + PENALTY_AREA_DEPTH - 20, FIELD.centerY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(FIELD.right - PENALTY_AREA_DEPTH + 20, FIELD.centerY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Penalty arcs
  ctx.beginPath();
  ctx.arc(FIELD.left + PENALTY_AREA_DEPTH - 20, FIELD.centerY, 36, -0.6, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(FIELD.right - PENALTY_AREA_DEPTH + 20, FIELD.centerY, 36, Math.PI - 0.6, Math.PI + 0.6);
  ctx.stroke();

  // Goals (rectangles behind goal line)
  const goalTop = FIELD.centerY - GOAL_WIDTH / 2;
  // Left goal
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(FIELD.left - GOAL_DEPTH, goalTop, GOAL_DEPTH, GOAL_WIDTH);
  ctx.strokeRect(FIELD.left - GOAL_DEPTH, goalTop, GOAL_DEPTH, GOAL_WIDTH);
  // Right goal
  ctx.fillRect(FIELD.right, goalTop, GOAL_DEPTH, GOAL_WIDTH);
  ctx.strokeRect(FIELD.right, goalTop, GOAL_DEPTH, GOAL_WIDTH);

  // Goal net pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.5;
  const netSpacing = 8;
  // Left goal net
  for (let y = goalTop; y < goalTop + GOAL_WIDTH; y += netSpacing) {
    ctx.beginPath();
    ctx.moveTo(FIELD.left - GOAL_DEPTH, y);
    ctx.lineTo(FIELD.left, y);
    ctx.stroke();
  }
  for (let x = FIELD.left - GOAL_DEPTH; x < FIELD.left; x += netSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, goalTop);
    ctx.lineTo(x, goalTop + GOAL_WIDTH);
    ctx.stroke();
  }
  // Right goal net
  for (let y = goalTop; y < goalTop + GOAL_WIDTH; y += netSpacing) {
    ctx.beginPath();
    ctx.moveTo(FIELD.right, y);
    ctx.lineTo(FIELD.right + GOAL_DEPTH, y);
    ctx.stroke();
  }
  for (let x = FIELD.right; x < FIELD.right + GOAL_DEPTH; x += netSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, goalTop);
    ctx.lineTo(x, goalTop + GOAL_WIDTH);
    ctx.stroke();
  }

  // Corner arcs
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;
  const cornerRadius = 10;
  // Top-left
  ctx.beginPath();
  ctx.arc(FIELD.left, FIELD.top, cornerRadius, 0, Math.PI / 2);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.arc(FIELD.right, FIELD.top, cornerRadius, Math.PI / 2, Math.PI);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.arc(FIELD.left, FIELD.bottom, cornerRadius, -Math.PI / 2, 0);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.arc(FIELD.right, FIELD.bottom, cornerRadius, Math.PI, Math.PI * 1.5);
  ctx.stroke();
}
