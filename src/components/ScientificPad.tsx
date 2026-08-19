import React, { useState } from 'react';
import { AngleMode, ThemeAccent } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScientificPadProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onInsert: (value: string) => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  accent: ThemeAccent;
}

export const ScientificPad: React.FC<ScientificPadProps> = ({
  isExpanded,
  onToggleExpand,
  onInsert,
  angleMode,
  onToggleAngleMode,
  accent,
}) => {
  const [isInv, setIsInv] = useState(false);
  const [isHyp, setIsHyp] = useState(false);

  const accentColors: Record<ThemeAccent, { activeBg: string; text: string; ring: string }> = {
    amber: { activeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'text-amber-400', ring: 'ring-amber-500/30' },
    cyan: { activeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', text: 'text-cyan-400', ring: 'ring-cyan-500/30' },
    emerald: { activeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
    coral: { activeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', text: 'text-rose-400', ring: 'ring-rose-500/30' },
    violet: { activeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', text: 'text-purple-400', ring: 'ring-purple-500/30' },
  };

  // Determine dynamic trigonometry labels based on INV and HYP
  const getTrigFunctions = () => {
    if (isHyp) {
      if (isInv) {
        return {
          sin: { label: 'asinh', insert: 'asinh(' },
          cos: { label: 'acosh', insert: 'acosh(' },
          tan: { label: 'atanh', insert: 'atanh(' },
        };
      }
      return {
        sin: { label: 'sinh', insert: 'sinh(' },
        cos: { label: 'cosh', insert: 'cosh(' },
        tan: { label: 'tanh', insert: 'tanh(' },
      };
    }
    if (isInv) {
      return {
        sin: { label: 'sin⁻¹', insert: 'asin(' },
        cos: { label: 'cos⁻¹', insert: 'acos(' },
        tan: { label: 'tan⁻¹', insert: 'atan(' },
      };
    }
    return {
      sin: { label: 'sin', insert: 'sin(' },
      cos: { label: 'cos', insert: 'cos(' },
      tan: { label: 'tan', insert: 'tan(' },
    };
  };

  const trig = getTrigFunctions();

  // Determine Log/Exp labels based on INV
  const logFunctions = isInv
    ? {
        ln: { label: 'eˣ', insert: 'exp(' },
        log: { label: '10ˣ', insert: '10^(' },
        sqrt: { label: 'x²', insert: '²' },
      }
    : {
        ln: { label: 'ln', insert: 'ln(' },
        log: { label: 'log', insert: 'log(' },
        sqrt: { label: '√', insert: 'sqrt(' },
      };

  return (
    <div
      id="scientific-pad-container"
      className="w-full flex flex-col bg-neutral-900/90 border-b border-neutral-800/80 select-none overflow-hidden transition-all duration-300"
    >
      {/* Expand/Collapse Header Bar */}
      <button
        id="btn-toggle-scientific-drawer"
        type="button"
        onClick={onToggleExpand}
        className="w-full py-1.5 flex items-center justify-center gap-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 transition-colors cursor-pointer"
        title={isExpanded ? 'Collapse scientific functions' : 'Expand scientific functions'}
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
          Scientific Mode {isExpanded ? 'Active' : ''}
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Grid of Scientific Keys */}
      {isExpanded && (
        <div className="p-3 pt-1 grid grid-cols-5 gap-1.5 sm:gap-2">
          {/* Row 1 */}
          <button
            id="btn-sci-deg-rad"
            type="button"
            onClick={onToggleAngleMode}
            className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {angleMode}
          </button>

          <button
            id="btn-sci-inv"
            type="button"
            onClick={() => setIsInv(!isInv)}
            className={`h-10 sm:h-11 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center justify-center ${
              isInv ? accentColors[accent].activeBg : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 border-neutral-700/50'
            }`}
          >
            INV
          </button>

          <button
            id="btn-sci-hyp"
            type="button"
            onClick={() => setIsHyp(!isHyp)}
            className={`h-10 sm:h-11 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center justify-center ${
              isHyp ? accentColors[accent].activeBg : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 border-neutral-700/50'
            }`}
          >
            HYP
          </button>

          <button
            id="btn-sci-sin"
            type="button"
            onClick={() => onInsert(trig.sin.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {trig.sin.label}
          </button>

          <button
            id="btn-sci-cos"
            type="button"
            onClick={() => onInsert(trig.cos.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {trig.cos.label}
          </button>

          {/* Row 2 */}
          <button
            id="btn-sci-tan"
            type="button"
            onClick={() => onInsert(trig.tan.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {trig.tan.label}
          </button>

          <button
            id="btn-sci-ln"
            type="button"
            onClick={() => onInsert(logFunctions.ln.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {logFunctions.ln.label}
          </button>

          <button
            id="btn-sci-log"
            type="button"
            onClick={() => onInsert(logFunctions.log.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {logFunctions.log.label}
          </button>

          <button
            id="btn-sci-sqrt"
            type="button"
            onClick={() => onInsert(logFunctions.sqrt.insert)}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            {logFunctions.sqrt.label}
          </button>

          <button
            id="btn-sci-pow"
            type="button"
            onClick={() => onInsert('^')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            xʸ
          </button>

          {/* Row 3 */}
          <button
            id="btn-sci-pi"
            type="button"
            onClick={() => onInsert('π')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            π
          </button>

          <button
            id="btn-sci-e"
            type="button"
            onClick={() => onInsert('e')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            e
          </button>

          <button
            id="btn-sci-factorial"
            type="button"
            onClick={() => onInsert('!')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            x!
          </button>

          <button
            id="btn-sci-lparen"
            type="button"
            onClick={() => onInsert('(')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            (
          </button>

          <button
            id="btn-sci-rparen"
            type="button"
            onClick={() => onInsert(')')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            )
          </button>

          {/* Row 4 */}
          <button
            id="btn-sci-reciprocal"
            type="button"
            onClick={() => onInsert('1/(')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            1/x
          </button>

          <button
            id="btn-sci-abs"
            type="button"
            onClick={() => onInsert('abs(')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            |x|
          </button>

          <button
            id="btn-sci-cube"
            type="button"
            onClick={() => onInsert('³')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            x³
          </button>

          <button
            id="btn-sci-cbrt"
            type="button"
            onClick={() => onInsert('cbrt(')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            ∛x
          </button>

          <button
            id="btn-sci-phi"
            type="button"
            onClick={() => onInsert('φ')}
            className="h-10 sm:h-11 rounded-xl text-xs font-semibold bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/50 transition-all active:scale-95 flex items-center justify-center"
          >
            φ
          </button>
        </div>
      )}
    </div>
  );
};
