import { useState } from 'react';
import { TOKENS, formatTokenAmount, calculateMaxBet } from '../config/tokens';

const CARD_SUITS = ['♠', '♥', '♦', '♣'];
const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
  const deck = [];
  for (let suit of CARD_SUITS) {
    for (let value of CARD_VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function getCardValue(card, aceValue = 11) {
  if (card.value === 'A') return aceValue;
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  return parseInt(card.value);
}

function calculateHandValue(cards) {
  let value = 0;
  let aces = 0;

  for (let card of cards) {
    if (card.value === 'A') {
      aces += 1;
      value += 11;
    } else {
      value += getCardValue(card);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

function Card({ card, isHidden = false }) {
  const isRed = ['♥', '♦'].includes(card?.suit);
  
  if (isHidden) {
    return (
      <div className="relative w-24 h-36 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        {/* Card Back Design */}
        <div className="absolute inset-0 bg-blue-600 rounded-xl border-2 border-white/10">
          <div className="absolute inset-2 border-2 border-white/20 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2">
                {Array(9).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-blue-500/50 rounded-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      relative w-24 h-36 
      bg-white rounded-xl 
      shadow-lg
      transform transition-transform hover:scale-105
      flex flex-col justify-between
      p-2
      ${isRed ? 'text-red-600' : 'text-gray-900'}
    `}>
      {/* Top Left */}
      <div className="text-left">
        <div className="text-xl font-bold leading-none">{card.value}</div>
        <div className="text-2xl leading-none">{card.suit}</div>
      </div>
      
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center text-4xl">
        {card.suit}
      </div>
      
      {/* Bottom Right */}
      <div className="text-right transform rotate-180">
        <div className="text-xl font-bold leading-none">{card.value}</div>
        <div className="text-2xl leading-none">{card.suit}</div>
      </div>
    </div>
  );
}

function Blackjack() {
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('betting'); // betting, playing, dealerTurn, gameOver
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [message, setMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [showTokenSelect, setShowTokenSelect] = useState(false);

  // Calculate max bet based on LP size
  const maxBet = calculateMaxBet(selectedToken, 'blackjack');

  // Filter tokens that support blackjack
  const availableTokens = Object.entries(TOKENS).filter(([_, token]) => 
    token.games.includes('blackjack')
  );

  const handleTokenChange = (newToken) => {
    setSelectedToken(newToken);
    setShowTokenSelect(false);
    // Adjust bet if it exceeds new token's max bet
    const newMaxBet = calculateMaxBet(newToken, 'blackjack');
    if (bet > newMaxBet) {
      setBet(newMaxBet);
    }
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

  const dealInitialCards = () => {
    if (bet > balance || bet <= 0 || bet > maxBet) {
      setMessage('Invalid bet amount!');
      return;
    }

    setBalance(prev => prev - bet);
    const newDeck = [...deck];
    const pHand = [newDeck.pop(), newDeck.pop()];
    const dHand = [newDeck.pop(), newDeck.pop()];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDeck(newDeck);
    setGameState('playing');
    setMessage('');
  };

  const hit = () => {
    const newDeck = [...deck];
    const newHand = [...playerHand, newDeck.pop()];
    setPlayerHand(newHand);
    setDeck(newDeck);

    if (calculateHandValue(newHand) > 21) {
      endGame('bust');
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    playDealer();
  };

  const playDealer = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop());
    }

    setDealerHand(newDealerHand);
    setDeck(newDeck);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
      endGame('win');
    } else if (dealerValue > playerValue) {
      endGame('lose');
    } else {
      endGame('tie');
    }
  };

  const endGame = (result) => {
    setGameState('gameOver');
    let winAmount = 0;

    switch (result) {
      case 'win':
        winAmount = bet * 2;
        setBalance(prev => prev + winAmount);
        setMessage(`You win ${formatTokenAmount(bet, selectedToken)} ${selectedToken}!`);
        break;
      case 'blackjack':
        winAmount = bet * 2.5;
        setBalance(prev => prev + winAmount);
        setMessage('Blackjack! 3:2 payout!');
        break;
      case 'tie':
        winAmount = bet;
        setBalance(prev => prev + winAmount);
        setMessage('Push - bet returned');
        break;
      case 'bust':
        setMessage('Bust! Better luck next time!');
        break;
      default:
        setMessage('Dealer wins! Better luck next time!');
    }

    setLastWin(winAmount - bet);
  };

  const resetGame = () => {
    setDeck(shuffleDeck(createDeck()));
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto text-center px-4">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Blackjack</h1>

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

      {/* Game Area */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
        {/* Dealer's Hand */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold">Dealer's Hand</h2>
            {gameState !== 'betting' && (
              <span className="text-lg text-gray-400">
                ({gameState === 'playing' ? '?' : calculateHandValue(dealerHand)})
              </span>
            )}
          </div>
          <div className="flex justify-center gap-4">
            {dealerHand.map((card, index) => (
              <Card 
                key={index}
                card={card}
                isHidden={gameState === 'playing' && index === 1}
              />
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold">Your Hand</h2>
            {gameState !== 'betting' && (
              <span className="text-lg text-gray-400">
                ({calculateHandValue(playerHand)})
              </span>
            )}
          </div>
          <div className="flex justify-center gap-4">
            {playerHand.map((card, index) => (
              <Card 
                key={index}
                card={card}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {gameState === 'betting' && (
            <div className="flex items-center space-x-4">
              <label className="text-gray-400">Bet Amount:</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Math.min(Math.max(1, parseFloat(e.target.value) || 0), maxBet))}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg w-32 text-center"
                  min="1"
                  max={maxBet}
                  step="0.01"
                />
                <div className="ml-3 text-sm text-gray-400 whitespace-nowrap">
                  Max: {formatTokenAmount(maxBet, selectedToken)} {selectedToken}
                </div>
              </div>
              <button
                onClick={dealInitialCards}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
              >
                Deal
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex gap-4">
              <button
                onClick={hit}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
              >
                Stand
              </button>
            </div>
          )}

          {gameState === 'gameOver' && (
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-xl font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
          )}
        </div>

        {message && (
          <div className="mt-6 text-2xl font-bold">
            <p className={`py-3 px-6 rounded-lg ${
              message.includes('win') || message.includes('Blackjack')
                ? 'bg-green-500/20 text-green-400'
                : message.includes('tie')
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blackjack; 