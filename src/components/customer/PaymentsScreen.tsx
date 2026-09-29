import React, { useState } from 'react';
import { ArrowLeft, Wallet, Plus, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface PaymentsScreenProps {
  onBack: () => void;
}

export function PaymentsScreen({ onBack }: PaymentsScreenProps) {
  const { customerProfile, topUpWallet } = useLogistics();
  const [selectedTopUp, setSelectedTopUp] = useState<number>(200);

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] select-none overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="bg-[#0040CC] text-white px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1 text-white hover:opacity-80 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold tracking-tight">Payments & Wallet</h2>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">
              Porter Wallet Balance
            </span>
            <div className="text-3xl font-black font-mono text-white mt-1">
              ₹{customerProfile.walletBalance.toFixed(2)}
            </div>
          </div>
          <Wallet className="w-10 h-10 text-blue-200" />
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-3">
        {/* Quick Top Up */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-800">Quick Add Money</span>
          <div className="grid grid-cols-3 gap-2">
            {[100, 200, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedTopUp(amt)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  selectedTopUp === amt
                    ? 'border-[#0052FF] bg-blue-50 text-[#0052FF]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => topUpWallet(selectedTopUp)}
            className="w-full py-2.5 bg-[#0052FF] hover:bg-[#0042D0] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Add ₹{selectedTopUp} to Wallet
          </button>
        </div>

        {/* Payment Methods */}
        <h3 className="text-xs font-bold text-slate-700 px-1">UPI & Net Banking</h3>
        <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-2xs border border-slate-100 overflow-hidden">
          {[
            { name: 'Google Pay UPI', desc: 'Fast & instant 1-tap checkout', icon: '🟢' },
            { name: 'PhonePe', desc: 'UPI AutoPay supported', icon: '🟣' },
            { name: 'Paytm Wallet & UPI', desc: 'Linked to mobile number', icon: '🔵' },
            { name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
            { name: 'Cash on Delivery', desc: 'Pay driver upon pickup or delivery', icon: '💵' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
