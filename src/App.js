import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Slots from './pages/Slots';
import Roulette from './pages/Roulette';
import Blackjack from './pages/Blackjack';
import Learn from './pages/Learn';
import LiquidityPools from './pages/LiquidityPools';

function App() {
  const [storageStatus, setStorageStatus] = useState('initializing');

  useEffect(() => {
    const initializeStorage = async () => {
      console.log('Initializing storage...');
      
      try {
        // Check if running in secure context
        console.log('Secure context:', window.isSecureContext ? 'Yes' : 'No');
        
        // Check storage availability
        if (!navigator.storage) {
          console.warn('Storage API not available');
          setStorageStatus('unavailable');
          return;
        }

        // Check storage persistence
        if (navigator.storage.persist) {
          const isPersisted = await navigator.storage.persist();
          console.log('Storage persistence:', isPersisted ? 'enabled' : 'failed');
          setStorageStatus(isPersisted ? 'persistent' : 'temporary');
          
          // Check estimated quota
          const estimate = await navigator.storage.estimate();
          console.log('Storage estimate:', {
            quota: estimate.quota,
            usage: estimate.usage,
            percentageUsed: `${(estimate.usage / estimate.quota * 100).toFixed(2)}%`
          });
        } else {
          console.warn('Storage persistence not available');
          setStorageStatus('no-persistence');
        }
      } catch (error) {
        console.error('Storage initialization error:', error);
        setStorageStatus('error');
      }
    };

    initializeStorage();
  }, []);

  // Log any storage status changes
  useEffect(() => {
    console.log('Storage status:', storageStatus);
  }, [storageStatus]);

  useEffect(() => {
    // Add listener for unhandled errors
    const handleError = (event) => {
      console.error('Unhandled error:', {
        message: event.message,
        source: event.filename,
        lineNo: event.lineno,
        colNo: event.colno,
        error: event.error
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Add storage status indicator for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded text-sm">
            Storage: {storageStatus}
          </div>
        )}
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