import './menu.css';
import { useState, useEffect, useRef } from 'react';

export default function Menu({ timeout = 5000, categories, toggledCategories, onToggle }) {
  const [visible, setVisible] = useState(true);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(null);

  // Inactivity Timer
  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    if (visible) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, timeout);
    }
  };

  // Reset timer on interaction inside menu
  useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const handleActivity = () => resetTimer();
    menuEl.addEventListener('mousemove', handleActivity);
    menuEl.addEventListener('touchstart', handleActivity);
    resetTimer();

    return () => {
      menuEl.removeEventListener('mousemove', handleActivity);
      menuEl.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  // Click / tap outside to close
  useEffect(() => {
    if (!visible) return;

    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [visible]);

  // Swipe to open (left edge swipe right)
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches[0].clientX < 30) {
        touchStartX.current = e.touches[0].clientX;
      } else {
        touchStartX.current = null;
      }
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current !== null) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > 50) {
          setVisible(true);
        }
        touchStartX.current = null;
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleEdgeClick = () => {
    setVisible(true);
  };

  return (
    <>
      {!visible && (
        <div className="left-edge" onClick={handleEdgeClick} />
      )}

      <div
        ref={menuRef}
        className={`side-menu ${visible ? 'visible' : 'hidden'}`}
      >
        <h5>Side Menu</h5>
        <ul>
            {categories.map((category, index) => (
                <li key={index} className="menu-item">
                    <label>
                        <input
                        type="checkbox"
                        checked={toggledCategories.includes(category)}
                        onChange={() => onToggle(category)}
                        />
                        {category}
                    </label>
                </li>
            ))}
        </ul>
      </div>
    </>
  );
}
