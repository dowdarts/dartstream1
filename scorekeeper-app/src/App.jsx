import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    // Ton popup state
    const [tonMessage, setTonMessage] = useState("");
  const [firstThrowMessage, setFirstThrowMessage] = useState("");
  const [welcomePageShown, setWelcomePageShown] = useState(false);
  const [presetSelected, setPresetSelected] = useState(false);
  const [namesEntered, setNamesEntered] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [homePlayerName, setHomePlayerName] = useState('Home');
  const [awayPlayerName, setAwayPlayerName] = useState('Away');
  const [gameType, setGameType] = useState('501');
  const [gameMode, setGameMode] = useState('straight-double');
  const [legsFormat, setLegsFormat] = useState('best-of');
  const [legsCount, setLegsCount] = useState(3);
  const [setsFormat, setSetsFormat] = useState('best-of');
  const [setsCount, setSetsCount] = useState(0);
  
  const getGameMode = () => {
    return gameMode;
  };

  const getRequiredLegs = () => {
    return legsFormat === 'best-of' ? Math.ceil(legsCount / 2) : legsCount;
  };

  const getRequiredSets = () => {
    if (setsCount === 0) return 0;
    return setsFormat === 'best-of' ? Math.ceil(setsCount / 2) : setsCount;
  };

  const checkMatchWinner = (homeSets, awaySets, homeLegs, awayLegs) => {
    // If no sets (sets = 0), check legs for match winner
    if (setsCount === 0) {
      const requiredLegs = getRequiredLegs();
      if (homeLegs >= requiredLegs) return 'home';
      if (awayLegs >= requiredLegs) return 'away';
    } else {
      // If sets are configured, check sets for match winner
      const requiredSets = getRequiredSets();
      if (homeSets >= requiredSets) return 'home';
      if (awaySets >= requiredSets) return 'away';
    }
    return null;
  };
  
  const [homePlayer, setHomePlayer] = useState('Home');
  const [awayPlayer, setAwayPlayer] = useState('Away');
  const [homeScore, setHomeScore] = useState(501);
  const [awayScore, setAwayScore] = useState(501);
  const [startingScore, setStartingScore] = useState(501);
  const [currentPlayer, setCurrentPlayer] = useState('home');
  const [currentThrow, setCurrentThrow] = useState('');
  const [sets, setSets] = useState({ home: 0, away: 0 });
  const [legs, setLegs] = useState({ home: 0, away: 0 });
  const [homeHistory, setHomeHistory] = useState([]);
  const [awayHistory, setAwayHistory] = useState([]);
  const [homeDartsThrown, setHomeDartsThrown] = useState(0);
  const [awayDartsThrown, setAwayDartsThrown] = useState(0);
  const [homeMatchDarts, setHomeMatchDarts] = useState(0);
  const [awayMatchDarts, setAwayMatchDarts] = useState(0);
  const [homeMatchScore, setHomeMatchScore] = useState(0);
  const [awayMatchScore, setAwayMatchScore] = useState(0);
  const [scoreLog, setScoreLog] = useState([]);
  const [turnNumber, setTurnNumber] = useState(1);
  const [startingPlayer, setStartingPlayer] = useState('home');
  const [initialStartingPlayer, setInitialStartingPlayer] = useState('home');
  const [showWinConfirm, setShowWinConfirm] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [coinResult, setCoinResult] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);
  const [showMatchWin, setShowMatchWin] = useState(false);
  const [showDartCount, setShowDartCount] = useState(false);
  const [checkoutPlayer, setCheckoutPlayer] = useState(null);
  const [editingScore, setEditingScore] = useState(null); // { turn, player }
  const [previousLegData, setPreviousLegData] = useState(null); // Store previous leg data for undo
  const [homeEnteredGame, setHomeEnteredGame] = useState(false); // Track if home has entered in double-in
  const [awayEnteredGame, setAwayEnteredGame] = useState(false); // Track if away has entered in double-in

  const quickScores = [26, 40, 41, 43, 45, 60, 81, 85, 100, 180, 140];

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle keyboard when game is started (not in setup screens)
      if (!gameStarted) return;
      
      // Prevent default for keys we're handling
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleMiss();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, currentThrow, editingScore, scoreLog, previousLegData, legs, sets]);

  const handleNumberClick = (num) => {
    if (editingScore?.firstEdit) {
      // In edit mode, first click replaces the entire value
      const newValue = String(num);
      // Only allow if it's 0-180
      if (parseInt(newValue) <= 180) {
        setCurrentThrow(newValue);
        setEditingScore({ ...editingScore, firstEdit: false });
      }
    } else {
      const newValue = currentThrow + String(num);
      // Parse the value to check if it's valid
      // Check for addition expressions (e.g., "60+60")
      if (newValue.includes('+')) {
        const parts = newValue.split('+');
        const sum = parts.reduce((acc, part) => acc + (parseInt(part) || 0), 0);
        if (sum <= 180) {
          setCurrentThrow(newValue);
        }
      } else {
        // Simple number, check if it's 0-180
        if (parseInt(newValue) <= 180) {
          setCurrentThrow(newValue);
        }
      }
    }
  };

  const handleMultiply = () => {
    if (currentThrow) {
      const multiplied = parseInt(currentThrow) * 3;
      // Only allow multiplication if result is 0-180
      if (multiplied <= 180) {
        setCurrentThrow(multiplied.toString());
      }
    }
  };

  const handleAdd = () => {
    if (currentThrow && !currentThrow.endsWith('+')) {
      setCurrentThrow(prev => prev + '+');
    }
  };

  const handleClear = () => {
    setCurrentThrow('');
  };

  const handleBust = () => {
    handleQuickScore(999); // Use a high number to trigger bust logic
  };

  const handleEditScore = (turn, player) => {
    const entry = scoreLog.find(e => e.turn === turn && e.player === player);
    if (entry) {
      const score = player === 'home' ? entry.homeScore : entry.awayScore;
      if (score !== null) {
        setCurrentThrow(score.toString());
        setEditingScore({ turn, player, firstEdit: true });
      }
    }
  };

  const evaluateExpression = (expression) => {
    try {
      // Split by + and sum all numbers
      const parts = expression.split('+').filter(p => p.trim());
      const total = parts.reduce((sum, part) => sum + parseInt(part.trim()), 0);
      return total;
    } catch (e) {
      return 0;
    }
  };

  const handleQuickScore = (score) => {
    // If in edit mode with first edit flag, replace the value
    if (editingScore?.firstEdit) {
      setCurrentThrow(score.toString());
      setEditingScore({ ...editingScore, firstEdit: false });
      return;
    }
    // Ton popup logic
    if (score >= 95) {
      let msg = "";
      if (score >= 95 && score < 100) {
        msg = `${score}!`;
      } else if (score === 100) {
        msg = "Ton!";
      } else if (score > 100 && score < 111) {
        msg = `${score}!`;
      } else if (score >= 111) {
        msg = `Ton${score - 100}!`;
      }
      setTonMessage(msg);
      setTimeout(() => setTonMessage(""), 3000);
    }
    
    if (currentPlayer === 'home') {
      const currentScore = homeScore;
      const newScore = currentScore - score;
      
      // Check for bust (score goes below 0 or equals 1)
      if (newScore < 0 || newScore === 1) {
        // Bust: keep old score, add 0 to log, count 3 darts
        setTonMessage("BUST!");
        setTimeout(() => setTonMessage(""), 3000);
        setHomeHistory(prev => [0, ...prev].slice(0, 3));
        setScoreLog(prev => [{ player: 'home', turn: turnNumber, homeScore: 0, awayScore: null, remaining: currentScore, bust: true }, ...prev]);
        setHomeDartsThrown(prev => prev + 3);
        setHomeMatchDarts(prev => prev + 3);
        setCurrentPlayer('away');
      } else if (newScore === 0 && score > 0) {
        // Checkout - only trigger if score being entered is > 0
        setHomeScore(newScore);
        setHomeHistory(prev => [score, ...prev].slice(0, 3));
        setHomeMatchScore(prev => prev + score);
        setScoreLog(prev => [{ player: 'home', turn: turnNumber, homeScore: score, awayScore: null, remaining: newScore }, ...prev]);
        setCheckoutPlayer('home');
        setShowDartCount(true);
      } else if (newScore === 0 && score === 0 && currentScore === 0) {
        // Already at 0, re-trigger checkout
        setCheckoutPlayer('home');
        setShowDartCount(true);
      } else {
        // Valid score
        setHomeScore(newScore);
        setHomeHistory(prev => [score, ...prev].slice(0, 3));
        setHomeMatchScore(prev => prev + score);
        setScoreLog(prev => [{ player: 'home', turn: turnNumber, homeScore: score, awayScore: null, remaining: newScore }, ...prev]);
        setHomeDartsThrown(prev => prev + 3);
        setHomeMatchDarts(prev => prev + 3);
        
        // Show IN! message in double-double mode when player enters for first time
        if (score > 0 && !homeEnteredGame && getGameMode() === 'double-double') {
          setTonMessage(`${score} IN!`);
          setTimeout(() => setTonMessage(""), 3000);
        }
        
        if (score > 0) setHomeEnteredGame(true);
        setCurrentPlayer('away');
      }
    } else {
      const currentScore = awayScore;
      const newScore = currentScore - score;
      
      // Check for bust (score goes below 0 or equals 1)
      if (newScore < 0 || newScore === 1) {
        // Bust: keep old score, add 0 to log, count 3 darts
        setTonMessage("BUST!");
        setTimeout(() => setTonMessage(""), 3000);
        setAwayHistory(prev => [0, ...prev].slice(0, 3));
        setScoreLog(prev => [{ player: 'away', turn: turnNumber, homeScore: null, awayScore: 0, remaining: currentScore, bust: true }, ...prev]);
        setAwayDartsThrown(prev => prev + 3);
        setAwayMatchDarts(prev => prev + 3);
        setCurrentPlayer('home');
        setTurnNumber(prev => prev + 1);
      } else if (newScore === 0 && score > 0) {
        // Checkout - only trigger if score being entered is > 0
        setAwayScore(newScore);
        setAwayHistory(prev => [score, ...prev].slice(0, 3));
        setAwayMatchScore(prev => prev + score);
        setScoreLog(prev => [{ player: 'away', turn: turnNumber, homeScore: null, awayScore: score, remaining: newScore }, ...prev]);
        setCheckoutPlayer('away');
        setShowDartCount(true);
      } else if (newScore === 0 && score === 0 && currentScore === 0) {
        // Already at 0, re-trigger checkout
        setCheckoutPlayer('away');
        setShowDartCount(true);
      } else {
        // Valid score
        setAwayScore(newScore);
        setAwayHistory(prev => [score, ...prev].slice(0, 3));
        setAwayMatchScore(prev => prev + score);
        setScoreLog(prev => [{ player: 'away', turn: turnNumber, homeScore: null, awayScore: score, remaining: newScore }, ...prev]);
        setAwayDartsThrown(prev => prev + 3);
        setAwayMatchDarts(prev => prev + 3);
        
        // Show IN! message in double-double mode when player enters for first time
        if (score > 0 && !awayEnteredGame && getGameMode() === 'double-double') {
          setTonMessage(`${score} IN!`);
          setTimeout(() => setTonMessage(""), 3000);
        }
        
        if (score > 0) setAwayEnteredGame(true);
        setCurrentPlayer('home');
        setTurnNumber(prev => prev + 1);
      }
    }
    setCurrentThrow('');
  };

  const handleBack = () => {
    // If in edit mode, handle digit-by-digit undo
    if (editingScore) {
      // If currentThrow is empty or 0, delete the whole action
      if (!currentThrow || currentThrow === '0' || currentThrow === '') {
        const lastEntry = scoreLog[0];
        const lastPlayer = lastEntry.player;
        const remainingLog = scoreLog.slice(1);
        
        // Remove the last entry from score log
        setScoreLog(prev => prev.slice(1));
        
        if (lastPlayer === 'home') {
          // Restore home player's previous score
          const scoreToRevert = lastEntry.homeScore || 0;
          setHomeScore(prev => prev + scoreToRevert);
          setHomeHistory(prev => prev.slice(1));
          setHomeMatchScore(prev => prev - scoreToRevert);
          
          setHomeDartsThrown(prev => Math.max(0, prev - 3));
          setHomeMatchDarts(prev => Math.max(0, prev - 3));
          
          // Set current player back to home
          setCurrentPlayer('home');
          
          // Home threw, so check if we need to decrement turn
          // Turn should be decremented if there's no away throw with the same turn number remaining
          const awayThrowInSameTurn = remainingLog.find(e => e.turn === lastEntry.turn && e.player === 'away');
          if (!awayThrowInSameTurn) {
            // No away throw in this turn, so decrement turn
            setTurnNumber(prev => Math.max(1, prev - 1));
          } else {
            // Away already threw in this turn, keep the same turn number
            setTurnNumber(lastEntry.turn);
          }
        } else {
          // Restore away player's previous score
          const scoreToRevert = lastEntry.awayScore || 0;
          setAwayScore(prev => prev + scoreToRevert);
          setAwayHistory(prev => prev.slice(1));
          setAwayMatchScore(prev => prev - scoreToRevert);
          
          setAwayDartsThrown(prev => Math.max(0, prev - 3));
          setAwayMatchDarts(prev => Math.max(0, prev - 3));
          
          // Set current player back to away
          setCurrentPlayer('away');
          
          // Away threw, so we're undoing the completion of a turn
          // Check if home threw in this turn
          const homeThrowInSameTurn = remainingLog.find(e => e.turn === lastEntry.turn && e.player === 'home');
          if (homeThrowInSameTurn) {
            // Home threw first in this turn, keep the same turn number
            setTurnNumber(lastEntry.turn);
          } else {
            // Away threw first (less common), decrement turn
            setTurnNumber(prev => Math.max(1, prev - 1));
          }
        }
        
        setCurrentThrow('');
        setEditingScore(null);
        return;
      }
      
      // Otherwise, remove one digit from the right
      setCurrentThrow(prev => prev.slice(0, -1));
      return;
    }
    
    // If there's text being entered (not in edit mode), remove last character
    if (currentThrow && !editingScore) {
      setCurrentThrow(prev => prev.slice(0, -1));
      return;
    }
    
    // If there are scores in the log, enter edit mode with the last score
    if (scoreLog.length > 0) {
      const lastEntry = scoreLog[0];
      const lastPlayer = lastEntry.player;
      const lastScore = lastPlayer === 'home' ? lastEntry.homeScore : lastEntry.awayScore;
      
      // Set the last score in currentThrow and enter edit mode with firstEdit=true to allow overwrite
      setCurrentThrow(lastScore.toString());
      setEditingScore({ turn: lastEntry.turn, player: lastPlayer, firstEdit: true });
      setCurrentPlayer(lastPlayer);
      return;
    }
    
    // If game just started with no scores and no previous leg, return to main menu
    if (scoreLog.length === 0 && !previousLegData && legs.home === 0 && legs.away === 0) {
      setGameStarted(false);
      setHomeScore(501);
      setAwayScore(501);
      setScoreLog([]);
      setCurrentThrow('');
      setLegs({ home: 0, away: 0 });
      setSets({ home: 0, away: 0 });
      setHomeDartsThrown(0);
      setAwayDartsThrown(0);
      setHomeMatchDarts(0);
      setAwayMatchDarts(0);
      setHomeMatchScore(0);
      setAwayMatchScore(0);
      return;
    }
    
    // If we're in a new leg with no scores entered and previous leg data exists, go to previous leg
    if (scoreLog.length === 0 && previousLegData) {
      handlePreviousLeg();
    }
  };

  const handleMiss = () => {
    if (currentThrow) {
      // If there's a score entered, evaluate and submit it
      const score = evaluateExpression(currentThrow);
      
      if (editingScore) {
        // Update existing score
        setScoreLog(prev => prev.map(entry => {
          if (entry.turn === editingScore.turn && entry.player === editingScore.player) {
            const oldScore = editingScore.player === 'home' ? entry.homeScore : entry.awayScore;
            const scoreDiff = score - oldScore;
            
            if (editingScore.player === 'home') {
              // Add back the old score, then subtract the new score
              const newRemaining = entry.remaining + oldScore - score;
              
              // Check if edit would result in negative or 1 - treat as bust (0 score)
              if (newRemaining < 0 || newRemaining === 1) {
                setHomeScore(entry.remaining + oldScore);
                setHomeMatchScore(prev => prev - oldScore);
                setTonMessage("BUST!");
                setTimeout(() => setTonMessage(""), 3000);
                return { ...entry, homeScore: 0, remaining: entry.remaining + oldScore, bust: true };
              }
              
              setHomeScore(newRemaining);
              setHomeMatchScore(prev => prev + scoreDiff);
              return { ...entry, homeScore: score, remaining: newRemaining, bust: false };
            } else {
              // Add back the old score, then subtract the new score
              const newRemaining = entry.remaining + oldScore - score;
              
              // Check if edit would result in negative or 1 - treat as bust (0 score)
              if (newRemaining < 0 || newRemaining === 1) {
                setAwayScore(entry.remaining + oldScore);
                setAwayMatchScore(prev => prev - oldScore);
                setTonMessage("BUST!");
                setTimeout(() => setTonMessage(""), 3000);
                return { ...entry, awayScore: 0, remaining: entry.remaining + oldScore, bust: true };
              }
              
              setAwayScore(newRemaining);
              setAwayMatchScore(prev => prev + scoreDiff);
              return { ...entry, awayScore: score, remaining: newRemaining, bust: false };
            }
          }
          return entry;
        }));
        setEditingScore(null);
        setCurrentThrow('');
        
        // Switch to next player after editing
        if (editingScore.player === 'home') {
          setCurrentPlayer('away');
        } else {
          setCurrentPlayer('home');
        }
      } else {
        handleQuickScore(score);
      }
    } else {
      // If no score, just switch to next player (miss)
      if (currentPlayer === 'home') {
        setHomeDartsThrown(prev => prev + 3);
        setHomeMatchDarts(prev => prev + 3);
        setScoreLog(prev => [{ player: 'home', turn: turnNumber, homeScore: 0, awayScore: null, remaining: homeScore }, ...prev]);
        setCurrentPlayer('away');
      } else {
        setAwayDartsThrown(prev => prev + 3);
        setAwayMatchDarts(prev => prev + 3);
        setScoreLog(prev => [{ player: 'away', turn: turnNumber, homeScore: null, awayScore: 0, remaining: awayScore }, ...prev]);
        setCurrentPlayer('home');
        setTurnNumber(prev => prev + 1);
      }
    }
  };

  const submitScore = () => {
    const score = parseInt(currentThrow) || 0;
    handleQuickScore(score);
  };

  const selectDartCount = (dartCount) => {
    // Update darts thrown based on actual darts used for checkout
    if (checkoutPlayer === 'home') {
      setHomeDartsThrown(prev => prev + dartCount);
      setHomeMatchDarts(prev => prev + dartCount);
    } else {
      setAwayDartsThrown(prev => prev + dartCount);
      setAwayMatchDarts(prev => prev + dartCount);
    }
    
    setShowDartCount(false);
    setWinningPlayer(checkoutPlayer);
    setCheckoutPlayer(null);
    setShowWinConfirm(true);
  };

  const cancelCheckout = () => {
    // Revert the checkout - remove the last score log entry and restore previous score
    setScoreLog(prev => prev.slice(1)); // Remove the checkout entry
    
    if (checkoutPlayer === 'home') {
      // Find previous score from log or use starting score
      const previousEntry = scoreLog.find(entry => entry.player === 'home' && entry.homeScore !== null);
      const previousScore = previousEntry ? previousEntry.remaining : startingScore;
      setHomeScore(previousScore);
      setHomeHistory(prev => prev.slice(1)); // Remove the checkout score from history
      setHomeMatchScore(prev => prev - (previousEntry ? scoreLog[0].homeScore : 0));
    } else {
      // Find previous score from log or use starting score
      const previousEntry = scoreLog.find(entry => entry.player === 'away' && entry.awayScore !== null);
      const previousScore = previousEntry ? previousEntry.remaining : startingScore;
      setAwayScore(previousScore);
      setAwayHistory(prev => prev.slice(1)); // Remove the checkout score from history
      setAwayMatchScore(prev => prev - (previousEntry ? scoreLog[0].awayScore : 0));
    }
    
    setShowDartCount(false);
    setCheckoutPlayer(null);
    setCurrentThrow('');
  };

  const confirmWin = () => {
    let newHomeLegs = legs.home;
    let newAwayLegs = legs.away;
    let newHomeSets = sets.home;
    let newAwaySets = sets.away;
    let setWon = false;

    // Award leg to winner
    if (winningPlayer === 'home') {
      newHomeLegs += 1;
      setLegs(prev => ({ ...prev, home: prev.home + 1 }));
    } else {
      newAwayLegs += 1;
      setLegs(prev => ({ ...prev, away: prev.away + 1 }));
    }

    // Check if we need to award a set (only if sets are configured)
    if (setsCount > 0) {
      const requiredLegs = getRequiredLegs();
      if (newHomeLegs >= requiredLegs) {
        newHomeSets += 1;
        setSets(prev => ({ ...prev, home: prev.home + 1 }));
        // Reset legs for new set
        newHomeLegs = 0;
        newAwayLegs = 0;
        setLegs({ home: 0, away: 0 });
        setWon = true;
        // Show match winner screen when a set is won
        setMatchWinner(winningPlayer);
        setShowMatchWin(true);
        setShowWinConfirm(false);
        return;
      } else if (newAwayLegs >= requiredLegs) {
        newAwaySets += 1;
        setSets(prev => ({ ...prev, away: prev.away + 1 }));
        // Reset legs for new set
        newHomeLegs = 0;
        newAwayLegs = 0;
        setLegs({ home: 0, away: 0 });
        setWon = true;
        // Show match winner screen when a set is won
        setMatchWinner(winningPlayer);
        setShowMatchWin(true);
        setShowWinConfirm(false);
        return;
      }
    }

    // Check if match winner condition is met (no sets configured - check legs only)
    const matchResult = checkMatchWinner(newHomeSets, newAwaySets, newHomeLegs, newAwayLegs);
    
    if (matchResult) {
      // Show match winner screen - match can continue or end based on user choice
      setMatchWinner(matchResult);
      setShowMatchWin(true);
      setShowWinConfirm(false);
    } else {
      // No match winner yet - start new leg
      setShowWinConfirm(false);
      startNewLeg(setWon);
    }
  };

  const startNewLeg = (setWasWon = false) => {
    // Save current leg data before resetting
    setPreviousLegData({
      homeScore,
      awayScore,
      homeDartsThrown,
      awayDartsThrown,
      scoreLog,
      turnNumber,
      startingPlayer,
      legs: { ...legs },
      sets: { ...sets }
    });
    
    // Reset game scores and stats for new leg
    setHomeScore(startingScore);
    setAwayScore(startingScore);
    setHomeDartsThrown(0);
    setAwayDartsThrown(0);
    setScoreLog([]);
    setTurnNumber(1);
    setHomeEnteredGame(false);
    setAwayEnteredGame(false);
    
    // Always switch starting player after every leg
    const nextStarter = startingPlayer === 'home' ? 'away' : 'home';
    setStartingPlayer(nextStarter);
    setCurrentPlayer(nextStarter);
    
    // Show first throw message if a set was won
    if (setWasWon) {
      const firstPlayerName = nextStarter === 'home' ? homePlayer : awayPlayer;
      setFirstThrowMessage(`${firstPlayerName} to throw first`);
      setTimeout(() => setFirstThrowMessage(""), 3000);
    }
  };

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    setCoinResult(result);
    setShowCoinToss(true);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setShowCoinToss(false);
      setCoinResult(null);
    }, 4000);
  };

  const closeCoinToss = () => {
    setShowCoinToss(false);
    setCoinResult(null);
  };

  const startGame = () => {
    const score = parseInt(gameType);
    setStartingScore(score);
    const homePlayerDisplayName = homePlayerName || 'Home';
    const awayPlayerDisplayName = awayPlayerName || 'Away';
    setHomePlayer(homePlayerDisplayName);
    setAwayPlayer(awayPlayerDisplayName);
    setHomeScore(score);
    setAwayScore(score);
    setCurrentPlayer(startingPlayer);
    setInitialStartingPlayer(startingPlayer);
    setGameStarted(true);
    
    // Show first throw message
    const firstPlayer = startingPlayer === 'home' ? homePlayerDisplayName : awayPlayerDisplayName;
    setFirstThrowMessage(firstPlayer);
    setTimeout(() => setFirstThrowMessage(""), 3000);
  };

  const resetLeg = () => {
    // Save current leg data before resetting
    setPreviousLegData({
      homeScore,
      awayScore,
      homeDartsThrown,
      awayDartsThrown,
      scoreLog,
      turnNumber,
      startingPlayer,
      legs: { ...legs },
      sets: { ...sets }
    });
    
    setHomeScore(startingScore);
    setAwayScore(startingScore);
    setHomeDartsThrown(0);
    setAwayDartsThrown(0);
    setScoreLog([]);
    setTurnNumber(1);
    setCurrentThrow('');
    setShowWinConfirm(false);
    setWinningPlayer(null);
    setHomeEnteredGame(false);
    setAwayEnteredGame(false);
    // Alternate starting player for next leg based on total legs completed
    // Use the total completed legs count to determine the next starter
    const totalCompletedLegs = legs.home + legs.away;
    const nextStarter = (totalCompletedLegs % 2 === 0) ? initialStartingPlayer : (initialStartingPlayer === 'home' ? 'away' : 'home');
    setStartingPlayer(nextStarter);
    setCurrentPlayer(nextStarter);
  };

  const handlePreviousLeg = () => {
    if (previousLegData) {
      // Restore previous leg state
      setHomeDartsThrown(previousLegData.homeDartsThrown);
      setAwayDartsThrown(previousLegData.awayDartsThrown);
      setScoreLog(previousLegData.scoreLog);
      setTurnNumber(previousLegData.turnNumber);
      setStartingPlayer(previousLegData.startingPlayer);
      setCurrentPlayer(previousLegData.startingPlayer);
      setLegs(previousLegData.legs);
      setSets(previousLegData.sets);
      
      // Get the remaining scores from the most recent log entry for each player
      if (previousLegData.scoreLog.length > 0) {
        const lastEntry = previousLegData.scoreLog[0];
        const lastPlayer = lastEntry.player;
        
        // Reconstruct scores by going through log in reverse (oldest to newest)
        let homeRemaining = startingScore;
        let awayRemaining = startingScore;
        
        // Process entries from oldest to newest to calculate current remaining scores
        for (let i = previousLegData.scoreLog.length - 1; i >= 0; i--) {
          const entry = previousLegData.scoreLog[i];
          if (entry.player === 'home' && entry.homeScore !== null) {
            if (entry.bust) {
              // Bust doesn't change the score
              continue;
            } else {
              homeRemaining -= entry.homeScore;
            }
          } else if (entry.player === 'away' && entry.awayScore !== null) {
            if (entry.bust) {
              // Bust doesn't change the score
              continue;
            } else {
              awayRemaining -= entry.awayScore;
            }
          }
        }
        
        setHomeScore(homeRemaining);
        setAwayScore(awayRemaining);
        
        const lastScore = lastPlayer === 'home' ? lastEntry.homeScore : lastEntry.awayScore;
        if (lastScore !== null) {
          setCurrentThrow(lastScore.toString());
          setEditingScore({ turn: lastEntry.turn, player: lastPlayer, firstEdit: true });
        } else {
          setCurrentThrow('');
        }
      } else {
        setHomeScore(startingScore);
        setAwayScore(startingScore);
        setCurrentThrow('');
      }
      
      setPreviousLegData(null);
    }
  };

  const calculateAverage = (totalScoreUsed, dartsThrown) => {
    if (dartsThrown === 0) return '0.00';
    return ((totalScoreUsed / dartsThrown) * 3).toFixed(2);
  };

  const homeLegAverage = calculateAverage(startingScore - homeScore, homeDartsThrown);
  const awayLegAverage = calculateAverage(startingScore - awayScore, awayDartsThrown);
  const homeMatchAverage = calculateAverage(homeMatchScore, homeMatchDarts);
  const awayMatchAverage = calculateAverage(awayMatchScore, awayMatchDarts);

  // Welcome Page with Preset Game Modes
  if (!welcomePageShown) {
    const selectPreset = (type, legs, mode) => {
      setGameType(type);
      setLegsCount(legs);
      setLegsFormat('best-of');
      setSetsCount(0);
      setGameMode(mode);
      setPresetSelected(true);
      setWelcomePageShown(true);
    };

    return (
      <div className="h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-12 rounded-xl shadow-2xl border-4 border-yellow-400 max-w-3xl w-full">
          <div className="flex flex-col items-center mb-10">
            <img src="dartstream-logo.png" alt="DartStream" className="w-72 h-auto mb-6" />
            <h1 className="text-6xl font-black text-yellow-400 text-center mb-2">Welcome to</h1>
            <h2 className="text-7xl font-black text-white text-center">DartStream</h2>
          </div>
          
          <h3 className="text-3xl font-bold text-white text-center mb-6">Select Game Mode</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* 501 Best of 3 SIDO */}
            <button
              onClick={() => selectPreset('501', 3, 'straight-double')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-6 rounded-lg shadow-lg transition-all active:scale-95 border-2 border-blue-400"
            >
              <div className="text-3xl font-black mb-1">501 - Best of 3</div>
              <div className="text-lg font-semibold">Straight In / Double Out</div>
            </button>

            {/* 501 Best of 5 SIDO */}
            <button
              onClick={() => selectPreset('501', 5, 'straight-double')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-6 rounded-lg shadow-lg transition-all active:scale-95 border-2 border-green-400"
            >
              <div className="text-3xl font-black mb-1">501 - Best of 5</div>
              <div className="text-lg font-semibold">Straight In / Double Out</div>
            </button>

            {/* 301 Best of 3 DIDO */}
            <button
              onClick={() => selectPreset('301', 3, 'double-double')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white p-6 rounded-lg shadow-lg transition-all active:scale-95 border-2 border-purple-400"
            >
              <div className="text-3xl font-black mb-1">301 - Best of 3</div>
              <div className="text-lg font-semibold">Double In / Double Out</div>
            </button>

            {/* 301 Best of 5 DIDO */}
            <button
              onClick={() => selectPreset('301', 5, 'double-double')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-6 rounded-lg shadow-lg transition-all active:scale-95 border-2 border-red-400"
            >
              <div className="text-3xl font-black mb-1">301 - Best of 5</div>
              <div className="text-lg font-semibold">Double In / Double Out</div>
            </button>
          </div>

          {/* Custom Setup Option */}
          <button
            onClick={() => {
              setPresetSelected(false);
              setWelcomePageShown(true);
            }}
            className="w-full mt-6 bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95 border-2 border-gray-600"
          >
            Custom Setup
          </button>
        </div>
      </div>
    );
  }

  // Name Entry Page
  if (!namesEntered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-12 rounded-xl shadow-2xl border-4 border-yellow-400 max-w-2xl w-full">
          <div className="flex flex-col items-center mb-8">
            <img src="dartstream-logo.png" alt="DartStream" className="w-64 h-auto mb-4" />
            <h1 className="text-6xl font-black text-yellow-400 text-center">Player Names</h1>
          </div>
          
          {/* Home Player Name */}
          <div className="mb-8">
            <label className="block text-2xl font-bold text-white mb-3">Home Player</label>
            <input
              type="text"
              value={homePlayerName}
              onChange={(e) => setHomePlayerName(e.target.value)}
              placeholder="Enter home player name"
              className="w-full px-6 py-5 text-3xl bg-gray-700 text-white rounded-lg border-4 border-gray-600 focus:border-yellow-400 focus:outline-none font-bold text-center"
              autoFocus
            />
          </div>
          
          {/* Away Player Name */}
          <div className="mb-10">
            <label className="block text-2xl font-bold text-white mb-3">Away Player</label>
            <input
              type="text"
              value={awayPlayerName}
              onChange={(e) => setAwayPlayerName(e.target.value)}
              placeholder="Enter away player name"
              className="w-full px-6 py-5 text-3xl bg-gray-700 text-white rounded-lg border-4 border-gray-600 focus:border-yellow-400 focus:outline-none font-bold text-center"
            />
          </div>
          
          {/* Continue Button */}
          <button
            onClick={() => {
              if (homePlayerName.trim() && awayPlayerName.trim()) {
                setHomePlayer(homePlayerName.trim());
                setAwayPlayer(awayPlayerName.trim());
                setNamesEntered(true);
                // If preset was selected, skip setup and go directly to start page
                if (presetSelected) {
                  setSetupComplete(true);
                }
              }
            }}
            disabled={!homePlayerName.trim() || !awayPlayerName.trim()}
            className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 text-4xl font-black py-6 rounded-lg shadow-lg transition-all active:scale-95"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  // Skip setup page if preset was selected
  if (!setupComplete && !presetSelected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border-4 border-yellow-400 max-w-4xl w-full">
          <h1 className="text-5xl font-black text-yellow-400 mb-8 text-center">Game Setup</h1>
          
          {/* Display Player Names */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border-2 border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400 mb-1">Home Player</div>
                <div className="text-2xl font-bold text-white">{homePlayer}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Away Player</div>
                <div className="text-2xl font-bold text-white">{awayPlayer}</div>
              </div>
            </div>
            <button
              onClick={() => setNamesEntered(false)}
              className="w-full mt-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-all"
            >
              Change Names
            </button>
          </div>
          
          {/* Game Type Selection */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-white mb-3">Game Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGameType('501')}
                className={`py-4 px-3 text-lg font-bold rounded-lg transition-all ${
                  gameType === '501'
                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                501<br/>
                <span className="text-sm">Straight In / Double Out</span>
              </button>
              <button
                onClick={() => setGameType('301')}
                className={`py-4 px-3 text-lg font-bold rounded-lg transition-all ${
                  gameType === '301'
                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                301<br/>
                <span className="text-sm">Double In / Double Out</span>
              </button>
            </div>
          </div>
          
          {/* Sets Format */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-white mb-3">Sets Format</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <button
                onClick={() => setSetsFormat('best-of')}
                className={`py-3 text-lg font-bold rounded-lg transition-all ${
                  setsFormat === 'best-of'
                    ? 'bg-gradient-to-b from-purple-600 to-purple-700 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Best of
              </button>
              <button
                onClick={() => setSetsFormat('play-all')}
                className={`py-3 text-lg font-bold rounded-lg transition-all ${
                  setsFormat === 'play-all'
                    ? 'bg-gradient-to-b from-purple-600 to-purple-700 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Play All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-lg text-white">Number of Sets:</label>
              <input
                type="number"
                min="0"
                max="99"
                value={setsCount}
                onChange={(e) => setSetsCount(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 text-xl font-bold text-center bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-purple-400 focus:outline-none"
              />
              <span className="text-sm text-gray-400">
                {setsCount === 0 ? '(No sets)' : setsFormat === 'best-of' ? `(First to ${Math.ceil(setsCount / 2)})` : `(Play all ${setsCount})`}
              </span>
            </div>
          </div>
          
          {/* Legs Format */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-white mb-3">Legs Format</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <button
                onClick={() => setLegsFormat('best-of')}
                className={`py-3 text-lg font-bold rounded-lg transition-all ${
                  legsFormat === 'best-of'
                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Best of
              </button>
              <button
                onClick={() => setLegsFormat('play-all')}
                className={`py-3 text-lg font-bold rounded-lg transition-all ${
                  legsFormat === 'play-all'
                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Play All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-lg text-white">Number of Legs:</label>
              <input
                type="number"
                min="1"
                max="99"
                value={legsCount}
                onChange={(e) => setLegsCount(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 text-xl font-bold text-center bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-blue-400 focus:outline-none"
              />
              <span className="text-sm text-gray-400">
                {legsFormat === 'best-of' ? `(First to ${Math.ceil(legsCount / 2)})` : `(Play all ${legsCount})`}
              </span>
            </div>
          </div>
          
          {/* Continue Button */}
          <button
            onClick={() => setSetupComplete(true)}
            className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-3xl font-black py-5 rounded-lg shadow-lg transition-all active:scale-95"
          >
            CONTINUE
          </button>

          {/* Back Button */}
          <button
            onClick={() => setNamesEntered(false)}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold py-3 rounded-lg transition-all"
          >
            ← Back to Names
          </button>
        </div>
      </div>
    );
  }

  // Coin Toss & Starting Player Page
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-12 rounded-xl shadow-2xl border-4 border-yellow-400 max-w-2xl w-full">
          <div className="flex flex-col items-center mb-8">
            <img src="dartstream-logo.png" alt="DartStream" className="w-48 h-auto mb-4" />
            <h1 className="text-5xl font-black text-yellow-400 text-center">Who Starts?</h1>
          </div>

          {/* Display Match Info */}
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border-2 border-gray-700 text-center">
            <div className="text-2xl font-bold text-white mb-2">{homePlayer} vs {awayPlayer}</div>
            <div className="text-lg text-gray-400">
              {gameType} - {legsFormat === 'best-of' ? 'Best of' : 'Play All'} {legsCount} {legsCount === 1 ? 'Leg' : 'Legs'}
            </div>
          </div>
          
          {/* Starting Player Selection */}
          <div className="mb-8">
            <label className="block text-2xl font-bold text-white mb-4 text-center">Select Starting Player</label>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setStartingPlayer('home')}
                className={`py-8 px-6 text-3xl font-bold rounded-lg transition-all ${
                  startingPlayer === 'home'
                    ? 'bg-gradient-to-b from-green-600 to-green-700 text-white ring-4 ring-yellow-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <div className="text-4xl font-black mb-2">{homePlayer}</div>
                <div className="text-xl font-normal text-gray-300">Home</div>
              </button>
              <button
                onClick={() => setStartingPlayer('away')}
                className={`py-8 px-6 text-3xl font-bold rounded-lg transition-all ${
                  startingPlayer === 'away'
                    ? 'bg-gradient-to-b from-green-600 to-green-700 text-white ring-4 ring-yellow-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <div className="text-4xl font-black mb-2">{awayPlayer}</div>
                <div className="text-xl font-normal text-gray-300">Away</div>
              </button>
            </div>
          </div>
          
          {/* Coin Toss Button */}
          <div className="mb-8">
            <button
              onClick={flipCoin}
              className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-3xl font-black py-5 rounded-lg shadow-lg transition-all active:scale-95"
            >
              🪙 FLIP COIN
            </button>
          </div>
          
          {/* Start Game Button */}
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-4xl font-black py-6 rounded-lg shadow-lg transition-all active:scale-95"
          >
            START GAME
          </button>

          {/* Back Button */}
          <button
            onClick={() => setSetupComplete(false)}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold py-3 rounded-lg transition-all"
          >
            ← Back to Setup
          </button>
        </div>
        
        {/* Coin Toss Modal */}
        {showCoinToss && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-16 rounded-xl shadow-2xl border-4 border-yellow-400">
              <h2 className="text-5xl font-black text-yellow-400 mb-8 text-center">Coin Toss</h2>
              <div className="text-9xl font-black text-white text-center animate-pulse">
                {coinResult}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 m-0 overflow-auto">
      <div className="w-full min-h-screen bg-black text-white flex flex-col shadow-2xl max-w-4xl">
      {/* Ton popup */}
      {tonMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-16 py-12 rounded-2xl shadow-2xl text-9xl font-black z-50 animate-fade-in border-8 border-black">
          {tonMessage}
        </div>
      )}
      {/* First throw message popup */}
      {firstThrowMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-16 py-12 rounded-2xl shadow-2xl z-50 animate-fade-in border-8 border-green-400">
          <div className="text-6xl font-black text-center mb-4">{firstThrowMessage}</div>
          <div className="text-4xl font-bold text-center">to throw first</div>
        </div>
      )}
      {/* Header - Player Scores */}
      <div className="grid grid-cols-3 gap-0">
        {/* Home Player */}
        <div className={`p-8 flex flex-col items-center justify-center border-r-2 border-black transition-all relative ${
          currentPlayer === 'home' 
            ? 'bg-white ring-4 ring-yellow-400 ring-inset' 
            : 'bg-gray-700 opacity-60'
        }`}>
          {startingPlayer === 'home' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
          )}
          <div className={`text-6xl font-black mb-6 tracking-wide ${currentPlayer === 'home' ? 'text-black' : 'text-white'}`}>{homePlayer}</div>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-9xl font-black tracking-tight ${currentPlayer === 'home' ? 'text-black' : 'text-white'}`}>{currentPlayer === 'home' && currentThrow ? homeScore - evaluateExpression(currentThrow) : homeScore}</span>
            <div className="flex flex-col items-center">
              <span className={`text-2xl font-bold ${currentPlayer === 'home' ? 'text-gray-700' : 'text-gray-300'}`}>Leg: {homeLegAverage}</span>
              <span className={`text-lg font-semibold ${currentPlayer === 'home' ? 'text-gray-600' : 'text-gray-200'} opacity-80`}>Match: {homeMatchAverage}</span>
            </div>
          </div>
        </div>

        {/* Center - Logo Area */}
        <div className="bg-black flex flex-col items-center justify-center p-4 border-r-2 border-black">
          <img src="dartstream-logo.png" alt="DartStream" className="w-48 h-auto" />
          <div className="text-gray-500 text-sm mt-2 font-semibold">v1.0.0</div>
          <div className="text-gray-400 text-base mt-2 font-bold text-center">
            {gameType} {setsCount > 0 && `${setsFormat === 'best-of' ? 'Best of' : 'Play All'} ${setsCount} ${setsCount === 1 ? 'Set' : 'Sets'}`}
            {setsCount > 0 && ' - '}
            {legsFormat === 'best-of' ? 'Best of' : 'Play All'} {legsCount} {legsCount === 1 ? 'Leg' : 'Legs'}
          </div>
        </div>

        {/* Away Player */}
        <div className={`p-8 flex flex-col items-center justify-center transition-all relative ${
          currentPlayer === 'away' 
            ? 'bg-white ring-4 ring-yellow-400 ring-inset' 
            : 'bg-gradient-to-b from-gray-800 to-gray-900 opacity-60'
        }`}>
          {startingPlayer === 'away' && (
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
          )}
          <div className={`text-6xl font-black mb-6 tracking-wide ${currentPlayer === 'away' ? 'text-gray-800' : 'text-white'}`}>{awayPlayer}</div>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-9xl font-black tracking-tight ${currentPlayer === 'away' ? 'text-gray-800' : 'text-white'}`}>{currentPlayer === 'away' && currentThrow ? awayScore - evaluateExpression(currentThrow) : awayScore}</span>
            <div className="flex flex-col items-center">
              <span className={`text-2xl font-bold ${currentPlayer === 'away' ? 'text-gray-600' : 'text-gray-400'}`}>Leg: {awayLegAverage}</span>
              <span className={`text-lg font-semibold ${currentPlayer === 'away' ? 'text-gray-500' : 'text-gray-300'} opacity-80`}>Match: {awayMatchAverage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Set Score Display */}
      <div className="bg-black px-6 py-3 flex items-center justify-center text-yellow-400 shadow-lg border-y-2 border-gray-800">
        <div className="text-2xl font-bold tracking-wide flex gap-8">
          <span>Sets: {sets.home} - {sets.away}</span>
          <span>Legs: {legs.home} - {legs.away}</span>
        </div>
      </div>

      {/* Score Log Header - Fixed */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 grid grid-cols-3">
          <div className="text-right py-2 px-3 text-lg font-bold text-white">{homePlayer}</div>
          <div className="text-center py-2 px-3 text-lg font-bold text-white">Turn</div>
          <div className="text-left py-2 px-3 text-lg font-bold text-white">{awayPlayer}</div>
        </div>
      </div>

      {/* Dartboard Display Area - Score Log */}
      <div className="flex-1 bg-black relative flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-4 py-4" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
          <table className="w-full text-white">
            <tbody>
              {Array.from(new Set([...scoreLog.map(entry => entry.turn), turnNumber])).sort((a, b) => a - b).map(turn => {
                const homeEntry = scoreLog.find(e => e.turn === turn && e.player === 'home');
                const awayEntry = scoreLog.find(e => e.turn === turn && e.player === 'away');
                const isCurrentTurn = turn === turnNumber;
                const showArrow = isCurrentTurn;
                const hasHomeScore = homeEntry && homeEntry.homeScore !== null;
                const hasAwayScore = awayEntry && awayEntry.awayScore !== null;
                const arrowPointsToHome = showArrow && currentPlayer === 'home' && !hasHomeScore && !editingScore;
                const arrowPointsToAway = showArrow && currentPlayer === 'away' && !hasAwayScore && !editingScore;
                const showLiveHome = isCurrentTurn && currentPlayer === 'home' && currentThrow && !hasHomeScore && !editingScore;
                const showLiveAway = isCurrentTurn && currentPlayer === 'away' && currentThrow && !hasAwayScore && !editingScore;
                
                const isEditingHome = editingScore?.turn === turn && editingScore?.player === 'home';
                const isEditingAway = editingScore?.turn === turn && editingScore?.player === 'away';
                
                return (
                  <tr key={turn} className={`border-b border-gray-800 hover:bg-gray-900 ${(showLiveHome || showLiveAway) ? 'border-b-2 border-blue-500 bg-blue-900 bg-opacity-30' : ''} ${(isEditingHome || isEditingAway) ? 'bg-yellow-900 bg-opacity-30' : ''}`}>
                    <td 
                      onClick={() => hasHomeScore && !showLiveHome && !isEditingHome && handleEditScore(turn, 'home')}
                      className={`text-right py-2 px-3 font-bold ${showLiveHome ? 'text-2xl text-blue-400' : isEditingHome ? 'text-2xl text-yellow-400 cursor-pointer' : 'text-xl'} ${hasHomeScore && !showLiveHome && !isEditingHome ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                    >
                      {showLiveHome ? evaluateExpression(currentThrow) : (hasHomeScore ? homeEntry.homeScore : '-')}
                    </td>
                    <td className="text-center py-2 px-3 text-xl font-bold text-yellow-400">
                      <div className="flex items-center justify-center gap-2">
                        {arrowPointsToHome && <span className="text-green-400 text-5xl">←</span>}
                        {turn}
                        {arrowPointsToAway && <span className="text-green-400 text-5xl">→</span>}
                      </div>
                    </td>
                    <td 
                      onClick={() => hasAwayScore && !showLiveAway && !isEditingAway && handleEditScore(turn, 'away')}
                      className={`text-left py-2 px-3 font-bold ${showLiveAway ? 'text-2xl text-blue-400' : isEditingAway ? 'text-2xl text-yellow-400 cursor-pointer' : 'text-xl'} ${hasAwayScore && !showLiveAway && !isEditingAway ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                    >
                      {showLiveAway ? evaluateExpression(currentThrow) : (hasAwayScore ? awayEntry.awayScore : '-')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-black">
        <button 
          onClick={handleBack}
          className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95"
        >
          {scoreLog.length > 0 ? 'UNDO' : (scoreLog.length === 0 && previousLegData ? 'PREV LEG' : 'BACK')}
        </button>
        <div className="bg-black text-yellow-400 text-3xl font-black py-3 rounded-lg border-4 border-yellow-400 shadow-lg flex items-center justify-center">
          {currentThrow || (
            getGameMode() === 'double-double' 
              ? ((currentPlayer === 'home' && !homeEnteredGame) || (currentPlayer === 'away' && !awayEnteredGame) ? 'Double-In' : '')
              : ((currentPlayer === 'home' && !homeEnteredGame) || (currentPlayer === 'away' && !awayEnteredGame) ? 'Straight-In' : '')
          )}
        </div>
        <button 
          onClick={handleMiss}
          className={`${currentThrow ? 'bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600' : 'bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700'} text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95`}
        >
          {currentThrow ? 'ENTER' : 'MISS'}
        </button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-6 gap-2 p-2 bg-black">
        {/* Left side - Quick scores */}
        <div className="grid grid-rows-4 gap-1">
          <button onClick={() => !currentThrow && handleQuickScore(26)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>26</button>
          <button onClick={() => !currentThrow && handleQuickScore(40)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>40</button>
          <button onClick={() => !currentThrow && handleQuickScore(41)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>41</button>
          <button onClick={() => !currentThrow && handleQuickScore(43)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>43</button>
        </div>

        {/* Center - Number pad */}
        <div className="col-span-4 grid grid-cols-3 gap-2">
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
        <div className="grid grid-rows-4 gap-1">
          <button onClick={() => !currentThrow && handleQuickScore(45)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>45</button>
          <button onClick={() => !currentThrow && handleQuickScore(60)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>60</button>
          <button onClick={() => !currentThrow && handleQuickScore(81)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>81</button>
          <button onClick={() => !currentThrow && handleQuickScore(85)} disabled={!!currentThrow} className={`text-white text-sm font-bold py-0.5 px-1 rounded shadow-sm transition-all ${currentThrow ? 'bg-gray-900 opacity-40 cursor-not-allowed' : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:scale-95'}`}>85</button>
        </div>
      </div>

      {/* Bottom Quick Scores */}
      <div className="grid grid-cols-3 gap-2 px-2 pb-2 bg-black">
        {currentThrow ? (
          <>
            <button onClick={handleMultiply} className="bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-3xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">×</button>
            <button onClick={() => handleNumberClick('0')} className="bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-3xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">0</button>
            <button onClick={handleAdd} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-3xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">+</button>
          </>
        ) : (
          <>
            <button onClick={() => handleQuickScore(100)} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">100</button>
            {((currentPlayer === 'home' && homeScore <= 170) || (currentPlayer === 'away' && awayScore <= 170)) ? (
              <button onClick={handleBust} className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">BUST</button>
            ) : (
              <button onClick={() => handleQuickScore(180)} className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">180</button>
            )}
            <button onClick={() => handleQuickScore(140)} className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xl font-black py-3 rounded-lg shadow-lg transition-all active:scale-95">140</button>
          </>
        )}
      </div>

      {/* Dart Count Selection Modal */}
      {showDartCount && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border-4 border-green-400">
            <h2 className="text-4xl font-black text-white mb-6 text-center">
              Checkout Complete!
            </h2>
            <p className="text-xl text-gray-300 mb-8 text-center">How many darts did {checkoutPlayer === 'home' ? homePlayer : awayPlayer} use?</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => selectDartCount(1)}
                className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-4xl font-black py-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                1<br/><span className="text-lg">DART</span>
              </button>
              <button
                onClick={() => selectDartCount(2)}
                className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-4xl font-black py-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                2<br/><span className="text-lg">DARTS</span>
              </button>
              <button
                onClick={() => selectDartCount(3)}
                className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-4xl font-black py-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                3<br/><span className="text-lg">DARTS</span>
              </button>
            </div>
            <button
              onClick={cancelCheckout}
              className="w-full bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-2xl font-black py-4 rounded-lg shadow-lg transition-all active:scale-95"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Win Confirmation Modal */}
      {showWinConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border-4 border-yellow-400">
            <h2 className="text-4xl font-black text-white mb-6 text-center">
              {winningPlayer === 'home' ? homePlayer : awayPlayer} Wins the Leg!
            </h2>
            <p className="text-xl text-gray-300 mb-8 text-center">Confirm the leg win?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmWin}
                className="flex-1 bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-2xl font-black py-4 px-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowWinConfirm(false)}
                className="flex-1 bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-2xl font-black py-4 px-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Winner Modal */}
      {showMatchWin && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 p-12 rounded-xl shadow-2xl border-8 border-yellow-300 max-w-2xl">
            {(() => {
              // Determine if this is a match win or set win
              const isMatchWin = setsCount === 0 
                ? (checkMatchWinner(sets.home, sets.away, legs.home, legs.away) !== null)
                : (sets.home >= getRequiredSets() || sets.away >= getRequiredSets());
              
              return (
                <>
                  <h1 className="text-7xl font-black text-black mb-8 text-center animate-pulse">
                    {isMatchWin ? '🏆 MATCH WINNER! 🏆' : '🎯 SET WINNER! 🎯'}
                  </h1>
                  <h2 className="text-6xl font-black text-black mb-8 text-center">
                    {matchWinner === 'home' ? homePlayer : awayPlayer}
                  </h2>
                  <div className="text-3xl font-bold text-black mb-8 text-center">
                    <p>Sets: {sets.home} - {sets.away}</p>
                    <p className="text-2xl mt-2">Legs: {legs.home} - {legs.away}</p>
                  </div>
                </>
              );
            })()}
            
            <div className="space-y-4">
              {/* Change Players Button */}
              <button
                onClick={() => {
                  setShowMatchWin(false);
                  setMatchWinner(null);
                  // Go back to name entry but keep game settings and scores
                  setGameStarted(false);
                  setSetupComplete(false);
                  setNamesEntered(false);
                  // Reset leg scores and game stats
                  setLegs({ home: 0, away: 0 });
                  setHomeScore(startingScore);
                  setAwayScore(startingScore);
                  setHomeDartsThrown(0);
                  setAwayDartsThrown(0);
                  setHomeMatchDarts(0);
                  setAwayMatchDarts(0);
                  setHomeMatchScore(0);
                  setAwayMatchScore(0);
                  setScoreLog([]);
                  setTurnNumber(1);
                  setHomeEnteredGame(false);
                  setAwayEnteredGame(false);
                }}
                className="w-full bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-2xl font-black py-4 px-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                CHANGE PLAYERS
              </button>

              {/* Continue Match Button - continues match with same players */}
              <button
                onClick={() => {
                  // Save current leg data before resetting
                  setPreviousLegData({
                    homeScore,
                    awayScore,
                    homeDartsThrown,
                    awayDartsThrown,
                    scoreLog,
                    turnNumber,
                    startingPlayer,
                    legs: { ...legs },
                    sets: { ...sets }
                  });
                  
                  setShowMatchWin(false);
                  setMatchWinner(null);
                  // Legs are already reset to 0-0 from confirmWin, but ensure they're reset
                  setLegs({ home: 0, away: 0 });
                  // Reset game scores and stats
                  setHomeScore(startingScore);
                  setAwayScore(startingScore);
                  setHomeDartsThrown(0);
                  setAwayDartsThrown(0);
                  setHomeMatchDarts(0);
                  setAwayMatchDarts(0);
                  setHomeMatchScore(0);
                  setAwayMatchScore(0);
                  setScoreLog([]);
                  setTurnNumber(1);
                  setHomeEnteredGame(false);
                  setAwayEnteredGame(false);
                  // Always alternate starting player when continuing to a new set
                  const nextStarter = startingPlayer === 'home' ? 'away' : 'home';
                  setCurrentPlayer(nextStarter);
                  setStartingPlayer(nextStarter);
                  // Update initialStartingPlayer for the new set so legs within the set alternate correctly
                  setInitialStartingPlayer(nextStarter);
                  // Show first throw message
                  const firstPlayerName = nextStarter === 'home' ? homePlayer : awayPlayer;
                  setFirstThrowMessage(`${firstPlayerName} to throw first`);
                  setTimeout(() => setFirstThrowMessage(""), 3000);
                }}
                className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-2xl font-black py-4 px-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                CONTINUE MATCH
              </button>

              {/* End Match Button */}
              <button
                onClick={() => {
                  setShowMatchWin(false);
                  setMatchWinner(null);
                  // Reset everything back to welcome page
                  setWelcomePageShown(false);
                  setPresetSelected(false);
                  setNamesEntered(false);
                  setSetupComplete(false);
                  setGameStarted(false);
                  setLegs({ home: 0, away: 0 });
                  setSets({ home: 0, away: 0 });
                  setHomeScore(startingScore);
                  setAwayScore(startingScore);
                  setHomeDartsThrown(0);
                  setAwayDartsThrown(0);
                  setHomeMatchDarts(0);
                  setAwayMatchDarts(0);
                  setHomeMatchScore(0);
                  setAwayMatchScore(0);
                  setScoreLog([]);
                  setTurnNumber(1);
                  setHomeEnteredGame(false);
                  setAwayEnteredGame(false);
                  setHomePlayerName('Home');
                  setAwayPlayerName('Away');
                }}
                className="w-full bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-2xl font-black py-4 px-8 rounded-lg shadow-lg transition-all active:scale-95"
              >
                END MATCH
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
