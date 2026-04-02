export const CONFIG = Object.freeze({
  // Canvas
  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 640,

  // Field
  FIELD_MARGIN: 40,
  GOAL_WIDTH: 120,
  GOAL_DEPTH: 25,
  CENTER_CIRCLE_RADIUS: 60,
  PENALTY_AREA_WIDTH: 200,
  PENALTY_AREA_DEPTH: 100,
  LINE_WIDTH: 2,

  // Ball
  BALL_RADIUS: 5,
  BALL_FRICTION: 0.98,
  BALL_MAX_SPEED: 6,
  BALL_BOUNCE_DAMPING: 0.6,

  // Player
  PLAYER_RADIUS: 12,
  PLAYER_SPEED: 1.5,
  AI_SPEED: 1.2,
  KEEPER_SPEED: 1.7,
  KICK_RANGE: 22,
  SHOOT_POWER: 5,
  PASS_POWER: 3.2,
  CROSS_POWER: 4,
  SHOOT_RANGE: 280,
  PRESSURE_DISTANCE: 50,
  TACKLE_RANGE: 28,
  TACKLE_COOLDOWN: 500, // ms

  // Sprint
  SPRINT_MULTIPLIER: 1.4,
  STAMINA_MAX: 100,
  STAMINA_DRAIN: 0.5, // per frame while sprinting
  STAMINA_REGEN: 0.2, // per frame while not sprinting

  // Game
  MATCH_DURATION_SECONDS: 180,
  HALF_DURATION_SECONDS: 90,
  GOAL_CELEBRATION_MS: 2000,
  KICKOFF_DELAY_MS: 1500,
  HALFTIME_DELAY_MS: 3000,

  // Colors
  FIELD_COLOR: '#2d8a4e',
  FIELD_STRIPE_COLOR: '#339955',
  LINE_COLOR: '#ffffff',
  BALL_COLOR: '#ffffff',
  BALL_OUTLINE: '#333333',
  TEAM_A_COLOR: '#e74c3c',
  TEAM_A_LIGHT: '#ff6b6b',
  TEAM_B_COLOR: '#3498db',
  TEAM_B_LIGHT: '#5dade2',
  GOAL_NET_COLOR: '#cccccc',
  ACTIVE_INDICATOR: '#ffff00',

  // Formations (normalized 0-1) — GK, LB, RB, CM, ST
  FORMATION_A: [
    { x: 0.06, y: 0.5 },
    { x: 0.22, y: 0.25 },
    { x: 0.22, y: 0.75 },
    { x: 0.4, y: 0.5 },
    { x: 0.6, y: 0.5 },
  ],
  FORMATION_B: [
    { x: 0.94, y: 0.5 },
    { x: 0.78, y: 0.75 },
    { x: 0.78, y: 0.25 },
    { x: 0.6, y: 0.5 },
    { x: 0.4, y: 0.5 },
  ],

  ROLES: ['GK', 'DEF', 'DEF', 'MID', 'FWD'],
});

// Difficulty presets — multipliers and overrides applied to AI behavior
export const DIFFICULTY = Object.freeze({
  easy: {
    label: 'Easy',
    aiSpeedMultiplier: 0.55,
    aiShootAccuracy: 0.25,
    aiHesitationMs: 1200,
    aiPassErrorChance: 0.45,
    keeperReaction: 0.04,          // very sluggish dive
    keeperCoverage: 0.35,          // only covers 35% of goal — corners wide open
    keeperReactionDelayMs: 500,    // half-second freeze before diving
    bodyChallengeProbability: 0.0,
    tackleRangeBonus: 25,
    aiPickupCooldownMs: 600,
  },
  medium: {
    label: 'Medium',
    aiSpeedMultiplier: 0.75,
    aiShootAccuracy: 0.5,
    aiHesitationMs: 600,
    aiPassErrorChance: 0.2,
    keeperReaction: 0.12,
    keeperCoverage: 0.6,
    keeperReactionDelayMs: 250,
    bodyChallengeProbability: 0.1,
    tackleRangeBonus: 12,
    aiPickupCooldownMs: 400,
  },
  hard: {
    label: 'Hard',
    aiSpeedMultiplier: 0.95,
    aiShootAccuracy: 0.75,
    aiHesitationMs: 200,
    aiPassErrorChance: 0.08,
    keeperReaction: 0.22,
    keeperCoverage: 0.85,
    keeperReactionDelayMs: 80,
    bodyChallengeProbability: 0.25,
    tackleRangeBonus: 0,
    aiPickupCooldownMs: 150,
  },
});

// Derived field bounds
export const FIELD = Object.freeze({
  left: CONFIG.FIELD_MARGIN,
  right: CONFIG.CANVAS_WIDTH - CONFIG.FIELD_MARGIN,
  top: CONFIG.FIELD_MARGIN,
  bottom: CONFIG.CANVAS_HEIGHT - CONFIG.FIELD_MARGIN,
  width: CONFIG.CANVAS_WIDTH - CONFIG.FIELD_MARGIN * 2,
  height: CONFIG.CANVAS_HEIGHT - CONFIG.FIELD_MARGIN * 2,
  centerX: CONFIG.CANVAS_WIDTH / 2,
  centerY: CONFIG.CANVAS_HEIGHT / 2,
  goalTop: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.GOAL_WIDTH / 2,
  goalBottom: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.GOAL_WIDTH / 2,
});
