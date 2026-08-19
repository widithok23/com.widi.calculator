import React from 'react';
import { ThemeAccent } from '../types';

interface BasicKeypadProps {
  onInsert: (char: string) => void;
  onClear: () => void;
  onCalculate: () => void;
  onToggleSign: () => void;
  onParentheses: () => void;
  accent: ThemeAccent;
}

export const BasicKeypad: React.FC<BasicKeypadProps> = ({
  onInsert,
  onClear,
  onCalculate,
  onToggleSign,
  onParentheses,
  accent,
}) => {
  // Theme styling for primary operators and equals button
  const themeStyles: Record<ThemeAccent, { opText: string; opBg: string; equalsBg: string; equalsText: string }> = {
    amber: {
      opText: 'text-amber-400',
      opBg: 'bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30',
      equalsBg: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600',
      equalsText: 'text-neutral-950 font-bold',
    },
    cyan: {
      opText: 'text-cyan-400',
      opBg: 'bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30',
      equalsBg: 'bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600',
      equalsText: 'text-neutral-950 font-bold',
    },
    emerald: {
      opText: 'text-emerald-400',
      opBg: 'bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30',
      equalsBg: 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600',
      equalsText: 'text-neutral-950 font-bold',
    },
    coral: {
      opText: 'text-rose-400',
      opBg: 'bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30',
      equalsBg: 'bg-rose-500 hover:bg-rose-400 active:bg-rose-600',
      equalsText: 'text-white font-bold',
    },
    violet: {
      opText: 'text-purple-400',
      opBg: 'bg-purple-500/10 hover:bg-purple-500/20 active:bg-purple-500/30',
      equalsBg: 'bg-purple-500 hover:bg-purple-400 active:bg-purple-600',
      equalsText: 'text-white font-bold',
    },
  };

  const currentTheme = themeStyles[accent];

  // Base button styles for tactile Android feel
  const numKeyClass =
    'h-14 sm:h-16 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700/90 active:bg-neutral-600 text-neutral-100 text-2xl sm:text-3xl font-medium shadow-sm transition-all duration-150 active:scale-95 flex items-center justify-center select-none cursor-pointer';

  const actionKeyClass =
    'h-14 sm:h-16 rounded-2xl bg-neutral-800/50 hover:bg-neutral-700/60 active:bg-neutral-600 text-neutral-300 text-xl sm:text-2xl font-semibold shadow-sm transition-all duration-150 active:scale-95 flex items-center justify-center select-none cursor-pointer';

  const operatorKeyClass = `h-14 sm:h-16 rounded-2xl ${currentTheme.opBg} ${currentTheme.opText} text-2xl sm:text-3xl font-semibold shadow-sm transition-all duration-150 active:scale-95 flex items-center justify-center select-none cursor-pointer`;

  const equalsKeyClass = `h-14 sm:h-16 rounded-2xl ${currentTheme.equalsBg} ${currentTheme.equalsText} text-3xl sm:text-4xl shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center select-none cursor-pointer`;

  return (
    <div
      id="basic-keypad-container"
      className="p-4 sm:p-5 grid grid-cols-4 gap-2.5 sm:gap-3 flex-grow select-none"
    >
      {/* Row 1: AC, (), %, ÷ */}
      <button
        id="btn-key-ac"
        type="button"
        onClick={onClear}
        className={`${actionKeyClass} text-rose-400 hover:text-rose-300`}
        aria-label="All Clear"
      >
        AC
      </button>

      <button
        id="btn-key-parentheses"
        type="button"
        onClick={onParentheses}
        className={actionKeyClass}
        aria-label="Parentheses"
      >
        ( )
      </button>

      <button
        id="btn-key-percent"
        type="button"
        onClick={() => onInsert('%')}
        className={actionKeyClass}
        aria-label="Percent"
      >
        %
      </button>

      <button
        id="btn-key-divide"
        type="button"
        onClick={() => onInsert('÷')}
        className={operatorKeyClass}
        aria-label="Divide"
      >
        ÷
      </button>

      {/* Row 2: 7, 8, 9, × */}
      <button
        id="btn-key-7"
        type="button"
        onClick={() => onInsert('7')}
        className={numKeyClass}
      >
        7
      </button>

      <button
        id="btn-key-8"
        type="button"
        onClick={() => onInsert('8')}
        className={numKeyClass}
      >
        8
      </button>

      <button
        id="btn-key-9"
        type="button"
        onClick={() => onInsert('9')}
        className={numKeyClass}
      >
        9
      </button>

      <button
        id="btn-key-multiply"
        type="button"
        onClick={() => onInsert('×')}
        className={operatorKeyClass}
        aria-label="Multiply"
      >
        ×
      </button>

      {/* Row 3: 4, 5, 6, − */}
      <button
        id="btn-key-4"
        type="button"
        onClick={() => onInsert('4')}
        className={numKeyClass}
      >
        4
      </button>

      <button
        id="btn-key-5"
        type="button"
        onClick={() => onInsert('5')}
        className={numKeyClass}
      >
        5
      </button>

      <button
        id="btn-key-6"
        type="button"
        onClick={() => onInsert('6')}
        className={numKeyClass}
      >
        6
      </button>

      <button
        id="btn-key-subtract"
        type="button"
        onClick={() => onInsert('-')}
        className={operatorKeyClass}
        aria-label="Subtract"
      >
        −
      </button>

      {/* Row 4: 1, 2, 3, + */}
      <button
        id="btn-key-1"
        type="button"
        onClick={() => onInsert('1')}
        className={numKeyClass}
      >
        1
      </button>

      <button
        id="btn-key-2"
        type="button"
        onClick={() => onInsert('2')}
        className={numKeyClass}
      >
        2
      </button>

      <button
        id="btn-key-3"
        type="button"
        onClick={() => onInsert('3')}
        className={numKeyClass}
      >
        3
      </button>

      <button
        id="btn-key-add"
        type="button"
        onClick={() => onInsert('+')}
        className={operatorKeyClass}
        aria-label="Add"
      >
        +
      </button>

      {/* Row 5: ±, 0, ., = */}
      <button
        id="btn-key-plus-minus"
        type="button"
        onClick={onToggleSign}
        className={actionKeyClass}
        aria-label="Plus Minus"
      >
        ⁺/₋
      </button>

      <button
        id="btn-key-0"
        type="button"
        onClick={() => onInsert('0')}
        className={numKeyClass}
      >
        0
      </button>

      <button
        id="btn-key-decimal"
        type="button"
        onClick={() => onInsert('.')}
        className={numKeyClass}
      >
        .
      </button>

      <button
        id="btn-key-equals"
        type="button"
        onClick={onCalculate}
        className={equalsKeyClass}
        aria-label="Equals"
      >
        =
      </button>
    </div>
  );
};
