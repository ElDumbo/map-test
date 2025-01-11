import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
    // Future blockchain integration will go here
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Memecoin Adventure Park
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/learn">Learn</Link>
          <Link to="/liquidity-pools">Liquidity Pools</Link>
          <Link to="/slots" className="text-gray-300 hover:text-white">
            Slots
          </Link>
          <Link to="/roulette" className="text-gray-300 hover:text-white">
            Roulette
          </Link>
          <Link to="/blackjack" className="text-gray-300 hover:text-white">
            Blackjack
          </Link>
        </div>
        <button
          onClick={handleConnectWallet}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 