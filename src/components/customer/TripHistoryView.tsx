import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, MapPin, Truck, ChevronRight } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { LogisticsOrder } from '../../types/logistics';
import { InvoiceModal } from './InvoiceModal';

interface TripHistoryViewProps {
  onSelectOrder: (orderId: string) => void;
}

export function TripHistoryView({ onSelectOrder }: TripHistoryViewProps) {
  const { orders, theme } = useLogistics();
  const isLight = theme === 'light';
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<LogisticsOrder | null>(null);

  if (orders.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[400px] ${
        isLight ? 'text-slate-500' : 'text-slate-400'
      }`}>
        <Truck className={`w-12 h-12 mb-3 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
        <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>No delivery trips yet</h4>
        <p className="text-xs max-w-xs mt-1">
          Your active and completed urban logistics orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 space-y-3 pb-24 transition-colors ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      <div className={`flex items-center justify-between pb-2 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Shipments</h3>
        <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{orders.length} orders</span>
      </div>

      {orders.map((order) => {
        const isDelivered = order.status === 'delivered';
        const isCancelled = order.status === 'cancelled';

        return (
          <div
            key={order.id}
            className={`p-4 border rounded-2xl space-y-3 transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{order.trackingNumber}</span>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
                <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{order.vehicleName}</span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isDelivered
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : isCancelled
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                }`}
              >
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Route Summary */}
            <div className={`space-y-1.5 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{order.pickup.name}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">{order.drop.name}</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className={`pt-2 border-t flex items-center justify-between text-xs ${
              isLight ? 'border-slate-100' : 'border-slate-800/80'
            }`}>
              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total: </span>
                <span className={`font-mono font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>${order.fare.totalFare.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                {isDelivered && (
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition ${
                      isLight
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-blue-400 hover:text-blue-300 hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectOrder(order.id)}
                  className={`py-1 px-3 rounded-xl font-medium text-[11px] flex items-center gap-1 transition ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
}
