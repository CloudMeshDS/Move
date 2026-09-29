import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, KeyRound, Delete, Globe } from 'lucide-react';

interface OtpScreenProps {
  phoneNumber: string;
  onChangeNumber: () => void;
  onVerifySuccess: () => void;
}

export function OtpScreen({ phoneNumber, onChangeNumber, onVerifySuccess }: OtpScreenProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendSeconds, setResendSeconds] = useState<number>(14);
  const [suggestedOtp, setSuggestedOtp] = useState<string>('897918');

  // Countdown timer
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  // Handle keypad digit tap
  const handleKeyTap = (val: string) => {
    const firstEmptyIndex = digits.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const next = [...digits];
      next[firstEmptyIndex] = val;
      setDigits(next);

      // Auto submit if all 6 filled
      if (firstEmptyIndex === 5) {
        setTimeout(() => {
          onVerifySuccess();
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    // Find last filled index
    for (let i = digits.length - 1; i >= 0; i--) {
      if (digits[i] !== '') {
        const next = [...digits];
        next[i] = '';
        setDigits(next);
        return;
      }
    }
  };

  const handleAutoFill = () => {
    const otpArr = suggestedOtp.split('');
    setDigits(otpArr);
    setTimeout(() => {
      onVerifySuccess();
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden justify-between">
      {/* Top Scenic Banner: Curved Hill Road & Bike */}
      <div className="w-full h-32 bg-gradient-to-b from-[#E6F3FF] to-white relative overflow-hidden shrink-0">
        <svg
          viewBox="0 0 380 130"
          className="w-full h-full"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Hill Background */}
          <path
            d="M 0,90 Q 90,30 200,60 T 380,40 L 380,130 L 0,130 Z"
            fill="#D2EDFD"
            opacity="0.5"
          />
          {/* Trees / Foliage Silhouettes */}
          <circle cx="150" cy="50" r="18" fill="#BBE2FA" />
          <circle cx="170" cy="46" r="22" fill="#B2DEFA" />
          <circle cx="360" cy="30" r="24" fill="#BBE2FA" />

          {/* Curved Hill Road Track */}
          <path
            d="M -20,20 Q 90,105 240,40 T 400,60"
            stroke="#4A90E2"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Dashed Road Center Line */}
          <path
            d="M -20,20 Q 90,105 240,40 T 400,60"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Destination Blue Pin */}
          <g transform="translate(250, 20)">
            <path
              d="M 12,0 C 5.37,0 0,5.37 0,12 C 0,21 12,32 12,32 C 12,32 24,21 24,12 C 24,5.37 18.63,0 12,0 Z"
              fill="#0052FF"
            />
            <circle cx="12" cy="11" r="5" fill="#FFFFFF" />
          </g>

          {/* Porter 2-Wheeler Delivery Bike Vector */}
          <g transform="translate(40, 26)">
            {/* Rear Wheel */}
            <circle cx="12" cy="32" r="9" stroke="#2C3E50" strokeWidth="4" fill="#FFFFFF" />
            {/* Front Wheel */}
            <circle cx="52" cy="32" r="9" stroke="#2C3E50" strokeWidth="4" fill="#FFFFFF" />
            {/* Chassis */}
            <path d="M 12,32 L 28,32 L 40,16 L 52,32" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Handlebar */}
            <path d="M 40,16 L 36,8 L 44,8" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Blue Porter Delivery Box on Carrier */}
            <rect x="2" y="10" width="16" height="15" rx="3" fill="#0052FF" stroke="#003DB8" strokeWidth="1.5" />
            {/* Rider Helmet */}
            <circle cx="30" cy="6" r="6" fill="#0052FF" />
            {/* Rider Body */}
            <path d="M 28,12 L 32,24" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="px-6 flex-1 flex flex-col justify-start">
        {/* Title */}
        <h1 className="text-2xl font-black text-[#1A1F2C] tracking-tight mt-1 mb-1.5">
          OTP Verification
        </h1>

        {/* Subtitle with Change button */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-6">
          <span>OTP sent to</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <span>🇮🇳</span> {phoneNumber}
          </span>
          <button
            type="button"
            onClick={onChangeNumber}
            className="text-[#0052FF] font-bold hover:underline ml-1"
          >
            Change
          </button>
        </p>

        {/* 6 Digit OTP Input Boxes */}
        <div className="flex items-center justify-between gap-2.5 mb-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const hasVal = digits[idx] !== '';
            const isActive = digits.findIndex((d) => d === '') === idx || (idx === 5 && digits[5] !== '');

            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-xl transition-all duration-200 ${
                  isActive
                    ? 'border-2 border-[#0052FF] bg-blue-50/20 text-[#0052FF] shadow-sm'
                    : hasVal
                    ? 'border border-slate-300 bg-slate-50 text-slate-900'
                    : 'border border-slate-200 bg-[#F8FAFC] text-slate-400'
                }`}
              >
                {digits[idx] || (isActive ? '' : '0')}
              </div>
            );
          })}
        </div>

        {/* Auto read indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6">
          <RefreshCw className="w-3.5 h-3.5 text-[#0052FF] animate-spin" />
          <span>Waiting to auto read OTP</span>
        </div>

        {/* Resend Timer & WhatsApp/SMS Actions */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {resendSeconds > 0
              ? `RESEND OTP IN ${String(resendSeconds).padStart(2, '0')} SECONDS`
              : 'DID NOT RECEIVE OTP?'}
          </p>

          <div className="flex items-center gap-3">
            {/* WhatsApp Resend Pill */}
            <button
              type="button"
              onClick={() => {
                setResendSeconds(25);
                setSuggestedOtp('482910');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              <span className="text-base text-emerald-500">💬</span>
              <span>WhatsApp</span>
            </button>

            {/* SMS Resend Pill */}
            <button
              type="button"
              onClick={() => {
                setResendSeconds(25);
                setSuggestedOtp('918274');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>SMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS-Style Interactive Number Keypad */}
      <div className="bg-[#D1D5DB]/50 backdrop-blur-md pt-2 pb-6 border-t border-slate-300/60 shrink-0">
        {/* Autofill from SMS Messages Chip */}
        <div className="px-4 mb-2">
          <button
            type="button"
            onClick={handleAutoFill}
            className="w-full py-2 bg-white/95 hover:bg-white rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-between px-4 transition active:scale-[0.99]"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] text-slate-400 font-semibold">From Messages</span>
              <span className="text-sm font-mono font-bold text-[#0052FF] tracking-wider">{suggestedOtp}</span>
            </div>
            <KeyRound className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 12 Key Numeric Pad */}
        <div className="grid grid-cols-3 gap-2 px-3">
          {[
            { num: '1', letters: '' },
            { num: '2', letters: 'ABC' },
            { num: '3', letters: 'DEF' },
            { num: '4', letters: 'GHI' },
            { num: '5', letters: 'JKL' },
            { num: '6', letters: 'MNO' },
            { num: '7', letters: 'PQRS' },
            { num: '8', letters: 'TUV' },
            { num: '9', letters: 'WXYZ' },
          ].map((k) => (
            <button
              key={k.num}
              type="button"
              onClick={() => handleKeyTap(k.num)}
              className="h-12 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg shadow-xs flex flex-col items-center justify-center transition"
            >
              <span className="text-xl font-medium text-slate-900 leading-none">{k.num}</span>
              {k.letters && <span className="text-[9px] font-semibold text-slate-400 tracking-wider leading-none mt-0.5">{k.letters}</span>}
            </button>
          ))}

          {/* Bottom row: Globe, 0, Backspace */}
          <button
            type="button"
            className="h-12 bg-transparent flex items-center justify-center text-slate-600 active:opacity-60"
          >
            <Globe className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleKeyTap('0')}
            className="h-12 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg shadow-xs flex items-center justify-center transition"
          >
            <span className="text-xl font-medium text-slate-900 leading-none">0</span>
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 bg-transparent flex items-center justify-center text-slate-600 active:opacity-60"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
