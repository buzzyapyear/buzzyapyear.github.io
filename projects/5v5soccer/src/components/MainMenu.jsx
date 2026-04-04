import { useState } from 'react';
import { DIFFICULTY } from '../engine/constants.js';

const difficulties = ['easy', 'medium', 'hard'];

const BG_IMAGE = 'https://images.pexels.com/photos/41257/pexels-photo-41257.jpeg?auto=compress&cs=tinysrgb&w=1920';

export default function MainMenu({ onStartGame = () => {} }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        filter: 'brightness(0.4) saturate(1.3)',
        zIndex: 0,
      }} />

      {/* Gradient overlay for depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,30,10,0.4) 40%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Spotlight glow at top */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120%',
        height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        padding: '0 24px',
      }}>
        {/* Soccer ball icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '8px',
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
        }}>
          ⚽
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: 900,
          margin: 0,
          letterSpacing: '-2px',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1,
          textShadow: '0 0 40px rgba(255,255,255,0.15), 0 4px 8px rgba(0,0,0,0.5)',
        }}>
          5v5 Soccer
        </h1>

        {/* Subtitle */}
        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          marginTop: '8px',
          marginBottom: '48px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Hackathon Edition
        </div>

        {/* Difficulty selector */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '4px',
          backdropFilter: 'blur(10px)',
        }}>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: '10px 28px',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: difficulty === d
                  ? 'rgba(255,255,255,0.95)'
                  : 'transparent',
                color: difficulty === d ? '#111' : 'rgba(255,255,255,0.5)',
                border: 'none',
                borderRadius: '9px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {DIFFICULTY[d].label}
            </button>
          ))}
        </div>

        {/* Kick Off button */}
        <button
          onClick={() => onStartGame(false, difficulty)}
          onMouseEnter={() => setHoveredBtn('kickoff')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '18px 64px',
            fontSize: '20px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            background: hoveredBtn === 'kickoff'
              ? 'linear-gradient(135deg, #e74c3c, #ff6b6b)'
              : 'linear-gradient(135deg, #c0392b, #e74c3c)',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            transform: hoveredBtn === 'kickoff' ? 'scale(1.04)' : 'scale(1)',
            boxShadow: hoveredBtn === 'kickoff'
              ? '0 8px 32px rgba(231,76,60,0.5), 0 0 60px rgba(231,76,60,0.2)'
              : '0 4px 20px rgba(231,76,60,0.3)',
          }}
        >
          Kick Off
        </button>

        {/* Practice button */}
        <button
          onClick={() => onStartGame(true, difficulty)}
          onMouseEnter={() => setHoveredBtn('practice')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            marginTop: '12px',
            padding: '12px 36px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: hoveredBtn === 'practice'
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(255,255,255,0.06)',
            color: hoveredBtn === 'practice'
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          Practice Mode
        </button>

        {/* Controls */}
        <div style={{
          marginTop: '52px',
          padding: '20px 32px',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '14px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          lineHeight: 2,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '4px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Controls
          </div>
          <div>
            <Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key> Move
            &nbsp;&nbsp;&nbsp;
            <Key>J</Key> Shoot / Tackle
            &nbsp;&nbsp;&nbsp;
            <Key>K</Key> Pass / Switch
          </div>
          <div>
            <Key>L</Key> Cross
            &nbsp;&nbsp;&nbsp;
            <Key>Space</Key> Sprint
          </div>
        </div>
      </div>

      {/* Photo credit */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '16px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.2)',
        zIndex: 10,
      }}>
        Photo by Pexels
      </div>
    </div>
  );
}

function Key({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      margin: '0 2px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.15)',
      fontFamily: 'monospace',
    }}>
      {children}
    </span>
  );
}
