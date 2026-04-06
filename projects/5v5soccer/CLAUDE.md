# 5v5 Soccer Game

Browser-based 2D soccer game built with React 19 + Vite, rendered on Canvas 2D (no external game engine).

## Architecture

- **UI layer** (`src/components/`) — React handles menus, HUD, overlays
- **Engine** (`src/engine/`) — Pure JS game loop, physics, AI
- **Communication** — EventBus (pub/sub) bridges engine events to React

## Key Files

- `src/engine/Game.js` — Core loop & state machine (KICKOFF → PLAYING → GOAL_SCORED → HALFTIME → FULLTIME)
- `src/engine/Player.js` — Movement, stamina, rendering
- `src/engine/Ball.js` — Physics with friction & height/lofting for crosses
- `src/engine/AI.js` — Formation holding, chasing, passing, shooting behavior
- `src/engine/Goalkeeper.js` — Shot reaction, diving, clearing
- `src/engine/constants.js` — All config, formations, 3 difficulty presets (Easy/Medium/Hard)
- `src/engine/Input.js` — Keyboard input (WASD + JKL + Space)
- `src/engine/EventBus.js` — Pub/sub event system
- `src/engine/Field.js` — Canvas field rendering
- `src/components/GameView.jsx` — Wires canvas to Game engine + React overlays
- `src/components/MainMenu.jsx` — Difficulty picker, practice mode toggle
- `src/components/HUD.jsx` — Live score/clock
- `src/components/GoalOverlay.jsx` — Goal celebration animation
- `src/components/MatchEnd.jsx` — Final score screen

## Controls

- WASD: Move, Space: Sprint (drains stamina)
- J: Shoot (offense) / Tackle (defense)
- K: Pass (offense) / Switch player (defense)
- L: Cross/Lob

## Game Features

- 5v5: 1 GK + 2 DEF + 1 MID + 1 FWD per team
- Team A (Red) = human, Team B (Blue) = AI
- 3-minute matches (two 90s halves)
- Practice mode (offense only, no AI defense)
- Difficulty scales AI speed, accuracy, reaction time, hesitation, GK coverage
- Cross system with attacking runs and ball prediction
- Possession lock cooldowns after tackles
- Stamina system with sprint drain/regen

## Dev

```bash
npm run dev    # Vite dev server
npm run build  # Production build to dist/
```
