import { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu.jsx';
import GameView from './components/GameView.jsx';
import MatchEnd from './components/MatchEnd.jsx';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [matchResult, setMatchResult] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartGame = useCallback((practice = false, diff = 'easy') => {
    setPracticeMode(practice);
    setDifficulty(diff);
    setScreen('playing');
    setMatchResult(null);
    setGameKey(k => k + 1);
  }, []);

  const handleMatchEnd = useCallback((result) => {
    setMatchResult(result);
    setScreen('ended');
  }, []);

  const handleMainMenu = useCallback(() => {
    setScreen('menu');
    setMatchResult(null);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a1a2e',
    }}>
      {screen === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}
      {(screen === 'playing' || screen === 'ended') && (
        <div style={{ position: 'relative' }}>
          <GameView
            key={gameKey}
            onMatchEnd={handleMatchEnd}
            practiceMode={practiceMode}
            difficulty={difficulty}
          />
          {screen === 'ended' && matchResult && (
            <MatchEnd
              score={matchResult.score}
              onPlayAgain={handleStartGame}
              onMainMenu={handleMainMenu}
            />
          )}
        </div>
      )}
    </div>
  );
}
