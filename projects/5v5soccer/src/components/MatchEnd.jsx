import { CONFIG } from '../engine/constants.js';

export default function MatchEnd({ score, onPlayAgain, onMainMenu }) {
  const result = score[0] > score[1] ? 'YOU WIN!' : score[0] < score[1] ? 'YOU LOSE' : 'DRAW';
  const resultColor = score[0] > score[1] ? '#2ecc71' : score[0] < score[1] ? '#e74c3c' : '#f39c12';

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      fontFamily: 'Arial, sans-serif',
      zIndex: 10,
    }}>
      <div style={{ fontSize: '24px', color: '#888', marginBottom: '8px' }}>
        FULL TIME
      </div>
      <div style={{
        fontSize: '64px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '8px',
      }}>
        {score[0]} - {score[1]}
      </div>
      <div style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: resultColor,
        marginBottom: '40px',
      }}>
        {result}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={onPlayAgain}
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onMainMenu}
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}
