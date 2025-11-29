import { useState } from 'react';

function ScoringApp({ gameSettings, onExitGame }) {
  const [homeScore, setHomeScore] = useState(gameSettings.startingScore);
  const [awayScore, setAwayScore] = useState(gameSettings.startingScore);
  const [currentPlayer, setCurrentPlayer] = useState('home');
  const [currentThrow, setCurrentThrow] = useState('');
  const [scoreHistory, setScoreHistory] = useState([]);

  const addToThrow = (value) => {
    setCurrentThrow(currentThrow + value);
  };

  const clearThrow = () => {
    setCurrentThrow('');
  };

  const submitScore = () => {
    if (!currentThrow) return;
    
    const score = parseInt(currentThrow);
    if (isNaN(score)) return;

    const timestamp = new Date().toLocaleTimeString();
    const playerName = currentPlayer === 'home' ? gameSettings.homePlayerName : gameSettings.awayPlayerName;
    
    if (currentPlayer === 'home') {
      const newScore = homeScore - score;
      if (newScore >= 0) {
        setHomeScore(newScore);
        setScoreHistory([{ player: playerName, score, remaining: newScore, timestamp, side: 'home' }, ...scoreHistory]);
        setCurrentPlayer('away');
      }
    } else {
      const newScore = awayScore - score;
      if (newScore >= 0) {
        setAwayScore(newScore);
        setScoreHistory([{ player: playerName, score, remaining: newScore, timestamp, side: 'away' }, ...scoreHistory]);
        setCurrentPlayer('home');
      }
    }
    
    setCurrentThrow('');
  };

  const handleBust = () => {
    const timestamp = new Date().toLocaleTimeString();
    const playerName = currentPlayer === 'home' ? gameSettings.homePlayerName : gameSettings.awayPlayerName;
    const currentScore = currentPlayer === 'home' ? homeScore : awayScore;
    
    setScoreHistory([{ player: playerName, score: 'BUST!', remaining: currentScore, timestamp, side: currentPlayer, bust: true }, ...scoreHistory]);
    setCurrentPlayer(currentPlayer === 'home' ? 'away' : 'home');
    setCurrentThrow('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header - Scores */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800">
        <div className={`glass-container p-6 text-center ${currentPlayer === 'home' ? 'ring-4 ring-yellow-400' : ''}`}>
          <div className="text-white/70 text-sm font-bold mb-1">🏠 {gameSettings.homePlayerName}</div>
          <div className="text-6xl font-black text-white">{homeScore}</div>
        </div>
        <div className={`glass-container p-6 text-center ${currentPlayer === 'away' ? 'ring-4 ring-yellow-400' : ''}`}>
          <div className="text-white/70 text-sm font-bold mb-1">✈️ {gameSettings.awayPlayerName}</div>
          <div className="text-6xl font-black text-white">{awayScore}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Keypad */}
        <div className="glass-container p-4">
          <div className="mb-4">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-white/50 text-sm mb-1">Current Throw</div>
              <div className="text-5xl font-black text-white min-h-[60px] flex items-center justify-center">
                {currentThrow || '0'}
              </div>
            </div>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => addToThrow(num.toString())}
                className="bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900 aspect-square rounded-xl text-4xl font-black hover:from-gray-200 hover:to-gray-400"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleBust}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl text-xl font-bold hover:from-red-500 hover:to-red-600"
            >
              BUST!
            </button>
            <button
              onClick={() => addToThrow('0')}
              className="bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900 py-4 rounded-xl text-4xl font-black hover:from-gray-200 hover:to-gray-400"
            >
              0
            </button>
            <button
              onClick={submitScore}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl text-2xl font-bold hover:from-green-500 hover:to-green-600"
            >
              ✓
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={clearThrow}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl text-lg font-bold hover:from-gray-500 hover:to-gray-600"
            >
              Clear
            </button>
            <button
              onClick={onExitGame}
              className="bg-gradient-to-r from-red-700 to-red-800 text-white py-3 rounded-xl text-lg font-bold hover:from-red-600 hover:to-red-700"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Score History */}
        <div className="glass-container p-4 flex flex-col">
          <h3 className="text-2xl font-black text-white mb-4 text-center">
            📊 Last Scores
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-custom">
            {scoreHistory.length === 0 ? (
              <div className="text-center text-white/50 mt-8">
                No scores yet
              </div>
            ) : (
              scoreHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl backdrop-blur-sm border-2 ${
                    entry.bust
                      ? 'bg-red-500/20 border-red-500/50'
                      : entry.side === 'home'
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-green-500/20 border-green-500/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">{entry.player}</div>
                      <div className="text-white/70 text-sm">{entry.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-black ${entry.bust ? 'text-red-400' : 'text-white'}`}>
                        {entry.bust ? 'BUST!' : entry.score}
                      </div>
                      <div className="text-white/70 text-sm">
                        Remaining: {entry.remaining}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Score Buttons */}
      <div className="p-4 bg-gray-800">
        <div className="grid grid-cols-6 gap-2">
          {[26, 41, 45, 60, 81, 85, 100, 121, 140, 180].map((score) => (
            <button
              key={score}
              onClick={() => {
                setCurrentThrow(score.toString());
              }}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-2 rounded-lg text-lg font-bold hover:from-gray-500 hover:to-gray-600"
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScoringApp;
