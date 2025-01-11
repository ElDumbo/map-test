import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

function Learn() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gradient">Learn More</h1>
      
      <div className="space-y-6">
        <FaqSection
          title="What is Memecoin Adventure Park?"
          content={
            <>
              <p className="mb-4">
                Memecoin Adventure Park is a decentralized gaming platform where token projects can add instant utility and entertainment value for their communities.
              </p>
              <p className="mb-4">
                Token projects create liquidity pools for each game, letting their communities play casino games using their tokens. As more people play, the LPs grow naturally, enabling larger bets and more engaging gameplay.
              </p>
              <p>
                It's the perfect way for new tokens to provide immediate value to holders - giving them fun ways to use their tokens while helping build a sustainable gaming ecosystem.
              </p>
            </>
          }
        />

        <FaqSection
          title="What memecoins can I use?"
          content={
            <>
              <p className="mb-4">Currently supported tokens:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>ETH (Ethereum)</li>
                <li>USDC (USD Coin)</li>
                <li>FLOW</li>
                <li>AVOCADO</li>
                <li>BETA</li>
              </ul>
              <p className="mb-4">
                Want to add your favorite token? Any ERC-20 token can be added to our platform through a community governance proposal. If approved, a new liquidity pool will be created for your token!
              </p>
              <Link 
                to="/liquidity-pools" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Learn more about adding new tokens →
              </Link>
            </>
          }
        />

        <FaqSection
          title="What are Liquidity Pools?"
          content={
            <>
              <p className="mb-4">
                Liquidity Pools (LPs) are the backbone of our casino. Each game and token pairing has its own LP that acts as "the house," creating a self-sustaining ecosystem.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">How LPs Work:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>When players win, they're paid directly from the LP</li>
                  <li>When players lose, their tokens are added to the LP, helping it grow</li>
                  <li>As LPs grow, maximum betting amounts increase</li>
                  <li>Bet limits are dynamically tied to LP size to ensure sustainability</li>
                </ul>
              </div>
              <p className="mb-4">
                This system creates a perfect balance - the more people play, the more robust the system becomes, enabling bigger bets and better gameplay for everyone.
              </p>
              <Link 
                to="/liquidity-pools" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View current LP opportunities →
              </Link>
            </>
          }
        />

        <FaqSection
          title="How to play: Blackjack"
          content={
            <>
              <p className="mb-4">
                Blackjack is a card game where you compete against the dealer to get as close to 21 as possible without going over.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">Quick Rules:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cards 2-10 are worth their face value</li>
                  <li>Face cards (J, Q, K) are worth 10</li>
                  <li>Aces are worth 1 or 11 (your choice)</li>
                  <li>Get closer to 21 than the dealer to win</li>
                  <li>Going over 21 means you "bust" and lose</li>
                </ul>
              </div>
              <p>
                Our Blackjack game uses Vegas rules with 4 decks and pays 3:2 on natural blackjacks!
              </p>
            </>
          }
        />

        <FaqSection
          title="How to play: Roulette"
          content={
            <>
              <p className="mb-4">
                Roulette is a classic casino game where you bet on where a ball will land on a spinning wheel.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">Betting Options:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Single Numbers (35:1 payout)</li>
                  <li>Red or Black (1:1 payout)</li>
                  <li>Odd or Even (1:1 payout)</li>
                  <li>1-18 or 19-36 (1:1 payout)</li>
                  <li>Dozens: 1-12, 13-24, 25-36 (2:1 payout)</li>
                </ul>
              </div>
              <p>
                Our Roulette uses European rules with a single zero, giving better odds than American roulette!
              </p>
            </>
          }
        />

        <FaqSection
          title="How to play: Slots"
          content={
            <>
              <p className="mb-4">
                Our slot machine is a classic 3-reel design with simple, straightforward gameplay and huge potential wins!
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">Winning Combinations:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>🎰 Three 7️⃣'s: 50x your bet</li>
                  <li>🎰 Three 💎's: 25x your bet</li>
                  <li>🎰 Three 🍒's: 10x your bet</li>
                  <li>🎰 Three 🍊's: 5x your bet</li>
                  <li>🎰 Three 🍋's: 3x your bet</li>
                </ul>
              </div>
              <p>
                With a 95% RTP (Return to Player), our slots offer some of the best odds in the industry!
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}

function FaqSection({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700">
      <button
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-700/50 transition-colors rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-left">{title}</h2>
        <ChevronDownIcon 
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-700">
          {content}
        </div>
      )}
    </div>
  );
}

export default Learn; 