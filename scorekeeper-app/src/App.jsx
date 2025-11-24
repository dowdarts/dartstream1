import { useState } from 'react';
import './App.css';

function App() {
  const [homePlayer, setHomePlayer] = useState('Home');
  const [awayPlayer, setAwayPlayer] = useState('Away');
  const [homeScore, setHomeScore] = useState(501);
  const [awayScore, setAwayScore] = useState(501);
  const [currentPlayer, setCurrentPlayer] = useState('home');
  const [currentThrow, setCurrentThrow] = useState('');
  const [sets, setSets] = useState({ home: 0, away: 0 });
  const [homeHistory, setHomeHistory] = useState([]);
  const [awayHistory, setAwayHistory] = useState([]);

  const quickScores = [26, 40, 41, 43, 45, 60, 81, 85, 100, 180, 140];

  const handleNumberClick = (num) => {
    setCurrentThrow(prev => prev + num);
  };

  const handleQuickScore = (score) => {
    if (currentPlayer === 'home') {
      setHomeScore(prev => Math.max(0, prev - score));
      setHomeHistory(prev => [score, ...prev].slice(0, 3));
      setCurrentPlayer('away');
    } else {
      setAwayScore(prev => Math.max(0, prev - score));
      setAwayHistory(prev => [score, ...prev].slice(0, 3));
      setCurrentPlayer('home');
    }
    setCurrentThrow('');
  };

  const handleBack = () => {
    setCurrentThrow(prev => prev.slice(0, -1));
  };

  const handleMiss = () => {
    setCurrentThrow('');
  };

  const submitScore = () => {
    const score = parseInt(currentThrow) || 0;
    handleQuickScore(score);
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-3/4 h-screen bg-black text-white flex flex-col overflow-hidden shadow-2xl">
      {/* Header - Player Scores */}
      <div className="grid grid-cols-3 gap-0">
        {/* Home Player */}
        <div className={`p-6 flex flex-col items-center justify-center border-r-2 border-black transition-all ${
          currentPlayer === 'home' 
            ? 'bg-white ring-4 ring-yellow-400 ring-inset' 
            : 'bg-gradient-to-b from-red-800 to-red-900 opacity-60'
        }`}>
          <div className={`text-3xl font-bold mb-3 tracking-wide ${currentPlayer === 'home' ? 'text-red-600' : 'text-white'}`}>{homePlayer}</div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold ${currentPlayer === 'home' ? 'text-red-400' : 'text-red-200'}`}>HC</span>
            <span className={`text-7xl font-black tracking-tight ${currentPlayer === 'home' ? 'text-red-600' : 'text-white'}`}>{homeScore}</span>
          </div>
          <div className={`text-base mt-2 ${currentPlayer === 'home' ? 'text-red-600' : 'text-red-100'}`}>
            {homeHistory.length > 0 ? homeHistory[0] : '0'}
          </div>
          {/* Previous Scores */}
          <div className="flex flex-col items-center mt-2 space-y-1">
            {homeHistory.slice(1, 3).map((score, index) => (
              <div key={index} className={`text-2xl font-bold ${currentPlayer === 'home' ? 'text-red-600' : 'text-red-200'}`}>
                {score}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Logo Area */}
        <div className="bg-black flex flex-col items-center justify-center p-4 border-r-2 border-black">
          <img src="/dartstream-logo.png" alt="DartStream" className="w-48 h-auto" />
        </div>

        {/* Away Player */}
        <div className={`p-6 flex flex-col items-center justify-center transition-all ${
          currentPlayer === 'away' 
            ? 'bg-white ring-4 ring-yellow-400 ring-inset' 
            : 'bg-gradient-to-b from-gray-800 to-gray-900 opacity-60'
        }`}>
          <div className={`text-3xl font-bold mb-3 tracking-wide ${currentPlayer === 'away' ? 'text-gray-800' : 'text-white'}`}>{awayPlayer}</div>
          <div className="flex items-center gap-3">
            <span className={`text-7xl font-black tracking-tight ${currentPlayer === 'away' ? 'text-gray-800' : 'text-white'}`}>{awayScore}</span>
            <span className={`text-xs font-semibold ${currentPlayer === 'away' ? 'text-gray-600' : 'text-gray-400'}`}>HC</span>
          </div>
          <div className={`text-base mt-2 ${currentPlayer === 'away' ? 'text-gray-800' : 'text-gray-200'}`}>
            {awayHistory.length > 0 ? awayHistory[0] : '0'}
          </div>
          {/* Previous Scores */}
          <div className="flex flex-col items-center mt-2 space-y-1">
            {awayHistory.slice(1, 3).map((score, index) => (
              <div key={index} className={`text-2xl font-bold ${currentPlayer === 'away' ? 'text-gray-800' : 'text-gray-300'}`}>
                {score}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dartboard Display Area */}
      <div className="flex-1 bg-black relative flex items-center justify-center min-h-0">
        <div className="text-yellow-400 text-3xl font-black absolute top-6 tracking-widest">
          SI
        </div>
        <div className="text-white text-9xl font-black tracking-tight">
          {currentThrow || '1'}
        </div>
      </div>

      {/* Game Status Bar */}
      <div className="bg-gradient-to-b from-red-700 to-red-800 px-6 py-3 flex items-center justify-center text-white shadow-lg">
        <div className="text-2xl font-bold tracking-wide">
          Set 1 &nbsp;&nbsp; {sets.home} - {sets.away}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-black">
        <button 
          onClick={handleBack}
          className="bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-2xl font-black py-4 rounded-lg shadow-lg transition-all active:scale-95"
        >
          BACK
        </button>
        <button 
          onClick={submitScore}
          className="bg-black hover:bg-gray-900 text-yellow-400 text-2xl font-black py-4 rounded-lg border-4 border-yellow-400 shadow-lg transition-all active:scale-95"
        >
          Straight-In
        </button>
        <button 
          onClick={handleMiss}
          className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-2xl font-black py-4 rounded-lg shadow-lg transition-all active:scale-95"
        >
          MISS
        </button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-4 gap-3 p-3 bg-black pb-2">
        {/* Left side - Quick scores */}
        <div className="grid grid-rows-4 gap-3">
          <button onClick={() => handleQuickScore(26)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">26</button>
          <button onClick={() => handleQuickScore(40)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">40</button>
          <button onClick={() => handleQuickScore(41)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">41</button>
          <button onClick={() => handleQuickScore(43)} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">43</button>
        </div>

        {/* Center - Number pad */}
        <div className="col-span-2 grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-4xl font-black py-8 rounded-lg shadow-lg transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Right side - Quick scores */}
        <div className="grid grid-rows-4 gap-3">
          <button onClick={() => handleQuickScore(45)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">45</button>
          <button onClick={() => handleQuickScore(60)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">60</button>
          <button onClick={() => handleQuickScore(81)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">81</button>
          <button onClick={() => handleQuickScore(85)} className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-2xl font-bold py-5 rounded-lg shadow-md transition-all active:scale-95">85</button>
        </div>
      </div>

      {/* Bottom Quick Scores */}
      <div className="grid grid-cols-3 gap-3 px-3 pb-3 bg-black">
        <button onClick={() => handleQuickScore(100)} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-3xl font-black py-5 rounded-lg shadow-lg transition-all active:scale-95">100</button>
        <button onClick={() => handleQuickScore(180)} className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-3xl font-black py-5 rounded-lg shadow-lg transition-all active:scale-95">180</button>
        <button onClick={() => handleQuickScore(140)} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-3xl font-black py-5 rounded-lg shadow-lg transition-all active:scale-95">140</button>
      </div>
      </div>
    </div>
  );
}

export default App;
