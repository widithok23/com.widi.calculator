import React, { useEffect, useState } from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

interface AndroidStatusBarProps {
  appName?: string;
  isScientificOpen?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = () => {
  const [timeStr, setTimeStr] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full flex items-center justify-between px-6 pt-3 pb-2 select-none text-neutral-400 text-xs font-medium tracking-tight z-20"
    >
      {/* Time & Android Notification Icon */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-neutral-200 text-sm tracking-normal">{timeStr}</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-500">
          <Sparkles className="w-3 h-3 text-amber-400/80" />
        </span>
      </div>

      {/* Camera Cutout Notch */}
      <div className="w-4 h-4 rounded-full bg-neutral-950 border border-neutral-800/80 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800" />
      </div>

      {/* System Icons: 5G / Wifi / Battery */}
      <div className="flex items-center gap-2 text-neutral-300">
        <span className="text-[11px] font-bold tracking-wider text-neutral-400">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <BatteryMedium className="w-4 h-4 text-neutral-200" />
          <span className="text-[11px] text-neutral-400">84%</span>
        </div>
      </div>
    </div>
  );
};
