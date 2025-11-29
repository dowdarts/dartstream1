import { useState } from 'react';

function GameSetup({ onGameStart }) {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, players, settings, confirm
  const [homePlayerName, setHomePlayerName] = useState('');
  const [awayPlayerName, setAwayPlayerName] = useState('');
  const [gameType, setGameType] = useState('501');
  const [gameMode, setGameMode] = useState('straight-double');
  const [legsFormat, setLegsFormat] = useState('best-of');
  const [legsCount, setLegsCount] = useState(3);
  const [setsFormat, setSetsFormat] = useState('best-of');
  const [setsCount, setSetsCount] = useState(0);

  const handleStartGame = () => {
    const settings = {
      homePlayerName: homePlayerName || 'Home',
      awayPlayerName: awayPlayerName || 'Away',
      gameType,
      gameMode,
      legsFormat,
      legsCount,
      setsFormat,
      setsCount,
      startingScore: parseInt(gameType)
    };
    onGameStart(settings);
  };

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container max-w-2xl w-full p-8 text-center animate-fade-in">
          <h1 className="text-6xl font-black mb-4 text-white drop-shadow-lg">
            🎯 DartStream
          </h1>
          <p className="text-2xl text-white mb-8 opacity-90">
            Professional Dart Scoring System
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentStep('players')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-2xl font-bold py-6 px-8 rounded-2xl hover:from-green-500 hover:to-green-600 transition-all"
            >
              ▶ Start New Match
            </button>
            <p className="text-white text-sm opacity-75">
              Set up your game settings and start tracking scores
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Player Names
  if (currentStep === 'players') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container max-w-2xl w-full p-8 animate-fade-in">
          <h2 className="text-4xl font-black mb-6 text-white text-center">
            👥 Player Names
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white text-xl font-bold mb-2">
                🏠 Home Player
              </label>
              <input
                type="text"
                value={homePlayerName}
                onChange={(e) => setHomePlayerName(e.target.value)}
                placeholder="Enter home player name"
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-6 py-4 text-white text-2xl font-bold placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div>
              <label className="block text-white text-xl font-bold mb-2">
                ✈️ Away Player
              </label>
              <input
                type="text"
                value={awayPlayerName}
                onChange={(e) => setAwayPlayerName(e.target.value)}
                placeholder="Enter away player name"
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-6 py-4 text-white text-2xl font-bold placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold py-4 px-6 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('settings')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold py-4 px-6 rounded-xl"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Settings
  if (currentStep === 'settings') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container max-w-4xl w-full p-8 animate-fade-in overflow-y-auto max-h-screen">
          <h2 className="text-4xl font-black mb-6 text-white text-center">
            ⚙️ Game Settings
          </h2>
          
          <div className="space-y-6">
            {/* Starting Score */}
            <div>
              <label className="block text-white text-xl font-bold mb-3">
                🎯 Starting Score
              </label>
              <div className="grid grid-cols-4 gap-3">
                {['301', '501', '701', '1001'].map((score) => (
                  <button
                    key={score}
                    onClick={() => setGameType(score)}
                    className={`py-4 px-6 rounded-xl text-xl font-bold transition-all ${
                      gameType === score
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-white text-xl font-bold mb-3">
                🎲 Game Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGameMode('straight')}
                  className={`py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                    gameMode === 'straight'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Straight Out
                </button>
                <button
                  onClick={() => setGameMode('straight-double')}
                  className={`py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                    gameMode === 'straight-double'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Double Out
                </button>
                <button
                  onClick={() => setGameMode('double-double')}
                  className={`py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                    gameMode === 'double-double'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Double In/Out
                </button>
                <button
                  onClick={() => setGameMode('master')}
                  className={`py-4 px-6 rounded-xl text-lg font-bold transition-all ${
                    gameMode === 'master'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Master Out
                </button>
              </div>
            </div>

            {/* Legs Settings */}
            <div>
              <label className="block text-white text-xl font-bold mb-3">
                🏆 Legs Format
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setLegsFormat('best-of')}
                  className={`py-3 px-6 rounded-xl text-lg font-bold transition-all ${
                    legsFormat === 'best-of'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Best of
                </button>
                <button
                  onClick={() => setLegsFormat('first-to')}
                  className={`py-3 px-6 rounded-xl text-lg font-bold transition-all ${
                    legsFormat === 'first-to'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  First to
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 3, 5, 7, 9].map((count) => (
                  <button
                    key={count}
                    onClick={() => setLegsCount(count)}
                    className={`py-3 px-4 rounded-lg text-lg font-bold transition-all ${
                      legsCount === count
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Sets Settings */}
            <div>
              <label className="block text-white text-xl font-bold mb-3">
                📊 Sets (0 = Disabled)
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setSetsFormat('best-of')}
                  className={`py-3 px-6 rounded-xl text-lg font-bold transition-all ${
                    setsFormat === 'best-of'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Best of
                </button>
                <button
                  onClick={() => setSetsFormat('first-to')}
                  className={`py-3 px-6 rounded-xl text-lg font-bold transition-all ${
                    setsFormat === 'first-to'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  First to
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 3, 5, 7, 9].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSetsCount(count)}
                    className={`py-3 px-4 rounded-lg text-lg font-bold transition-all ${
                      setsCount === count
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep('players')}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold py-4 px-6 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('confirm')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold py-4 px-6 rounded-xl"
              >
                Review →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Screen
  if (currentStep === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container max-w-2xl w-full p-8 animate-fade-in">
          <h2 className="text-4xl font-black mb-6 text-white text-center">
            ✅ Confirm Settings
          </h2>
          
          <div className="space-y-4 bg-white/10 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-white/80 text-lg">Home Player:</span>
              <span className="text-white text-xl font-bold">{homePlayerName || 'Home'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-white/80 text-lg">Away Player:</span>
              <span className="text-white text-xl font-bold">{awayPlayerName || 'Away'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-white/80 text-lg">Starting Score:</span>
              <span className="text-white text-xl font-bold">{gameType}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-white/80 text-lg">Game Mode:</span>
              <span className="text-white text-xl font-bold capitalize">
                {gameMode.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-white/80 text-lg">Legs:</span>
              <span className="text-white text-xl font-bold">
                {legsFormat === 'best-of' ? 'Best of' : 'First to'} {legsCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-lg">Sets:</span>
              <span className="text-white text-xl font-bold">
                {setsCount === 0 ? 'Disabled' : `${setsFormat === 'best-of' ? 'Best of' : 'First to'} ${setsCount}`}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('settings')}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold py-4 px-6 rounded-xl"
            >
              ← Edit
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-bold py-4 px-6 rounded-xl animate-pulse-glow"
            >
              🎯 Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default GameSetup;
