export const TOKENS = {
  USDC: {
    name: 'USD Coin',
    icon: '💵',
    color: 'text-green-400',
    games: ['slots', 'blackjack', 'roulette'],
    decimals: 6,
    lpSizes: {
      slots: '125000.00',
      blackjack: '250000.00',
      roulette: '180000.00'
    }
  },
  ETH: {
    name: 'Ethereum',
    icon: '⟠',
    color: 'text-purple-400',
    games: ['slots', 'blackjack', 'roulette'],
    decimals: 18,
    lpSizes: {
      slots: '85.5',
      blackjack: '120.3',
      roulette: '95.8'
    }
  },
  FLOW: {
    name: 'Flow',
    icon: '🌊',
    color: 'text-blue-400',
    games: ['slots', 'blackjack', 'roulette'],
    decimals: 8,
    lpSizes: {
      slots: '28500.00',
      blackjack: '42000.00',
      roulette: '35000.00'
    }
  },
  BETA: {
    name: 'Beta',
    icon: '🎯',
    color: 'text-orange-400',
    games: ['slots'],
    decimals: 18,
    lpSizes: {
      slots: '850000.00'
    }
  },
  AVO: {
    name: 'Avocado',
    icon: '🥑',
    color: 'text-green-500',
    games: ['blackjack', 'roulette'],
    decimals: 18,
    lpSizes: {
      blackjack: '1250000.00',
      roulette: '980000.00'
    }
  }
};

export const formatTokenAmount = (amount, token) => {
  const decimals = TOKENS[token].decimals;
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: Math.min(decimals, 2),
    maximumFractionDigits: Math.min(decimals, 2)
  });
};

const roundToNiceNumber = (num) => {
  const magnitude = Math.floor(Math.log10(num));
  const firstDigit = Math.floor(num / Math.pow(10, magnitude));
  
  if (firstDigit === 1) {
    return Math.pow(10, magnitude);
  } else if (firstDigit <= 5) {
    return 5 * Math.pow(10, magnitude - 1);
  } else {
    return Math.pow(10, magnitude);
  }
};

export const calculateMaxBet = (token, game) => {
  const lpSize = parseFloat(TOKENS[token].lpSizes[game]);
  const rawMaxBet = lpSize * 0.25; // 25% of LP size
  return roundToNiceNumber(rawMaxBet);
}; 