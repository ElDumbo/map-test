import { useState, useEffect } from 'react';
import { TOKENS, formatTokenAmount, calculateMaxBet } from '../config/tokens';

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const BETTING_OPTIONS = {
  numbers: { type: 'straight', payout: 35 },
  red: { type: 'color', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], payout: 1 },
  black: { type: 'color', numbers: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35], payout: 1 },
  even: { type: 'even/odd', numbers: Array.from({length: 36}, (_, i) => i + 1).filter(n => n % 2 === 0), payout: 1 },
  odd: { type: 'even/odd', numbers: Array.from({length: 36}, (_, i) => i + 1).filter(n => n % 2 !== 0), payout: 1 },
  '1-18': { type: 'half', numbers: Array.from({length: 18}, (_, i) => i + 1), payout: 1 },
  '19-36': { type: 'half', numbers: Array.from({length: 18}, (_, i) => i + 19), payout: 1 }
};

function Roulette() {
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(10);
  const [selectedBets, setSelectedBets] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [showTokenSelect, setShowTokenSelect] = useState(false);

  // Calculate max bet based on LP size
  const maxBet = calculateMaxBet(selectedToken, 'roulette');

  // Filter tokens that support roulette
  const availableTokens = Object.entries(TOKENS).filter(([_, token]) => 
    token.games.includes('roulette')
  );

  const handleTokenChange = (newToken) => {
    setSelectedToken(newToken);
    setShowTokenSelect(false);
    // Adjust current bet if it exceeds new token's max bet
    const newMaxBet = calculateMaxBet(newToken, 'roulette');
    if (currentBet > newMaxBet) {
      setCurrentBet(newMaxBet);
    }
  };

  // Add token selector component (same as Slots)
  const tokenSelector = (
    <div className="mb-8 relative">
      <button
        onClick={() => setShowTokenSelect(!showTokenSelect)}
        className={`
          w-full md:w-auto
          bg-gray-800/50 backdrop-blur-sm
          px-6 py-3
          rounded-xl shadow-lg
          border border-gray-700
          hover:bg-gray-700/50
          transition-all
          flex items-center justify-between
          gap-4
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{TOKENS[selectedToken].icon}</span>
          <span className={`text-xl font-bold ${TOKENS[selectedToken].color}`}>
            {selectedToken}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${showTokenSelect ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showTokenSelect && (
        <div className="absolute mt-2 w-full md:w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
          {availableTokens.map(([symbol, token]) => (
            <button
              key={symbol}
              onClick={() => handleTokenChange(symbol)}
              className={`
                w-full px-4 py-3
                flex items-center gap-3
                hover:bg-gray-700/50
                transition-all
                ${selectedToken === symbol ? 'bg-gray-700/50' : ''}
              `}
            >
              <span className="text-2xl">{token.icon}</span>
              <div className="text-left">
                <p className={`font-bold ${token.color}`}>{symbol}</p>
                <p className="text-sm text-gray-400">{token.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Update the bet input section
  const betInput = (
    <div className="mb-6">
      <div className="flex items-center justify-center space-x-4">
        <label className="text-gray-400">Bet Amount:</label>
        <div className="relative flex items-center">
          <input
            type="number"
            value={currentBet}
            onChange={(e) => setCurrentBet(Math.min(Math.max(1, parseFloat(e.target.value) || 0), maxBet))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-32 text-center"
            min="1"
            max={maxBet}
            step="0.01"
            disabled={isSpinning}
          />
          <div className="ml-3 text-sm text-gray-400 whitespace-nowrap">
            Max: {formatTokenAmount(maxBet, selectedToken)} {selectedToken}
          </div>
        </div>
      </div>
    </div>
  );

  const getNumberColor = (number) => {
    if (number === 0) return 'bg-green-500 hover:bg-green-600';
    return BETTING_OPTIONS.red.numbers.includes(number) 
      ? 'bg-red-500 hover:bg-red-600' 
      : 'bg-gray-900 hover:bg-gray-800';
  };

  const placeBet = (betType, value) => {
    if (isSpinning) return;
    
    const totalCurrentBets = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalCurrentBets + currentBet > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    setSelectedBets([...selectedBets, { type: betType, value, amount: currentBet }]);
    setMessage('');
  };

  const clearBets = () => {
    if (!isSpinning) {
      setSelectedBets([]);
      setMessage('');
    }
  };

  const spin = () => {
    if (selectedBets.length === 0) {
      setMessage('Place at least one bet!');
      return;
    }

    const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsSpinning(true);
    setMessage('');
    setBalance(prev => prev - totalBet);

    // Simulate wheel spinning
    let spins = 0;
    const spinInterval = setInterval(() => {
      setResult(ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)]);
      spins++;
      
      if (spins > 20) {
        clearInterval(spinInterval);
        const finalNumber = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
        setResult(finalNumber);
        calculateWinnings(finalNumber);
        setIsSpinning(false);
      }
    }, 100);
  };

  const calculateWinnings = (winningNumber) => {
    let totalWin = 0;

    selectedBets.forEach(bet => {
      let won = false;

      if (bet.type === 'number' && bet.value === winningNumber) {
        totalWin += bet.amount * BETTING_OPTIONS.numbers.payout;
        won = true;
      } else if (bet.type === 'color') {
        const numbers = BETTING_OPTIONS[bet.value].numbers;
        if (numbers.includes(winningNumber)) {
          totalWin += bet.amount * BETTING_OPTIONS[bet.value].payout;
          won = true;
        }
      } else if (BETTING_OPTIONS[bet.value]?.numbers.includes(winningNumber)) {
        totalWin += bet.amount * BETTING_OPTIONS[bet.value].payout;
        won = true;
      }
    });

    if (totalWin > 0) {
      setBalance(prev => prev + totalWin);
      setLastWin(totalWin);
      setMessage(`🎉 You won ${totalWin} coins! 🎉`);
    } else {
      setLastWin(0);
      setMessage('Better luck next time!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center px-4">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Roulette</h1>

      {tokenSelector}

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Your Balance</p>
          <p className="text-2xl font-bold text-green-400">
            {formatTokenAmount(balance, selectedToken)} {selectedToken}
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Last Win</p>
          <p className="text-2xl font-bold text-yellow-400">
            {formatTokenAmount(lastWin, selectedToken)} {selectedToken}
          </p>
        </div>
      </div>

      {/* Roulette Wheel Result */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className={`
          relative
          text-6xl font-bold mb-4 
          w-48 h-48 mx-auto
          rounded-full
          border-8 border-gray-700
          ${isSpinning ? 'animate-spin' : 'transition-all duration-500'}
          overflow-hidden
          shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]
        `}>
          <div className={`
            absolute inset-0
            flex items-center justify-center
            ${getNumberColor(result !== null ? result : 0)}
            transition-colors duration-300
          `}>
            {result !== null ? result : '?'}
          </div>
        </div>
      </div>

      {/* Betting Grid */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        {betInput}

        {/* Number Grid */}
        <div className="grid grid-cols-3 md:grid-cols-12 gap-2 mb-6">
          <button
            onClick={() => placeBet('number', 0)}
            className={`
              aspect-square
              text-xl font-bold
              ${getNumberColor(0)}
              rounded-lg
              transition-all duration-300
              transform hover:scale-105
              shadow-lg
            `}
          >
            0
          </button>
          {Array.from({length: 36}, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => placeBet('number', num)}
              className={`
                aspect-square
                text-xl font-bold
                ${getNumberColor(num)}
                rounded-lg
                transition-all duration-300
                transform hover:scale-105
                shadow-lg
                ${selectedBets.some(bet => bet.type === 'number' && bet.value === num) 
                  ? 'ring-4 ring-white ring-opacity-50' 
                  : ''}
              `}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Outside Bets */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {Object.entries(BETTING_OPTIONS)
            .filter(([key]) => key !== 'numbers')
            .map(([key, option]) => (
              <button
                key={key}
                onClick={() => placeBet(option.type, key)}
                className={`
                  py-3 px-4
                  text-lg font-bold
                  bg-gray-700 hover:bg-gray-600
                  rounded-lg
                  transition-all duration-300
                  transform hover:scale-105
                  shadow-lg
                  ${selectedBets.some(bet => bet.value === key) 
                    ? 'ring-4 ring-white ring-opacity-50' 
                    : ''}
                `}
              >
                {key}
              </button>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={clearBets}
            disabled={isSpinning || selectedBets.length === 0}
            className={`
              px-8 py-3
              text-xl font-bold
              rounded-lg
              transition-all duration-300
              ${isSpinning || selectedBets.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 transform hover:scale-105'}
            `}
          >
            Clear Bets
          </button>
          <button
            onClick={spin}
            disabled={isSpinning || selectedBets.length === 0}
            className={`
              px-12 py-3
              text-xl font-bold
              rounded-lg
              transition-all duration-300
              ${isSpinning || selectedBets.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'}
            `}
          >
            {isSpinning ? 'Spinning...' : 'Spin!'}
          </button>
        </div>
      </div>

      {/* Active Bets Display */}
      {selectedBets.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Active Bets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBets.map((bet, index) => (
              <div 
                key={index}
                className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center"
              >
                <span className="font-bold">
                  {bet.type === 'number' ? `Number ${bet.value}` : bet.value}
                </span>
                <span className="text-green-400">
                  {formatTokenAmount(bet.amount, selectedToken)} {selectedToken}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className="mt-6 text-2xl font-bold animate-bounce">
          <p className={`py-3 px-6 rounded-lg ${
            message.includes('won') 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default Roulette; 