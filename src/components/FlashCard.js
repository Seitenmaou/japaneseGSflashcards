import React, { useState, useEffect } from 'react';
import TextSlot from './TextSlot';
import { toKatakana, toRomaji } from 'wanakana';

function FlashCard({ word, isKatakana, showFullRomaji, onNext }) {
  const [showRomaji, setShowRomaji] = useState([]);

  useEffect(() => {
    setShowRomaji(Array(word.length).fill(false));
  }, [word]);

  const handleSlotClick = (index, e) => {
    e.stopPropagation();
    setShowRomaji((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index]; // toggle on/off
      return updated;
    });
  };

  const displayWord = isKatakana ? toKatakana(word) : word;

  return (
    <div
      style={{
        border: '2px solid black',
        padding: '20px',
        width: '320px',
        cursor: 'default',
        userSelect: 'none',
        margin: '20px auto',
        background: '#fffdf7',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {displayWord.split('').map((char, i) => (
          <TextSlot
            key={i}
            character={char}
            hint={toRomaji(char)}
            showHint={showRomaji[i] || showFullRomaji}
            onClick={(e) => handleSlotClick(i, e)}
          />
        ))}
      </div>
      {showFullRomaji && (
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '16px', color: '#555' }}>
          {toRomaji(word)}
        </div>
      )}
    </div>
  );
}

export default FlashCard;
