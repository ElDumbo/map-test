import { useState } from 'react';
import { TOKENS, formatTokenAmount, calculateMaxBet } from '../config/tokens';

// Polyfill for crypto.randomUUID
if (!crypto.randomUUID) {
    crypto.randomUUID = function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
            const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
            // eslint-disable-next-line no-mixed-operators
            return (c ^ (randomValue & 15) >> (c / 4)).toString(16);
        });
    };
}

const SLOT_CONFIG = {
  '7️⃣': { weight: 1, payout: 50, color: 'text-red-500' },
  '💎': { weight: 2, payout: 25, color: 'text-blue-400' },
  '🍒': { weight: 5, payout: 10, color: 'text-red-400' },
  '🍊': { weight: 7, payout: 5, color: 'text-orange-400' },
  '🍋': { weight: 9, payout: 3, color: 'text-yellow-400' }
};

const SYMBOLS = Object.keys(SLOT_CONFIG);
const INITIAL_BALANCE = 1000;
const TOTAL_WEIGHT = Object.values(SLOT_CONFIG).reduce((sum, item) => sum + item.weight, 0);

function Slots() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [showTokenSelect, setShowTokenSelect] = useState(false);

  // Calculate max bet based on LP size
  const maxBet = calculateMaxBet(selectedToken, 'slots');

  const handleBetChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setBet(Math.min(Math.max(0, value), maxBet));
  };

  const handleTokenChange = (newToken) => {
    setSelectedToken(newToken);
    setShowTokenSelect(false);
    // Adjust bet if it exceeds new token's max bet
    const newMaxBet = calculateMaxBet(newToken, 'slots');
    if (bet > newMaxBet) {
      setBet(newMaxBet);
    }
  };

  // Filter tokens that support slots
  const availableTokens = Object.entries(TOKENS).filter(([_, token]) => 
    token.games.includes('slots')
  );

  const getRandomSymbol = () => {
    const random = Math.floor(Math.random() * TOTAL_WEIGHT);
    let weightSum = 0;
    for (const symbol of SYMBOLS) {
      weightSum += SLOT_CONFIG[symbol].weight;
      if (random < weightSum) return symbol;
    }
    return SYMBOLS[SYMBOLS.length - 1];
  };

  const spin = () => {
    if (balance < bet) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsSpinning(true);
    setMessage('');
    setLastWin(0);
    setBalance(prev => prev - bet);

    const spinInterval = setInterval(() => {
      setReels(reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(finalReels);
      setIsSpinning(false);
      
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        const winAmount = bet * SLOT_CONFIG[finalReels[0]].payout;
        setBalance(prev => prev + winAmount);
        setLastWin(winAmount);
        setMessage(`🎉 Winner! +${winAmount} coins! 🎉`);
      }
    }, 2000);
  };

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
              onClick={() => {
                handleTokenChange(symbol);
                setShowTokenSelect(false);
              }}
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

  return (
    <div className="max-w-2xl mx-auto text-center px-4">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Lucky Slots</h1>
      
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

      {/* Payout Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gradient">Winning Combinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SYMBOLS.map(symbol => (
            <div 
              key={symbol} 
              className="flex justify-between items-center px-6 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-all"
            >
              <span className={`text-3xl ${SLOT_CONFIG[symbol].color}`}>
                {symbol} × 3
              </span>
              <span className="text-2xl font-bold text-white">
                {SLOT_CONFIG[symbol].payout}x
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Slot Machine */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className="bg-gray-900/80 p-6 rounded-lg mb-8">
          <div className="flex justify-center items-center space-x-4 text-7xl">
            {reels.map((symbol, index) => (
              <div 
                key={index}
                className={`w-24 h-24 flex items-center justify-center bg-gray-800 rounded-lg border-2 border-gray-600 ${
                  SLOT_CONFIG[symbol]?.color || 'text-white'
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-gray-400">Bet Amount:</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={bet}
                onChange={handleBetChange}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max={maxBet}
                step="0.01"
              />
              <div className="ml-3 text-sm text-gray-400 whitespace-nowrap">
                Max: {formatTokenAmount(maxBet, selectedToken)} {selectedToken}
              </div>
            </div>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || bet > maxBet || bet <= 0 || balance < bet}
            className={`
              w-full md:w-auto
              px-12 py-4 
              text-xl font-bold
              rounded-lg
              transition-all
              transform hover:scale-105
              ${(isSpinning || bet > maxBet || bet <= 0 || balance < bet)
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }
            `}
          >
            {isSpinning ? 'Spinning...' : 'Spin!'}
          </button>
        </div>

        {message && (
          <div className="mt-6 text-2xl font-bold animate-bounce">
            <p className="bg-green-500/20 text-green-400 py-3 px-6 rounded-lg">
              {message.replace('coins', selectedToken)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Add this CSS to your index.css or create a new CSS file
const style = document.createElement('style');
style.textContent = `
  .text-gradient {
    background: linear-gradient(to right, #60a5fa, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
document.head.appendChild(style);

export default Slots; 