import React from 'react';
import { ArrowLeft, Coins, Sparkles, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CoinsScreenProps {
  onBack: () => void;
}

export function CoinsScreen({ onBack }: CoinsScreenProps) {
  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] select-none overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="bg-[#1A1F71] text-white px-4 pt-4 pb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1 text-white hover:opacity-80 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold tracking-tight">Porter Rewards</h2>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">
              Available Coins
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-amber-300">240</span>
              <span className="text-xs text-amber-200 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                = ₹24.00
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-2xl">
            🪙
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-3">
        {/* Earning Rules Banner */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Earn with every booking</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">2 coins earned for every ₹100 spent</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0052FF]">Auto-applied</span>
        </div>

        {/* Rewards Opportunities */}
        <h3 className="text-xs font-bold text-slate-700 px-1">Active Offers</h3>
        <div className="space-y-2.5">
          {[
            { title: 'First 2-Wheeler Booking', desc: 'Get 50 bonus coins instantly on delivery completion', icon: '🛵' },
            { title: 'Refer a Friend', desc: 'Share code SULTAN50 and earn ₹100 Porter credit', icon: '🎁' },
            { title: 'Corporate GST Billing', desc: 'Claim input tax credit on business deliveries', icon: '💼' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
