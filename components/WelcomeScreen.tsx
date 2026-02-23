
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-8 relative inline-block">
        <span className="absolute -top-6 -right-6 bg-pink-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest animate-bounce">
          Must See
        </span>
        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
          Ready to <br /> Laugh?
        </h2>
      </div>
      
      <p className="max-w-md mx-auto text-neutral-400 text-lg mb-10 font-light leading-relaxed">
        Our proprietary AI monitors your face. Every genuine laugh costs you <span className="text-white font-bold">€0.30</span>. 
        Capped at <span className="text-white font-bold">€24.00</span> per show. No hiding, no faking.
      </p>

      <div className="flex flex-col gap-6 items-center">
        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-white/10"
        >
          <span className="relative z-10">Enter Comedy Club</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
        </button>

        <button 
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="text-neutral-500 hover:text-white text-[10px] uppercase tracking-[0.2em] transition-colors border-b border-white/0 hover:border-white/20 pb-1"
        >
          {showArchitecture ? 'Hide System Specs' : 'View System Architecture'}
        </button>

        {showArchitecture && (
          <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
              <div className="text-pink-500 font-bold mb-2">01. CAPTURE</div>
              <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tight">
                Webcam stream is piped into MediaPipe WASM engine at 30fps for real-time biometric analysis.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
              <div className="text-purple-500 font-bold mb-2">02. DETECT</div>
              <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tight">
                AI extracts 52 facial blendshapes, calculating smile probability via mouth muscle tension.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
              <div className="text-green-500 font-bold mb-2">03. BILL</div>
              <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-tight">
                Laughs exceeding 65% threshold trigger a cooldown ledger entry and automated billing.
              </p>
            </div>
          </div>
        )}

        <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-4">
          Camera Access Required for Biometric Laugh Detection
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
