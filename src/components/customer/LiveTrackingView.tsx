import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Share2,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  FileText,
  Play,
  Pause,
  FastForward,
  Star,
  XCircle,
  Truck
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { LogisticsOrder } from '../../types/logistics';
import { InteractiveCityMap } from '../map/InteractiveCityMap';
import { InvoiceModal } from './InvoiceModal';

interface LiveTrackingViewProps {
  order: LogisticsOrder;
  onNewBookingClick: () => void;
}

export function LiveTrackingView({ order, onNewBookingClick }: LiveTrackingViewProps) {
  const {
    cancelOrder,
    advanceOrderStage,
    simulateFullDrive,
    pauseDriveSimulation,
    isSimulatingDrive,
    theme
  } = useLogistics();

  const isLight = theme === 'light';

  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: 'Namaste! I am on the way to your pickup location.', time: 'Just now' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [rating, setRating] = useState<number>(5);

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const userMsg = inputMsg.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Now' }
    ]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: 'Received! Reaching in 4 minutes.', time: 'Now' }
      ]);
    }, 1200);
  };

  // Searching Radar Screen
  if (order.status === 'searching') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[500px] p-6 text-center transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}>
        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border border-blue-500/40 animate-pulse" />
          <div className="absolute inset-8 rounded-full border border-blue-400/60" />
          <div className="w-20 h-20 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Truck className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
        </div>

        <h3 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Finding Nearest Partner</h3>
        <p className={`text-xs max-w-xs mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Contacting top-rated {order.vehicleName} partners near {order.pickup.name}...
        </p>

        <div className={`mt-8 p-3.5 border rounded-2xl w-full max-w-xs text-xs space-y-1 ${
          isLight ? 'bg-white border-slate-200 text-slate-600 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <div className="flex justify-between">
            <span>Searching Radius</span>
            <span className={`font-mono ${isLight ? 'text-slate-900 font-bold' : 'text-slate-200'}`}>2.5 km</span>
          </div>
          <div className="flex justify-between">
            <span>Average Match Speed</span>
            <span className={`font-mono ${isLight ? 'text-slate-900 font-bold' : 'text-slate-200'}`}>&lt; 15 seconds</span>
          </div>
        </div>

        <button
          onClick={() => cancelOrder(order.id)}
          className="mt-6 text-xs text-rose-500 hover:text-rose-600 font-semibold"
        >
          Cancel Booking
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';

  return (
    <div className={`flex flex-col h-full overflow-y-auto pb-24 transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Live Map Header */}
      <div className="relative">
        <InteractiveCityMap order={order} heightClass="h-64" />

        {/* ETA Overlay Pill */}
        <div className={`absolute top-3 left-3 backdrop-blur-md px-3.5 py-1.5 rounded-xl border shadow-md flex items-center gap-2 text-xs ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800'
            : 'bg-slate-900/90 border-slate-700/80 text-white'
        }`}>
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isDelivered
              ? 'Trip Completed'
              : order.status === 'in_transit'
              ? 'Arriving in ~8 mins'
              : order.status === 'arrived_pickup'
              ? 'Loading at Pickup'
              : 'Driver Arriving'}
          </span>
        </div>

        {/* OTP Safety Box */}
        {!isDelivered && (
          <div className="absolute top-3 right-3 bg-blue-600/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-400/50 shadow-lg text-right">
            <span className="text-[9px] uppercase tracking-wider text-blue-200 font-bold block">
              Delivery OTP
            </span>
            <span className="text-base font-mono font-extrabold text-white tracking-widest">
              {order.otp}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Driver Profile Card */}
        <div className={`p-4 border rounded-2xl shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/50 bg-slate-800 shrink-0">
                <img
                  src={order.driverPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Driver"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.driverName || 'Move Partner'}</h4>
                  <span className="text-[11px] text-amber-500 font-bold flex items-center">
                    ★ {order.driverRating || 4.9}
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{order.vehicleName}</p>
                <span className="text-[11px] font-mono text-blue-600 font-semibold mt-0.5 inline-block">
                  {order.driverVehiclePlate || 'KWT892'}
                </span>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            {!isDelivered && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowChatModal(true)}
                  className={`p-2.5 rounded-xl transition ${
                    isLight
                      ? 'bg-slate-100 text-blue-600 hover:bg-slate-200'
                      : 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                  }`}
                  title="Chat with Driver"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${order.driverPhone || '+64218492011'}`}
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Live Step Tracker */}
        <div className={`p-4 border rounded-2xl space-y-3 shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Live Order Status
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1">
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Driver Partner Assigned</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{order.driverName} confirmed your trip</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  order.status === 'arrived_pickup' || order.status === 'loading' || order.status === 'in_transit' || isDelivered
                    ? 'bg-emerald-500 text-white font-bold text-[10px]'
                    : isLight ? 'border border-slate-300' : 'border border-slate-700'
                }`}
              >
                {order.status === 'arrived_pickup' || order.status === 'loading' || order.status === 'in_transit' || isDelivered ? '✓' : ''}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Arrived at Pickup & Loading</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{order.pickup.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  order.status === 'in_transit' || isDelivered
                    ? 'bg-emerald-500 text-white font-bold text-[10px]'
                    : isLight ? 'border border-slate-300' : 'border border-slate-700'
                }`}
              >
                {order.status === 'in_transit' || isDelivered ? '✓' : ''}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>In Transit to Destination</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Live GPS tracking active</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  isDelivered ? 'bg-emerald-500 text-white font-bold text-[10px]' : isLight ? 'border border-slate-300' : 'border border-slate-700'
                }`}
              >
                {isDelivered ? '✓' : ''}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Goods Delivered & Verified</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{order.drop.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Fast-Forward Simulation Bar */}
        {!isDelivered && (
          <div className={`p-3 border rounded-2xl flex items-center justify-between text-xs shadow-xs ${
            isLight
              ? 'bg-blue-50/80 border-blue-200 text-blue-900'
              : 'bg-blue-950/40 border-blue-500/30'
          }`}>
            <div>
              <span className={`font-bold block ${isLight ? 'text-blue-900' : 'text-blue-300'}`}>Simulation Control</span>
              <span className={`text-[11px] ${isLight ? 'text-blue-700/70' : 'text-slate-400'}`}>Test live driver progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => advanceOrderStage(order.id)}
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs active:scale-95 transition shadow-xs"
              >
                Next Step
              </button>
              {order.status === 'in_transit' && (
                <button
                  type="button"
                  onClick={() => (isSimulatingDrive ? pauseDriveSimulation() : simulateFullDrive(order.id))}
                  className={`p-1.5 rounded-xl transition ${
                    isLight ? 'bg-white text-slate-700 border border-slate-200 shadow-xs' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                  title="Auto Drive"
                >
                  {isSimulatingDrive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completed Delivery Action Card */}
        {isDelivered && (
          <div className={`p-4 border rounded-2xl space-y-3 shadow-sm ${
            isLight ? 'bg-emerald-50/90 border-emerald-200' : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className={`text-sm font-bold ${isLight ? 'text-emerald-950' : 'text-white'}`}>Delivered Successfully!</h4>
              </div>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                ${order.fare.totalFare.toFixed(2)} NZD Paid
              </span>
            </div>

            {/* Rating Stars */}
            <div className={`pt-2 border-t ${isLight ? 'border-emerald-200' : 'border-emerald-500/20'}`}>
              <p className={`text-xs mb-1.5 ${isLight ? 'text-emerald-900 font-medium' : 'text-slate-300'}`}>Rate {order.driverName}'s service:</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : isLight ? 'text-slate-300' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>View Invoice & POD</span>
              </button>
              <button
                type="button"
                onClick={onNewBookingClick}
                className={`py-2.5 px-4 rounded-xl font-semibold text-xs transition border ${
                  isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                Book Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}

      {/* Live Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm rounded-3xl overflow-hidden flex flex-col h-[460px] border shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold">{order.driverName}</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className={isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : isLight
                        ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className={`p-3 border-t flex items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
            }`}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type instructions for driver..."
                className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                }`}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="px-3 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
