import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { CustomerApp } from './components/customer/CustomerApp';

function CustomerAppContainer() {
  const { theme, toggleTheme, soundEnabled, setSoundEnabled } = useLogistics();
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen w-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Desktop Top Utilities Bar (Hidden on mobile) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-md px-4 py-2 text-xs opacity-70 hover:opacity-100 transition">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
            M
          </div>
          <span>MOVE Customer App</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-500" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Toggle Light/Dark Theme"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-slate-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title={deviceFrame ? 'Fullscreen View' : 'Phone Frame View'}
          >
            {deviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Viewport: Fullscreen on mobile, Phone Shell on desktop */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden ${
          deviceFrame
            ? 'md:max-w-[430px] md:h-[890px] md:max-h-[94vh] md:rounded-[44px] md:border-[8px] md:border-slate-800 md:shadow-2xl md:shadow-blue-950/20'
            : 'h-screen w-screen max-w-none rounded-none border-none'
        } h-screen flex flex-col relative`}
      >
        <CustomerApp />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <CustomerAppContainer />
    </LogisticsProvider>
  );
}
