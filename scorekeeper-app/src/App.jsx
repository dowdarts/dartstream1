import { useState } from 'react';
import './App.css';
import GameSetup from './GameSetup';
import ScoringApp from './ScoringApp';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);

  const handleGameStart = (settings) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const handleExitGame = () => {
    if (confirm('Are you sure you want to exit the current game?')) {
      setGameStarted(false);
      setGameSettings(null);
    }
  };

  if (!gameStarted) {
    return <GameSetup onGameStart={handleGameStart} />;
  }

  return <ScoringApp gameSettings={gameSettings} onExitGame={handleExitGame} />;
}

export default App;
