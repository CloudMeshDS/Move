import React from 'react';
import { ArrowLeft, User, MapPin, ShieldCheck, FileText, Phone, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface AccountScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onManageAddresses: () => void;
}

export function AccountScreen({ onBack, onLogout, onManageAddresses }: AccountScreenProps) {
  const { customerProfile } = useLogistics();

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] select-none overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">My Account</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-lg">
              {customerProfile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{customerProfile.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{customerProfile.phone}</p>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Verified Customer
              </span>
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-2xs border border-slate-100 overflow-hidden">
          <div
            onClick={onManageAddresses}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#0052FF]" />
              <span className="text-xs font-semibold text-slate-800">Saved Addresses</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#0052FF]" />
              <span className="text-xs font-semibold text-slate-800">GST & Invoices</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
              <span className="text-xs font-semibold text-slate-800">Safety & Insurance</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#0052FF]" />
              <span className="text-xs font-semibold text-slate-800">Help & Support 24x7</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
