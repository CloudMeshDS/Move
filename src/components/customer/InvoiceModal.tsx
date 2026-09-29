import React from 'react';
import { X, CheckCircle, Download, FileText, Share2, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { LogisticsOrder } from '../../types/logistics';
import { useLogistics } from '../../context/LogisticsContext';

interface InvoiceModalProps {
  order: LogisticsOrder;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const { theme } = useLogistics();
  const isLight = theme === 'light';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              M
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Delivery Invoice & POD</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{order.trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/40 border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className={`text-sm font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>Trip Completed & Verified</p>
                <p className={`text-xs ${isLight ? 'text-emerald-700' : 'text-emerald-400/80'}`}>Paid via {order.paymentMethod.replace('_', ' ').toUpperCase()} (NZD)</p>
              </div>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ${order.fare.totalFare.toFixed(2)}
            </span>
          </div>

          {/* Addresses & Route Details */}
          <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-800'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Pickup Location</span>
                <p className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.pickup.name}</p>
                <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>{order.pickup.address}</p>
              </div>
            </div>
            <div className={`border-l-2 border-dashed ml-1.5 pl-4 py-1 ${isLight ? 'border-slate-300 text-slate-500' : 'border-slate-700 text-slate-500'}`}>
              <span>{order.fare.distanceKm} km total trip distance</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 mt-1 shrink-0" />
              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Delivery Destination</span>
                <p className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.drop.name}</p>
                <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>{order.drop.address}</p>
              </div>
            </div>
          </div>

          {/* Vehicle & Partner Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-800'
            }`}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Assigned Vehicle</span>
              <p className={`font-semibold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.vehicleName}</p>
              <p className={`font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{order.driverVehiclePlate || 'Commercial'}</p>
            </div>
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-800'
            }`}>
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Driver Partner</span>
              <p className={`font-semibold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.driverName || 'Verified Partner'}</p>
              <p className={`mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Rating: ⭐ {order.driverRating || 4.9}</p>
            </div>
          </div>

          {/* Transparent Itemized Fare Breakdown */}
          <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-800/80'
          }`}>
            <h4 className={`font-semibold text-sm mb-2 ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Itemized Tax Invoice (NZ IRD Compliant)</h4>
            <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Base Fare (First {order.fare.distanceKm > 3 ? '3-5' : '3'} km)</span>
              <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>${order.fare.baseFare.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Distance Charge ({order.fare.distanceKm} km)</span>
              <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>${order.fare.distanceFare.toFixed(2)}</span>
            </div>
            {order.helperCount > 0 && (
              <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <span>Loading & Lifting Assistance ({order.helperCount} helper)</span>
                <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>${order.fare.helperFare.toFixed(2)}</span>
              </div>
            )}
            <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>New Zealand GST (15%)</span>
              <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>${order.fare.gstTax.toFixed(2)}</span>
            </div>
            {order.fare.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Promotional Voucher</span>
                <span className="font-mono">-${order.fare.discount.toFixed(2)}</span>
              </div>
            )}
            <div className={`pt-2 border-t flex justify-between text-sm font-bold ${
              isLight ? 'border-slate-200 text-slate-900' : 'border-slate-700/80 text-white'
            }`}>
              <span>Total Amount Paid (NZD)</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">${order.fare.totalFare.toFixed(2)}</span>
            </div>
          </div>

          {/* Proof of Delivery (POD) Signature & Stamp */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-800'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Digital Proof of Delivery (e-POD)</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Recipient Name: <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.pod?.recipientName || 'Verified at Doorstep'}</span></p>
                <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Verified via Customer OTP: <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{order.otp}</span></p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                SIGNED
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900'
        }`}>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
          <button
            onClick={onClose}
            className={`py-3 px-4 rounded-xl font-semibold text-xs transition ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
