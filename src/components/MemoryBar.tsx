import React from 'react';

interface MemoryBarProps {
  memoryValue: number;
  onClearMemory: () => void;
  onRecallMemory: () => void;
  onAddToMemory: () => void;
  onSubtractFromMemory: () => void;
  onStoreMemory: () => void;
}

export const MemoryBar: React.FC<MemoryBarProps> = ({
  memoryValue,
  onClearMemory,
  onRecallMemory,
  onAddToMemory,
  onSubtractFromMemory,
  onStoreMemory,
}) => {
  const hasMemory = memoryValue !== 0;

  return (
    <div
      id="memory-controls-bar"
      className="flex items-center justify-between px-6 py-1.5 border-t border-b border-neutral-800/60 bg-neutral-950/40 text-xs font-semibold text-neutral-400 select-none"
    >
      <button
        id="btn-memory-clear"
        type="button"
        disabled={!hasMemory}
        onClick={onClearMemory}
        className={`px-3 py-1 rounded transition-all active:scale-90 ${
          hasMemory
            ? 'text-neutral-200 hover:text-white hover:bg-neutral-800/80 cursor-pointer'
            : 'text-neutral-600 opacity-50 cursor-not-allowed'
        }`}
      >
        MC
      </button>

      <button
        id="btn-memory-recall"
        type="button"
        disabled={!hasMemory}
        onClick={onRecallMemory}
        className={`px-3 py-1 rounded transition-all active:scale-90 ${
          hasMemory
            ? 'text-amber-400 font-bold hover:bg-neutral-800/80 cursor-pointer'
            : 'text-neutral-600 opacity-50 cursor-not-allowed'
        }`}
      >
        MR
      </button>

      <button
        id="btn-memory-add"
        type="button"
        onClick={onAddToMemory}
        className="px-3 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all active:scale-90 cursor-pointer"
      >
        M+
      </button>

      <button
        id="btn-memory-subtract"
        type="button"
        onClick={onSubtractFromMemory}
        className="px-3 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all active:scale-90 cursor-pointer"
      >
        M-
      </button>

      <button
        id="btn-memory-store"
        type="button"
        onClick={onStoreMemory}
        className="px-3 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all active:scale-90 cursor-pointer"
      >
        MS
      </button>
    </div>
  );
};
