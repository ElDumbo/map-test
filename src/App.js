import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Slots from './pages/Slots';
import Roulette from './pages/Roulette';
import Blackjack from './pages/Blackjack';
import Learn from './pages/Learn';
import LiquidityPools from './pages/LiquidityPools';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/roulette" element={<Roulette />} />
            <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/liquidity-pools" element={<LiquidityPools />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 