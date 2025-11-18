import './App.css';
import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import FlashCard from './components/FlashCard';

const googleSheetsApi = 'https://script.google.com/macros/s/AKfycbyKeLFla2mIBQEBQCCwoXJdFQ9QvEBeV9mRQh3RY6RLyzOAexNHceRgWGvZJwMLr-iK/exec';

function App() {
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [toggledCategories, setToggledCategories] = useState([]);
  const [randomPool, setRandomPool] = useState([]);
  const [index, setIndex] = useState(0);

  const [isKatakana, setIsKatakana] = useState(false);
  const [showFullRomaji, setShowFullRomaji] = useState(false);

  const handleNext = () => {
    setShowFullRomaji(false)
    setIndex((prevIndex) => (prevIndex + 1) % randomPool.length);

  };

  const handleToggle = (item) => {
    setToggledCategories((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleToggleScript = () => {
    setIsKatakana((prev) => !prev);
  };

  const handleToggleRomaji = () => {
    setShowFullRomaji((prev) => !prev);
  };

  useEffect(() => {
    const combined = toggledCategories.flatMap((cat) => data[cat] || []);
    const shuffled = [...combined].sort(() => Math.random() - 0.5);
    setRandomPool(shuffled);
    setIndex(0); // reset to first card on category change
  }, [toggledCategories]);

  useEffect(() => {
    fetch(googleSheetsApi)
      .then((res) => res.json())
      .then((data) => {
        for (let key in data) {
          if (Array.isArray(data[key])) {
            data[key] = data[key].filter((item) => item !== '');
          }
        }
        setData(data);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    setCategories(Object.keys(data));
  }, [data]);

  return (
    <div className="App">
      <Menu
        timeout={5000}
        categories={categories}
        toggledCategories={toggledCategories}
        onToggle={handleToggle}
      />
      <div style={{ marginLeft: '200px', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center' }}>Japanese Flash Cards</h1>
        {randomPool.length > 0 ? (
          <div
            style={{
              padding: '40px',
              fontFamily: 'sans-serif',
              background: '#fafafa',
              minHeight: '100vh',
            }}
          >
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={handleToggleScript} style={{ marginRight: '10px' }}>
                Toggle Kana
              </button>
              <button onClick={handleToggleRomaji} style={{ marginRight: '10px' }}>
                {showFullRomaji ? 'Hide Romaji' : 'Show Romaji'}
              </button>
              <button onClick={handleNext}>Next</button>
            <FlashCard
              word={randomPool[index]}
              onNext={handleNext}
              isKatakana={isKatakana}
              showFullRomaji={showFullRomaji}
            />
            </div>
          </div>
        ) : (
          <p>No items to display. Please select categories from the menu.</p>
        )}
      </div>
    </div>
  );
}

export default App;
