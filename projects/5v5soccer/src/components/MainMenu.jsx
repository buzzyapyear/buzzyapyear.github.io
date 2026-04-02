import { useState } from 'react';
import { DIFFICULTY } from '../engine/constants.js';

const difficulties = ['easy', 'medium', 'hard'];

export default function MainMenu({ onStartGame = () => {} }) {
  const [difficulty, setDifficulty] = useState('easy');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
    }}>
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        marginBottom: '8px',
        background: 'linear-gradient(to right, #e74c3c, #f39c12, #2ecc71, #3498db)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: 'none',
      }}>
        5v5 SOCCER
      </div>
      <div style={{
        fontSize: '18px',
        color: '#888',
        marginBottom: '40px',
        letterSpacing: '4px',
      }}>
        HACKATHON EDITION
      </div>

      {/* Difficulty selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {difficulties.map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              background: difficulty === d ? '#fff' : 'transparent',
              color: difficulty === d ? '#1a1a2e' : '#666',
              border: `2px solid ${difficulty === d ? '#fff' : '#444'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {DIFFICULTY[d].label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onStartGame(false, difficulty)}
        style={{
          padding: '16px 48px',
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 15px rgba(231,76,60,0.4)',
        }}
        onMouseOver={e => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 20px rgba(231,76,60,0.6)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(231,76,60,0.4)';
        }}
      >
        KICK OFF
      </button>

      <button
        onClick={() => onStartGame(true, difficulty)}
        style={{
          marginTop: '12px',
          padding: '10px 32px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: 'transparent',
          color: '#888',
          border: '2px solid #444',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#888';
        }}
        onMouseOut={e => {
          e.target.style.color = '#888';
          e.target.style.borderColor = '#444';
        }}
      >
        PRACTICE MODE
      </button>

      <div style={{
        marginTop: '48px',
        fontSize: '13px',
        color: '#555',
        textAlign: 'center',
        lineHeight: '2',
      }}>
        <div style={{ color: '#777', marginBottom: '8px', fontSize: '14px' }}>CONTROLS</div>
        <div><strong>WASD</strong> Move &nbsp;&nbsp; <strong>J</strong> Shoot / Tackle &nbsp;&nbsp; <strong>K</strong> Pass / Switch</div>
        <div><strong>L</strong> Cross &nbsp;&nbsp; <strong>SPACE</strong> Sprint</div>
      </div>
    </div>
  );
}
