import { useRef, useEffect, useState } from 'react';
import { Game } from '../engine/Game.js';
import { CONFIG } from '../engine/constants.js';
import HUD from './HUD.jsx';
import GoalOverlay from './GoalOverlay.jsx';

export default function GameView({ onMatchEnd, practiceMode = false, difficulty = 'easy' }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [hudState, setHudState] = useState({
    clock: 0,
    score: [0, 0],
    possession: -1,
  });
  const [goalEvent, setGoalEvent] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const game = new Game(canvas, { practiceMode, difficulty });
    gameRef.current = game;

    game.events.on('tick', (data) => {
      setHudState({
        clock: data.clock,
        score: data.score,
        possession: data.possession,
      });
    });

    game.events.on('goal', (data) => {
      setGoalEvent(data);
      setTimeout(() => setGoalEvent(null), CONFIG.GOAL_CELEBRATION_MS);
    });

    game.events.on('fulltime', (data) => {
      setMatchResult(data);
      if (onMatchEnd) onMatchEnd(data);
    });

    game.start();

    return () => {
      game.stop();
    };
  }, [onMatchEnd, practiceMode, difficulty]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={CONFIG.CANVAS_WIDTH}
        height={CONFIG.CANVAS_HEIGHT}
        style={{ display: 'block', borderRadius: '4px' }}
      />
      <HUD clock={hudState.clock} score={hudState.score} possession={hudState.possession} />
      {goalEvent && <GoalOverlay team={goalEvent.team} />}
    </div>
  );
}
