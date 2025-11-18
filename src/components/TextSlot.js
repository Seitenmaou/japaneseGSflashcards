import React from 'react';

function TextSlot({ character, hint, showHint, onClick }) {
  const handleClick = (event) => {
    event.stopPropagation(); // important: prevent card click from firing
    onClick(event);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'inline-block',
        border: '1px solid #ccc',
        width: '40px',
        height: '50px',
        margin: '4px',
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '24px',
        cursor: 'pointer',
        backgroundColor: showHint ? '#f0f8ff' : '#fff',
        borderRadius: '6px',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
      }}
    >
      {showHint ? hint : character}
    </div>
  );
}

export default TextSlot;
