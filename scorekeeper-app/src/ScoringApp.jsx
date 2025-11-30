import { useState } from 'react';

function ScoringApp({ gameSettings, onExitGame }) {
  const [homeScore, setHomeScore] = useState(gameSettings.startingScore);
  const [awayScore, setAwayScore] = useState(gameSettings.startingScore);
  const [currentPlayer, setCurrentPlayer] = useState('home');
  const [currentThrow, setCurrentThrow] = useState('');
  const [scoreHistory, setScoreHistory] = useState([]);
  const [sets, setSets] = useState({ home: 0, away: 0 });
  const [legs, setLegs] = useState({ home: 0, away: 0 });
  const [turnNumber, setTurnNumber] = useState(1);

  const addToThrow = (value) => {
    setCurrentThrow(currentThrow + value);
  };

  const clearThrow = () => {
    setCurrentThrow('');
  };

  const calculateAverage = (totalScore, darts) => {
    if (darts === 0) return '0.00';
    return ((totalScore / darts) * 3).toFixed(2);
  };

  const submitScore = () => {
    if (!currentThrow) return;
    
    const score = parseInt(currentThrow);
    if (isNaN(score)) return;

    if (currentPlayer === 'home') {
      const newScore = homeScore - score;
      if (newScore >= 0) {
        setHomeScore(newScore);
        setScoreHistory([{ player: 'Home', score, turn: turnNumber, side: 'home' }, ...scoreHistory]);
        setCurrentPlayer('away');
      }
    } else {
      const newScore = awayScore - score;
      if (newScore >= 0) {
        setAwayScore(newScore);
        setScoreHistory([{ player: 'Away', score, turn: turnNumber, side: 'away' }, ...scoreHistory]);
        setCurrentPlayer('home');
        setTurnNumber(turnNumber + 1);
      }
    }
    
    setCurrentThrow('');
  };

  const handleMiss = () => {
    setScoreHistory([{ player: currentPlayer === 'home' ? 'Home' : 'Away', score: 0, turn: turnNumber, side: currentPlayer, miss: true }, ...scoreHistory]);
    
    if (currentPlayer === 'away') {
      setTurnNumber(turnNumber + 1);
    }
    
    setCurrentPlayer(currentPlayer === 'home' ? 'away' : 'home');
    setCurrentThrow('');
  };

  const undoLastScore = () => {
    if (scoreHistory.length === 0) return;
    
    const lastEntry = scoreHistory[0];
    const newHistory = scoreHistory.slice(1);
    
    // Restore score
    if (lastEntry.side === 'home') {
      setHomeScore(homeScore + (lastEntry.miss ? 0 : lastEntry.score));
    } else {
      setAwayScore(awayScore + (lastEntry.miss ? 0 : lastEntry.score));
    }
    
    // Switch player back
    setCurrentPlayer(lastEntry.side);
    
    // Adjust turn if needed
    if (lastEntry.side === 'away' && turnNumber > 1) {
      setTurnNumber(turnNumber - 1);
    }
    
    setScoreHistory(newHistory);
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top Score Display */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-black">
        {/* Home Player */}
        <div className={`relative rounded-xl p-4 ${currentPlayer === 'home' ? 'bg-gradient-to-br from-gray-700 to-gray-800 ring-2 ring-green-400' : 'bg-gradient-to-br from-gray-800 to-gray-900'}`}>
          {currentPlayer === 'home' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
          <div className="text-gray-400 text-base font-bold mb-1">{gameSettings.homePlayerName}</div>
          <div className="text-gray-300 text-7xl font-black mb-1">{homeScore}</div>
          <div className="text-gray-500 text-2xl font-bold">{calculateAverage(gameSettings.startingScore - homeScore, scoreHistory.filter(h => h.side === 'home').length * 3)}</div>
        </div>

        {/* Away Player */}
        <div className={`relative rounded-xl p-4 ${currentPlayer === 'away' ? 'bg-white ring-4 ring-yellow-400' : 'bg-gradient-to-br from-gray-800 to-gray-900'}`}>
          {currentPlayer === 'away' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
          <div className={`text-base font-bold mb-1 ${currentPlayer === 'away' ? 'text-gray-800' : 'text-gray-400'}`}>{gameSettings.awayPlayerName}</div>
          <div className={`text-7xl font-black mb-1 ${currentPlayer === 'away' ? 'text-gray-900' : 'text-gray-300'}`}>{awayScore}</div>
          <div className={`text-2xl font-bold ${currentPlayer === 'away' ? 'text-gray-700' : 'text-gray-500'}`}>{calculateAverage(gameSettings.startingScore - awayScore, scoreHistory.filter(h => h.side === 'away').length * 3)}</div>
        </div>
      </div>

      {/* Sets/Legs & Turn Display */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-black">
        <div className="bg-yellow-400 text-black text-center py-2 rounded font-black text-lg">
          S:{sets.home}-{sets.away} L:{legs.home}-{legs.away}
        </div>
        <div className="bg-blue-600 text-white text-center py-2 rounded font-black text-lg flex items-center justify-center gap-2">
          <span>📡 {Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>
        <div className="bg-yellow-400 text-black text-center py-2 rounded font-black text-lg">
          Turn {turnNumber}
        </div>
      </div>

      {/* Score History Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 mx-2 rounded-t-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-700 text-white font-bold text-center text-lg py-2">
          <div>Home</div>
          <div>Turn</div>
          <div>Away</div>
        </div>
        <div className="max-h-32 overflow-y-auto scrollbar-dark">
          {scoreHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No scores yet</div>
          ) : (
            [...Array(Math.ceil(scoreHistory.length / 2))].map((_, idx) => {
              const homeEntry = scoreHistory.find(h => h.side === 'home' && h.turn === turnNumber - idx - 1);
              const awayEntry = scoreHistory.find(h => h.side === 'away' && h.turn === turnNumber - idx - 1);
              const turn = turnNumber - idx - 1;
              
              return (
                <div key={idx} className="grid grid-cols-3 text-center text-white text-2xl font-bold border-t border-gray-700 py-3">
                  <div className={homeEntry?.miss ? 'text-red-500' : ''}>{homeEntry ? homeEntry.score : ''}</div>
                  <div className="text-yellow-400">{turn}</div>
                  <div className={awayEntry?.miss ? 'text-red-500' : ''}>{awayEntry ? awayEntry.score : ''}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-black">
        <button
          onClick={undoLastScore}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white py-4 rounded-xl font-black text-xl hover:from-red-500 hover:to-red-600"
        >
          UNDO
        </button>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl border-4 border-black flex items-center justify-center">
          <div className="text-black text-4xl font-black">{currentThrow || ''}</div>
        </div>
        <button
          onClick={handleMiss}
          className="bg-gradient-to-br from-red-700 to-red-800 text-white py-4 rounded-xl font-black text-xl hover:from-red-600 hover:to-red-700"
        >
          MISS
        </button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-5 gap-2 p-2 bg-black">
        {/* Quick Scores Left */}
        <div className="grid grid-rows-3 gap-2">
          {[26, 41, 60].map((score) => (
            <button
              key={score}
              onClick={() => setCurrentThrow(score.toString())}
              className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg font-black text-xl hover:from-gray-500 hover:to-gray-600"
            >
              {score}
            </button>
          ))}
        </div>

        {/* Number Pad 1-9 */}
        <div className="col-span-3 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => addToThrow(num.toString())}
              className="bg-gradient-to-b from-white to-gray-200 text-black rounded-lg font-black text-5xl hover:from-gray-100 hover:to-gray-300 aspect-square flex items-center justify-center"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Quick Scores Right */}
        <div className="grid grid-rows-3 gap-2">
          {[45, 81, 85].map((score) => (
            <button
              key={score}
              onClick={() => setCurrentThrow(score.toString())}
              className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg font-black text-xl hover:from-gray-500 hover:to-gray-600"
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-black">
        <button
          onClick={() => setCurrentThrow('100')}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white py-6 rounded-xl font-black text-2xl hover:from-green-500 hover:to-green-600"
        >
          100
        </button>
        <button
          onClick={() => setCurrentThrow('180')}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white py-6 rounded-xl font-black text-2xl hover:from-red-500 hover:to-red-600"
        >
          180
        </button>
        <button
          onClick={() => setCurrentThrow('140')}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white py-6 rounded-xl font-black text-2xl hover:from-green-500 hover:to-green-600"
        >
          140
        </button>
      </div>
    </div>
  );
}

export default ScoringApp;
