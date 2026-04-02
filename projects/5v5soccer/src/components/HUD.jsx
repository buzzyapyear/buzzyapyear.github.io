import { CONFIG } from '../engine/constants.js';

export default function HUD({ clock, score, possession }) {
  const minutes = Math.floor(clock / 60);
  const seconds = Math.floor(clock % 60);
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(0,0,0,0.75)',
        padding: '6px 20px',
        borderRadius: '0 0 12px 12px',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: CONFIG.TEAM_A_COLOR,
            boxShadow: possession === 0 ? `0 0 8px ${CONFIG.TEAM_A_COLOR}` : 'none',
          }} />
          <span style={{
            color: '#fff', fontSize: '20px', fontWeight: 'bold',
            minWidth: '20px', textAlign: 'center',
          }}>
            {score[0]}
          </span>
        </div>

        <div style={{
          color: '#ccc', fontSize: '14px', fontWeight: 'bold',
          background: 'rgba(255,255,255,0.1)',
          padding: '2px 10px',
          borderRadius: '6px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {timeStr}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: '#fff', fontSize: '20px', fontWeight: 'bold',
            minWidth: '20px', textAlign: 'center',
          }}>
            {score[1]}
          </span>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: CONFIG.TEAM_B_COLOR,
            boxShadow: possession === 1 ? `0 0 8px ${CONFIG.TEAM_B_COLOR}` : 'none',
          }} />
        </div>
      </div>
    </div>
  );
}
