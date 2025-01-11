import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gradient">Welcome to Memecoin Adventure Park</h1>
      <p className="text-xl mb-8 text-gray-300">
        The first decentralized casino powered by liquidity pools. Play, earn, and contribute!
      </p>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <GameCard
          title="Slots"
          description="Classic Vegas-style slots with 95% RTP. Win up to 50x your bet!"
          link="/slots"
        />
        <GameCard
          title="Roulette"
          description="European roulette with multiple betting options and real-time animations"
          link="/roulette"
        />
        <GameCard
          title="Blackjack"
          description="Classic blackjack with Vegas rules. Beat the dealer and win big!"
          link="/blackjack"
        />
      </div>

      {/* Additional Buttons */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
        <button
          onClick={() => window.open('/liquidity-pools', '_blank')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
        >
          🌊 Liquidity Pools
        </button>
        <button
          onClick={() => window.open('/learn', '_blank')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          📚 Learn More
        </button>
        <button
          onClick={() => window.open('https://twitter.com/elonmusk', '_blank')}
          className="px-8 py-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg text-xl font-bold hover:from-sky-500 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg 
            className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          Follow Updates
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <p className="text-3xl font-bold text-green-400">$1.2M</p>
          <p className="text-gray-400">Total Value Locked</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <p className="text-3xl font-bold text-blue-400">12.5K</p>
          <p className="text-gray-400">Active Players</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <p className="text-3xl font-bold text-purple-400">95%</p>
          <p className="text-gray-400">Average RTP</p>
        </div>
      </div>
    </div>
  );
}

function GameCard({ title, description, link }) {
  return (
    <Link to={link}>
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:bg-gray-700/50 transition-all transform hover:scale-105">
        <h2 className="text-2xl font-bold mb-4 text-gradient">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>
    </Link>
  );
}

export default Home; 