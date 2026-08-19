import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, X, ArrowUpRight, Copy, Check } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectExpression: (expr: string) => void;
  onSelectResult: (res: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectExpression,
  onSelectResult,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard?.writeText(item.result);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      id="history-modal-overlay"
      className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end transition-opacity duration-200"
    >
      <div
        id="history-drawer-sheet"
        className="w-full max-h-[80%] bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-100">Calculation History</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                id="btn-clear-history-all"
                onClick={onClearHistory}
                type="button"
                className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/60 rounded-full transition-colors active:scale-95"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="btn-close-history"
              onClick={onClose}
              type="button"
              className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-full transition-colors active:scale-95"
              title="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div id="history-items-container" className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-800/60 flex items-center justify-center text-neutral-400">
                <Trash2 className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-sm font-medium">No calculation history yet</p>
              <p className="text-xs text-neutral-600">Calculations will be saved automatically</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="p-3.5 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-800 transition-all flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-[11px] text-neutral-500">{formatTime(item.timestamp)}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {item.angleMode}
                  </span>
                </div>

                <div
                  onClick={() => {
                    onSelectExpression(item.expression);
                    onClose();
                  }}
                  className="font-mono text-sm text-neutral-300 hover:text-white cursor-pointer truncate py-0.5"
                  title="Click to edit this expression"
                >
                  {item.expression}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                  <div
                    onClick={() => {
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="font-mono text-lg font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                    title="Click to use result"
                  >
                    = {item.result}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`btn-copy-history-${item.id}`}
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/60 transition-colors"
                      title="Copy result"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      id={`btn-use-history-${item.id}`}
                      type="button"
                      onClick={() => {
                        onSelectResult(item.result);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/60 transition-colors"
                      title="Insert into expression"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
