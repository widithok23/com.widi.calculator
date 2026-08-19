import React, { useRef, useEffect } from 'react';
import { AngleMode, ThemeAccent } from '../types';
import { History, Settings, Copy, Delete, Check } from 'lucide-react';

interface DisplayScreenProps {
  expression: string;
  previewResult: string | null;
  hasError: boolean;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onBackspace: () => void;
  onClear: () => void;
  memoryValue: number;
  accent: ThemeAccent;
  historyCount: number;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  expression,
  previewResult,
  hasError,
  angleMode,
  onToggleAngleMode,
  onOpenHistory,
  onOpenSettings,
  onBackspace,
  memoryValue,
  accent,
  historyCount,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll expression to right end
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression]);

  const handleCopy = () => {
    const textToCopy = previewResult || expression || '0';
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Accent colors mapping
  const accentBadgeColors: Record<ThemeAccent, string> = {
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
    coral: 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25',
    violet: 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25',
  };

  // Format expression for visual syntax readability
  const renderFormattedExpression = (expr: string) => {
    if (!expr) {
      return <span className="text-neutral-600 select-none">0</span>;
    }

    // Split into tokens of operators, functions, brackets, numbers
    const parts = expr.split(/([+\-×÷*/%^²³!()]|[a-zA-Zπφ√∛]+)/g).filter(Boolean);

    return parts.map((part, idx) => {
      if (['+', '-', '×', '÷', '*', '/', '%', '^', 'mod'].includes(part)) {
        return (
          <span key={idx} className="text-amber-400 font-semibold px-0.5">
            {part === '*' ? '×' : part === '/' ? '÷' : part}
          </span>
        );
      }
      if (['(', ')', '²', '³', '!'].includes(part)) {
        return (
          <span key={idx} className="text-cyan-400 font-medium">
            {part}
          </span>
        );
      }
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'log2', 'sqrt', 'cbrt', 'abs'].includes(part.toLowerCase())) {
        return (
          <span key={idx} className="text-violet-400 font-medium italic pr-0.5">
            {part}
          </span>
        );
      }
      if (['π', 'φ', 'e'].includes(part)) {
        return (
          <span key={idx} className="text-emerald-400 font-semibold">
            {part}
          </span>
        );
      }
      return (
        <span key={idx} className="text-neutral-100 font-medium">
          {part}
        </span>
      );
    });
  };

  // Determine dynamic font size based on length
  const exprLength = expression.length;
  let fontClasses = 'text-4xl sm:text-5xl';
  if (exprLength > 18) {
    fontClasses = 'text-2xl sm:text-3xl';
  } else if (exprLength > 10) {
    fontClasses = 'text-3xl sm:text-4xl';
  }

  return (
    <div
      id="display-screen-container"
      className="flex flex-col justify-between px-6 pt-1 pb-4 select-none min-h-[190px] relative transition-all"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          {/* Angle Mode Badge Button */}
          <button
            id="btn-toggle-angle-mode"
            onClick={onToggleAngleMode}
            type="button"
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer ${accentBadgeColors[accent]}`}
            title={`Switch to ${angleMode === 'DEG' ? 'Radians (RAD)' : 'Degrees (DEG)'}`}
          >
            {angleMode}
          </button>

          {/* Memory Tag Indicator if memory stored */}
          {memoryValue !== 0 && (
            <span
              id="memory-indicator-badge"
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/80 animate-pulse"
              title={`Stored in Memory: ${memoryValue}`}
            >
              M = {memoryValue}
            </span>
          )}
        </div>

        {/* Right side utility icons */}
        <div className="flex items-center gap-1">
          {/* Copy Button */}
          <button
            id="btn-copy-result"
            onClick={handleCopy}
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-full transition-colors active:scale-95"
            title="Copy result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* History Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-full transition-colors relative active:scale-95"
            title="View Calculation History"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-neutral-900" />
            )}
          </button>

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-full transition-colors active:scale-95"
            title="Calculator Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex flex-col items-end justify-end flex-grow gap-1 text-right mt-1">
        {/* Scrollable Expression */}
        <div
          ref={scrollRef}
          id="active-expression-display"
          className={`w-full overflow-x-auto overflow-y-hidden whitespace-nowrap text-right tracking-tight font-mono transition-all scrollbar-none py-1 ${fontClasses}`}
        >
          {renderFormattedExpression(expression)}
        </div>

        {/* Live Preview Result / Error */}
        <div className="min-h-[32px] flex items-center justify-end w-full">
          {hasError ? (
            <span id="calculation-error-label" className="text-rose-400 text-sm font-medium animate-pulse">
              Invalid Format
            </span>
          ) : previewResult ? (
            <div className="flex items-center gap-2 text-neutral-400 text-xl sm:text-2xl font-mono tracking-tight">
              <span className="text-neutral-600 text-base">=</span>
              <span id="live-preview-result" className="text-neutral-300 font-semibold">
                {previewResult}
              </span>
            </div>
          ) : (
            <span className="text-transparent text-sm select-none">.</span>
          )}
        </div>
      </div>

      {/* Quick Backspace / Action Row on the right when expression exists */}
      {expression.length > 0 && (
        <div className="absolute right-6 bottom-1 flex items-center gap-2">
          <button
            id="btn-inline-backspace"
            onClick={onBackspace}
            type="button"
            className="p-1.5 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/80 rounded-full transition-colors active:scale-90"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
