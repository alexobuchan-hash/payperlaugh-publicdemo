
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, LaughStats } from './types';
import { PRICE_PER_LAUGH, MAX_CHARGE } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import Showtime from './components/Showtime';
import FinalReceipt from './components/FinalReceipt';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [stats, setStats] = useState<LaughStats>({
    count: 0,
    totalDue: 0,
    pricePerLaugh: PRICE_PER_LAUGH,
    maxCharge: MAX_CHARGE,
  });

  const handleStartShow = () => {
    setAppState(AppState.SHOWTIME);
  };

  const handleFinishShow = () => {
    setAppState(AppState.FINISHED);
  };

  const handleLaughDetected = useCallback(() => {
    setStats((prev) => {
      const newCount = prev.count + 1;
      const newTotal = Math.min(newCount * prev.pricePerLaugh, prev.maxCharge);
      return {
        ...prev,
        count: newCount,
        totalDue: newTotal,
      };
    });
  }, []);

  const resetShow = () => {
    setStats({
      count: 0,
      totalDue: 0,
      pricePerLaugh: PRICE_PER_LAUGH,
      maxCharge: MAX_CHARGE,
    });
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 flex flex-col items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-pink-600 rounded-full blur-[120px]" />
      </div>

      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20">
            <span className="text-2xl font-bold">L</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Pay Per Laugh
          </h1>
        </div>
        {appState === AppState.SHOWTIME && (
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 leading-none">Laugh Count</span>
              <span className="text-lg font-bold leading-none">{stats.count}</span>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 leading-none">Total Due</span>
              <span className="text-lg font-bold leading-none text-green-400">€{stats.totalDue.toFixed(2)}</span>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {appState === AppState.IDLE && (
          <WelcomeScreen onStart={handleStartShow} />
        )}

        {appState === AppState.SHOWTIME && (
          <Showtime 
            onLaughDetected={handleLaughDetected} 
            onFinish={handleFinishShow}
            stats={stats}
          />
        )}

        {appState === AppState.FINISHED && (
          <FinalReceipt stats={stats} onRestart={resetShow} />
        )}
      </main>

      <footer className="fixed bottom-6 text-neutral-500 text-xs uppercase tracking-[0.2em] font-medium z-10">
        AI-Powered Comedy Management System • v2.0
      </footer>
    </div>
  );
};

export default App;
