import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (phone: string) => void;
  initialPhone?: string;
}

export function AuthScreen({ onSuccess, initialPhone = '9876777416' }: AuthScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhone);
  const [error, setError] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Tamil'>('English');

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phoneNumber.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Enter valid mobile number');
      return;
    }
    setError('');
    onSuccess(clean);
  };

  return (
    <div className="flex flex-col h-full bg-[#EBF3FF] relative select-none overflow-hidden">
      {/* Top Header: PORTER Brand Logo */}
      <div className="pt-8 pb-2 flex justify-center z-10">
        <div className="flex items-center gap-0.5">
          <span className="text-2xl font-black tracking-wider text-[#0052FF]">
            PORTER
          </span>
          <span className="text-base font-black text-[#0052FF] -mt-2">
            °
          </span>
        </div>
      </div>

      {/* Hero Vector Area: Map Route & Delivery Boy Illustration */}
      <div className="flex-1 relative flex items-end justify-center overflow-hidden">
        {/* Soft Background Map Grid & Route Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Light Grid Roads */}
          <path
            d="M -20,120 Q 80,180 180,140 T 380,200 M 50,-20 L 50,400 M 180,-20 L 180,400 M 310,-20 L 310,400 M -20,60 L 420,60 M -20,240 L 420,240"
            stroke="#D0E3FF"
            strokeWidth="3"
            fill="none"
          />
          {/* Cyan/Blue Highlight Route Path */}
          <path
            d="M 50,300 L 70,240 L 130,240 L 130,160 L 260,130 L 320,140 L 320,180"
            stroke="#479BFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Origin Pin */}
          <circle cx="50" cy="300" r="10" fill="#479BFF" />
          <circle cx="50" cy="300" r="5" fill="#FFFFFF" />
          {/* Destination Pin */}
          <circle cx="320" cy="180" r="10" fill="#479BFF" />
          <circle cx="320" cy="180" r="5" fill="#FFFFFF" />
        </svg>

        {/* Vector Illustrated Porter Delivery Partner Character */}
        <div className="relative z-10 w-72 h-80 flex justify-center">
          <svg
            viewBox="0 0 280 320"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body / Shoulders */}
            <path
              d="M 60,320 Q 55,240 85,200 L 195,200 Q 225,240 220,320 Z"
              fill="#0052FF"
            />
            {/* Polo Inner Vest / Trim */}
            <path
              d="M 85,200 L 140,240 L 195,200 L 175,320 L 105,320 Z"
              fill="#0040CC"
            />
            {/* White Porter Badge on Chest */}
            <circle cx="165" cy="235" r="9" stroke="#FFFFFF" strokeWidth="3" fill="none" />

            {/* Neck */}
            <rect x="122" y="170" width="36" height="38" rx="8" fill="#F4A579" />

            {/* Head */}
            <ellipse cx="140" cy="140" rx="34" ry="40" fill="#F9B387" />

            {/* Ears */}
            <circle cx="106" cy="142" r="8" fill="#F4A579" />
            <circle cx="174" cy="142" r="8" fill="#F4A579" />

            {/* Hair / Sideburns */}
            <path
              d="M 106,134 Q 106,108 140,108 Q 174,108 174,134"
              stroke="#2A2421"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />

            {/* Eyes */}
            <circle cx="127" cy="138" r="3.5" fill="#2A2421" />
            <circle cx="153" cy="138" r="3.5" fill="#2A2421" />

            {/* Eyebrows */}
            <path d="M 121,128 Q 128,124 135,128" stroke="#2A2421" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 145,128 Q 152,124 159,128" stroke="#2A2421" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Nose */}
            <path d="M 140,136 L 138,146 L 143,146" stroke="#E2895A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Friendly Mustache */}
            <path
              d="M 124,154 C 131,148 138,154 140,152 C 142,154 149,148 156,154 C 160,157 154,162 140,158 C 126,162 120,157 124,154 Z"
              fill="#2A2421"
            />

            {/* Smiling Lips */}
            <path d="M 132,163 Q 140,169 148,163" stroke="#B85E36" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Blue Porter Cap */}
            <path
              d="M 106,124 Q 140,94 174,124 Q 170,100 140,96 Q 110,100 106,124 Z"
              fill="#0052FF"
            />
            {/* Cap Visor */}
            <path
              d="M 102,124 Q 140,110 178,124 Q 140,129 102,124 Z"
              fill="#003DB8"
            />
            {/* Cap Location Pin Emblem */}
            <path
              d="M 140,104 C 137,104 135,106 135,109 C 135,113 140,117 140,117 C 140,117 145,113 145,109 C 145,106 143,104 140,104 Z"
              fill="#FFFFFF"
            />
            <circle cx="140" cy="108.5" r="1.5" fill="#0052FF" />

            {/* Cardboard Box with Packing Tape */}
            <g transform="translate(75, 185)">
              <rect x="0" y="0" width="130" height="95" rx="6" fill="#DFA067" stroke="#BA7738" strokeWidth="2" />
              {/* Tape Strip */}
              <rect x="52" y="0" width="26" height="95" fill="#B3753E" opacity="0.85" />
            </g>

            {/* Hands Holding Box */}
            {/* Left Hand */}
            <path
              d="M 40,230 Q 60,265 95,270 Q 85,285 70,285 Q 35,265 25,240 Z"
              fill="#F4A579"
            />
            {/* Right Hand */}
            <path
              d="M 240,230 Q 220,265 185,270 Q 195,285 210,285 Q 245,265 255,240 Z"
              fill="#F4A579"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Sheet Card: "Let's get started" */}
      <div className="bg-white rounded-t-[32px] px-6 pt-6 pb-8 shadow-2xl z-20 animate-slideUp">
        {/* Title & Language Row */}
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-2xl font-extrabold text-[#1A1F2C] tracking-tight">
            Let's get started
          </h2>

          {/* Language Selector */}
          <button
            type="button"
            onClick={() => {
              const next = selectedLanguage === 'English' ? 'Hindi' : 'English';
              setSelectedLanguage(next);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0052FF] bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition"
          >
            <span className="w-4 h-4 rounded bg-[#0052FF] text-white flex items-center justify-center text-[10px] font-bold">
              A
            </span>
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-3 h-3 text-[#0052FF]" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-5 font-normal">
          Access our services with a valid phone number.
        </p>

        {/* Phone Input Box with Country Code Dropdown */}
        <form onSubmit={handleContinue} className="space-y-3">
          <div className="flex items-center gap-2.5">
            {/* Country Code Pill */}
            <div className="flex items-center gap-1.5 bg-[#F4F6F9] border border-slate-200 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-100 transition shrink-0">
              <span className="text-base">🇮🇳</span>
              <span className="text-sm font-bold text-slate-800">+91</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </div>

            {/* Mobile Number Text Box */}
            <div className="flex-1 relative">
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder="0000000000"
                className={`w-full px-4 py-3 text-base font-semibold tracking-wider rounded-xl border transition focus:outline-none ${
                  error
                    ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-600'
                    : 'border-slate-200 bg-[#F4F6F9] focus:bg-white text-slate-900 focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]'
                }`}
                autoFocus
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {error && (
            <p className="text-[11px] font-medium text-red-600 ml-1">
              {error}
            </p>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-[#0052FF] hover:bg-[#0042D0] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Get OTP</span>
          </button>
        </form>
      </div>
    </div>
  );
}
