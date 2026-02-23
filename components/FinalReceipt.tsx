
import React from 'react';
import { LaughStats } from '../types';

interface FinalReceiptProps {
  stats: LaughStats;
  onRestart: () => void;
}

const FinalReceipt: React.FC<FinalReceiptProps> = ({ stats, onRestart }) => {
  const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-black/10 pb-6 mb-6">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Comedy Club Bill</h3>
          <p className="text-[10px] text-neutral-500 uppercase font-mono">Invoice #{transactionId}</p>
          <p className="text-[10px] text-neutral-500 uppercase font-mono">{date}</p>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold uppercase text-sm">Laugh Events</p>
              <p className="text-xs text-neutral-500">Biometric Recognition Count</p>
            </div>
            <p className="font-mono text-lg font-bold">x{stats.count}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold uppercase text-sm">Unit Price</p>
              <p className="text-xs text-neutral-500">Per smile detected</p>
            </div>
            <p className="font-mono text-lg font-bold">€{stats.pricePerLaugh.toFixed(2)}</p>
          </div>
          {stats.count * stats.pricePerLaugh > stats.maxCharge && (
            <div className="flex justify-between items-center text-pink-600">
              <div>
                <p className="font-bold uppercase text-sm">Membership Cap</p>
                <p className="text-xs">Max session discount applied</p>
              </div>
              <p className="font-mono text-lg font-bold">Applied</p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t-4 border-double border-black pt-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black uppercase">Total Due</span>
            <span className="text-4xl font-black tracking-tighter">€{stats.totalDue.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => alert("Redirecting to Stripe... (This is a demo)")}
          >
            Settle Account
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 py-3 bg-neutral-100 border border-neutral-200 rounded-xl hover:bg-neutral-200 transition-colors"
              onClick={() => alert("Shared to X/Twitter!")}
            >
              <span className="text-lg">𝕏</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
            </button>
            <button 
              className="flex items-center justify-center gap-2 py-3 bg-neutral-100 border border-neutral-200 rounded-xl hover:bg-neutral-200 transition-colors"
              onClick={() => alert("Shared to Instagram!")}
            >
              <span className="text-lg">📸</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Story</span>
            </button>
          </div>
        </div>

        {/* Bottom Deco */}
        <div className="mt-8 text-center text-[8px] text-neutral-400 uppercase tracking-widest">
          No refunds for bad jokes. Keep smiling.
        </div>
      </div>

      <button 
        onClick={onRestart}
        className="w-full mt-6 py-4 text-neutral-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
      >
        Go Back To Entrance
      </button>
    </div>
  );
};

export default FinalReceipt;
