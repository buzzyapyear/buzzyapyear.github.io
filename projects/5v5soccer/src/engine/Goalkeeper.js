import { CONFIG, FIELD } from './constants.js';
import { distance, lerp, clamp } from './utils.js';

export function updateGoalkeeper(keeper, ball, ballCarrier, releaseBall, diff) {
  const goalX = keeper.team === 0 ? FIELD.left : FIELD.right;
  const keeperLineX = keeper.team === 0 ? FIELD.left + 15 : FIELD.right - 15;
  const goalHalf = CONFIG.GOAL_WIDTH / 2;

  // Difficulty settings
  const reactionLerp = diff ? diff.keeperReaction : 0.22;
  // Coverage: how much of the goal the keeper can cover (0.0–1.0)
  // On easy, keeper only covers 40% of goal width, so corners are open
  const coverage = diff ? diff.keeperCoverage : 0.7;
  // Reaction delay: keeper freezes for this many ms after a shot is detected
  const reactionDelayMs = diff ? diff.keeperReactionDelayMs : 100;

  // Stay on the goal line
  keeper.x = lerp(keeper.x, keeperLineX, 0.1);

  // Detect incoming shot
  const ballMovingToward = keeper.team === 0 ? ball.vx < -2 : ball.vx > 2;
  const ballClose = Math.abs(ball.x - goalX) < 150;
  const shotIncoming = !ballCarrier && ballMovingToward && ballClose;

  if (shotIncoming) {
    // Track when we first noticed this shot
    if (!keeper._shotDetectedAt) {
      keeper._shotDetectedAt = Date.now();
    }

    // Reaction delay — keeper is frozen, doesn't move
    if (Date.now() - keeper._shotDetectedAt < reactionDelayMs) {
      keeper.vx = 0;
      keeper.vy = 0;
      return;
    }

    // Dive toward predicted position, but limited by coverage
    const timeToGoal = Math.abs((goalX - ball.x) / ball.vx);
    const predictedY = ball.y + ball.vy * timeToGoal;
    const coverageHalf = goalHalf * coverage;
    const clampedPredY = clamp(predictedY, FIELD.centerY - coverageHalf, FIELD.centerY + coverageHalf);
    keeper.y = lerp(keeper.y, clampedPredY, reactionLerp + 0.08);
  } else {
    // No shot — reset detection, gently drift toward ball Y
    keeper._shotDetectedAt = null;

    // Only loosely track ball position — don't perfectly mirror it
    // Keeper drifts toward center-biased position
    const looseTargetY = FIELD.centerY + (ball.y - FIELD.centerY) * 0.3;
    const clampedTarget = clamp(looseTargetY, FIELD.centerY - goalHalf * 0.5, FIELD.centerY + goalHalf * 0.5);
    keeper.y = lerp(keeper.y, clampedTarget, reactionLerp * 0.5);
  }

  // If keeper is the ball carrier, clear it immediately
  if (ballCarrier === keeper && releaseBall) {
    releaseBall();
    const clearDirection = keeper.team === 0 ? 0 : Math.PI;
    const spread = (Math.random() - 0.5) * Math.PI / 3;
    ball.kick(clearDirection + spread, CONFIG.SHOOT_POWER * 0.8);
  }

  // Clear loose ball if in range
  if (!ballCarrier && distance(keeper, ball) < CONFIG.KICK_RANGE + ball.radius && ball.isOnGround()) {
    const clearDirection = keeper.team === 0 ? 0 : Math.PI;
    const spread = (Math.random() - 0.5) * Math.PI / 3;
    ball.kick(clearDirection + spread, CONFIG.SHOOT_POWER * 0.8);
  }

  keeper.vx = 0;
  keeper.vy = 0;
}
