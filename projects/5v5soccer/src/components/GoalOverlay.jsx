import { CONFIG } from '../engine/constants.js';

export default function GoalOverlay({ team }) {
  const color = team === 0 ? CONFIG.TEAM_A_COLOR : CONFIG.TEAM_B_COLOR;
  const label = team === 0 ? 'YOU SCORED!' : 'OPPONENT SCORES';

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
      pointerEvents: 'none',
      animation: 'goalFadeIn 0.3s ease-out',
    }}>
      <div style={{
        fontSize: '64px',
        fontWeight: 'bold',
        color: '#ffff00',
        textShadow: '0 0 20px rgba(255,255,0,0.5), 2px 2px 4px rgba(0,0,0,0.8)',
        fontFamily: 'Arial, sans-serif',
        animation: 'goalPulse 0.5s ease-out',
      }}>
        GOAL!
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: color,
        marginTop: '8px',
        fontFamily: 'Arial, sans-serif',
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
      }}>
        {label}
      </div>

      <style>{`
        @keyframes goalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes goalPulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
