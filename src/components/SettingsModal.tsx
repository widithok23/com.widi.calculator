import React from 'react';
import { CalculatorSettings, NumberFormatMode, ThemeAccent } from '../types';
import { X, Volume2, VolumeX, Smartphone, Palette, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculatorSettings;
  onUpdateSettings: (newSettings: Partial<CalculatorSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const accents: { id: ThemeAccent; label: string; colorClass: string }[] = [
    { id: 'amber', label: 'Amber Gold', colorClass: 'bg-amber-500' },
    { id: 'cyan', label: 'Pixel Cyan', colorClass: 'bg-cyan-500' },
    { id: 'emerald', label: 'Emerald Mint', colorClass: 'bg-emerald-500' },
    { id: 'coral', label: 'Coral Flame', colorClass: 'bg-rose-500' },
    { id: 'violet', label: 'Deep Violet', colorClass: 'bg-purple-500' },
  ];

  const formatModes: { id: NumberFormatMode; label: string; desc: string }[] = [
    { id: 'NORMAL', label: 'Standard', desc: 'Auto standard notation (e.g. 1,234.56)' },
    { id: 'SCI', label: 'Scientific', desc: 'Exponential powers (e.g. 1.2345e+6)' },
    { id: 'ENG', label: 'Engineering', desc: 'Multiples of 3 powers (e.g. 1.23e+3)' },
  ];

  return (
    <div
      id="settings-modal-overlay"
      className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end transition-opacity duration-200"
    >
      <div
        id="settings-modal-sheet"
        className="w-full max-h-[85%] bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80">
          <h3 className="text-base font-bold text-neutral-100">Calculator Preferences</h3>
          <button
            id="btn-close-settings"
            onClick={onClose}
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-full transition-colors active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section: Feedback (Sound & Vibration) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5" />
              Tactile & Audio Feedback
            </h4>

            <div className="space-y-2">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-neutral-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-neutral-200">Key Click Sound</div>
                    <div className="text-xs text-neutral-500">Play acoustic click on button press</div>
                  </div>
                </div>
                <button
                  id="toggle-sound-switch"
                  type="button"
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    settings.soundEnabled ? 'bg-amber-500' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-neutral-950 transition-transform duration-200 ease-in-out ${
                      settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Haptic Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-medium text-neutral-200">Vibration (Haptics)</div>
                    <div className="text-xs text-neutral-500">Subtle vibration pulse on tap</div>
                  </div>
                </div>
                <button
                  id="toggle-haptics-switch"
                  type="button"
                  onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    settings.hapticsEnabled ? 'bg-amber-500' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-neutral-950 transition-transform duration-200 ease-in-out ${
                      settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Display & Precision */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              Number Format & Precision
            </h4>

            {/* Format Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              {formatModes.map((mode) => (
                <button
                  key={mode.id}
                  id={`btn-format-mode-${mode.id}`}
                  type="button"
                  onClick={() => onUpdateSettings({ formatMode: mode.id })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    settings.formatMode === mode.id
                      ? 'bg-neutral-800 border-amber-500/50 text-white ring-1 ring-amber-500/30'
                      : 'bg-neutral-800/40 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{mode.label}</div>
                  <div className="text-[10px] text-neutral-500 leading-tight">{mode.desc}</div>
                </button>
              ))}
            </div>

            {/* Precision Range */}
            <div className="p-3.5 rounded-2xl bg-neutral-800/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-medium">Decimal Precision</span>
                <span className="font-mono text-amber-400 font-bold">{settings.precision} digits</span>
              </div>
              <input
                id="input-decimal-precision"
                type="range"
                min="2"
                max="12"
                step="1"
                value={settings.precision}
                onChange={(e) => onUpdateSettings({ precision: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 bg-neutral-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>2 (Currency)</span>
                <span>8 (Standard)</span>
                <span>12 (High precision)</span>
              </div>
            </div>
          </div>

          {/* Section: Accent Color */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              Theme Accent
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {accents.map((acc) => (
                <button
                  key={acc.id}
                  id={`btn-theme-accent-${acc.id}`}
                  type="button"
                  onClick={() => onUpdateSettings({ accent: acc.id })}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                    settings.accent === acc.id
                      ? 'bg-neutral-800 border-neutral-600 ring-2 ring-neutral-400'
                      : 'bg-neutral-800/40 border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${acc.colorClass} shadow-sm`} />
                  <span className="text-[10px] font-medium text-neutral-300 truncate">{acc.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
