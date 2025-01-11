import { Link } from 'react-router-dom';

const TOKENS = {
  USDC: {
    name: 'USD Coin',
    icon: '💵',
    color: 'text-green-400',
    games: ['slots', 'blackjack', 'roulette'],
    lpSizes: {
      slots: '125,000',
      blackjack: '250,000',
      roulette: '180,000'
    }
  },
  ETH: {
    name: 'Ethereum',
    icon: '⟠',
    color: 'text-purple-400',
    games: ['slots', 'blackjack', 'roulette'],
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
    lpSizes: {
      slots: '28,500',
      blackjack: '42,000',
      roulette: '35,000'
    }
  },
  BETA: {
    name: 'Beta',
    icon: '🎯',
    color: 'text-orange-400',
    games: ['slots'],
    lpSizes: {
      slots: '850,000'
    }
  },
  AVO: {
    name: 'Avocado',
    icon: '🥑',
    color: 'text-green-500',
    games: ['blackjack', 'roulette'],
    lpSizes: {
      blackjack: '1,250,000',
      roulette: '980,000'
    }
  }
};

function LiquidityPools() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-gradient">Liquidity Pools</h1>
      <p className="text-xl text-gray-300 text-center mb-12">
        View available liquidity pools and their current sizes
      </p>

      <div className="grid gap-8">
        {Object.entries(TOKENS).map(([symbol, token]) => (
          <div 
            key={symbol}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden"
          >
            {/* Token Header */}
            <div className="bg-gray-700/50 p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{token.icon}</span>
                <div>
                  <h2 className={`text-2xl font-bold ${token.color}`}>{symbol}</h2>
                  <p className="text-gray-300">{token.name}</p>
                </div>
              </div>
            </div>

            {/* Game LPs Grid */}
            <div className="grid md:grid-cols-3 gap-4 p-6">
              {token.games.map(game => (
                <div 
                  key={game}
                  className="bg-gray-700/30 rounded-lg p-6 hover:bg-gray-700/50 transition-all transform hover:scale-105"
                >
                  <h3 className="text-xl font-bold mb-2 capitalize">{game}</h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-400">Current LP Size</p>
                      <p className="text-2xl font-bold">{token.lpSizes[game]} {symbol}</p>
                    </div>
                    <Link
                      to={`/${game}`}
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      Play →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Want to list your token?</h2>
        <p className="text-gray-300 mb-4">
          Adding your token to Memecoin Adventure Park is a great way to provide instant utility for your community. 
          New token listings require a minimum LP size for each game.
        </p>
        <button
          onClick={() => window.open('https://twitter.com/elonmusk', '_blank')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700"
        >
          Contact Us to List Your Token
        </button>
      </div>
    </div>
  );
}

export default LiquidityPools; 