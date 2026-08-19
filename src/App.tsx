import { useState, useEffect, useCallback } from 'react';
import { AngleMode, CalculatorSettings, HistoryItem } from './types';
import { evaluateExpression, formatResult } from './utils/mathEngine';
import { playKeySound, triggerHaptic } from './utils/audio';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { DisplayScreen } from './components/DisplayScreen';
import { MemoryBar } from './components/MemoryBar';
import { ScientificPad } from './components/ScientificPad';
import { BasicKeypad } from './components/BasicKeypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_SETTINGS: CalculatorSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  precision: 8,
  formatMode: 'NORMAL',
  accent: 'amber',
};

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [isScientificExpanded, setIsScientificExpanded] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('android_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<CalculatorSettings>(() => {
    try {
      const saved = localStorage.getItem('android_calc_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2000);
  }, []);

  // Save history and settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('android_calc_history', JSON.stringify(history.slice(0, 50)));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('android_calc_settings', JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Tactile feedback helper
  const feedback = useCallback(
    (type: 'number' | 'operator' | 'action' | 'equals' = 'number') => {
      if (settings.soundEnabled) {
        playKeySound(type);
      }
      if (settings.hapticsEnabled) {
        triggerHaptic(type === 'equals' ? 20 : 10);
      }
    },
    [settings.soundEnabled, settings.hapticsEnabled]
  );

  // Compute live preview evaluation
  let previewResult: string | null = null;
  let hasError = false;

  if (expression.trim().length > 0) {
    const { result, error } = evaluateExpression(expression, angleMode);
    if (result !== null && !Number.isNaN(result)) {
      previewResult = formatResult(result, settings.formatMode, settings.precision);
    } else if (error && expression.length > 3) {
      // Only flag syntax error if string looks like an attempt at evaluation
      hasError = false;
    }
  }

  // Insert character or function
  const handleInsert = useCallback(
    (val: string) => {
      feedback(
        ['+', '-', '×', '÷', '*', '/', '%', '^'].includes(val)
          ? 'operator'
          : 'number'
      );

      setExpression((prev) => {
        // Prevent consecutive double operators like ++ or ×÷
        const operators = ['+', '-', '×', '÷', '%', '^'];
        if (operators.includes(val)) {
          if (prev.length === 0) {
            if (val === '-') return '-';
            return '0' + val;
          }
          const lastChar = prev.slice(-1);
          if (operators.includes(lastChar)) {
            // Replace previous operator unless it's a negative sign after an operator
            if (val === '-' && lastChar !== '-') {
              return prev + val;
            }
            return prev.slice(0, -1) + val;
          }
        }

        // Prevent multiple decimal points in current number token
        if (val === '.') {
          const parts = prev.split(/[+\-×÷*/%^()]/);
          const lastPart = parts[parts.length - 1];
          if (lastPart.includes('.')) {
            return prev;
          }
          if (lastPart === '') {
            return prev + '0.';
          }
        }

        return prev + val;
      });
    },
    [feedback]
  );

  // Clear expression
  const handleClear = useCallback(() => {
    feedback('action');
    setExpression('');
  }, [feedback]);

  // Backspace
  const handleBackspace = useCallback(() => {
    feedback('action');
    setExpression((prev) => {
      if (!prev) return '';
      // Check if ending with a function like "sqrt(" or "sin("
      const funcMatch = prev.match(/(asin|acos|atan|sinh|cosh|tanh|cbrt|sqrt|exp|abs|sin|cos|tan|log|log2|ln)\($/);
      if (funcMatch) {
        return prev.slice(0, -funcMatch[0].length);
      }
      return prev.slice(0, -1);
    });
  }, [feedback]);

  // Smart Parentheses toggle
  const handleParentheses = useCallback(() => {
    feedback('operator');
    setExpression((prev) => {
      if (!prev) return '(';
      let openCount = 0;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] === '(') openCount++;
        if (prev[i] === ')') openCount--;
      }
      const lastChar = prev.slice(-1);
      if (openCount > 0 && /[0-9πeφ²³!)%]/.test(lastChar)) {
        return prev + ')';
      }
      if (/[0-9πeφ²³!)%]/.test(lastChar)) {
        return prev + '×(';
      }
      return prev + '(';
    });
  }, [feedback]);

  // Sign toggle (+/-)
  const handleToggleSign = useCallback(() => {
    feedback('action');
    setExpression((prev) => {
      if (!prev) return '-';
      // Find the last number token
      const match = prev.match(/(-?\d+\.?\d*)$/);
      if (match) {
        const num = match[0];
        const index = match.index!;
        if (num.startsWith('-')) {
          return prev.slice(0, index) + num.slice(1);
        } else {
          return prev.slice(0, index) + `(-${num})`;
        }
      }
      return prev.startsWith('-(') && prev.endsWith(')')
        ? prev.slice(2, -1)
        : `-(${prev})`;
    });
  }, [feedback]);

  // Calculate Result (=)
  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;

    feedback('equals');
    const { result, error } = evaluateExpression(expression, angleMode);

    if (result !== null && !Number.isNaN(result)) {
      const formatted = formatResult(result, settings.formatMode, settings.precision);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: formatted,
        timestamp: Date.now(),
        angleMode,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
      setExpression(formatted);
    } else {
      showToast(error || 'Invalid calculation');
    }
  }, [expression, angleMode, settings.formatMode, settings.precision, feedback, showToast]);

  // Memory functions
  const handleClearMemory = useCallback(() => {
    feedback('action');
    setMemoryValue(0);
    showToast('Memory Cleared');
  }, [feedback, showToast]);

  const handleRecallMemory = useCallback(() => {
    feedback('action');
    if (memoryValue !== 0) {
      setExpression((prev) => prev + memoryValue.toString());
    }
  }, [memoryValue, feedback]);

  const handleAddToMemory = useCallback(() => {
    feedback('action');
    const { result } = evaluateExpression(expression || '0', angleMode);
    if (result !== null) {
      setMemoryValue((prev) => prev + result);
      showToast(`Added to M: ${result}`);
    }
  }, [expression, angleMode, feedback, showToast]);

  const handleSubtractFromMemory = useCallback(() => {
    feedback('action');
    const { result } = evaluateExpression(expression || '0', angleMode);
    if (result !== null) {
      setMemoryValue((prev) => prev - result);
      showToast(`Subtracted from M: ${result}`);
    }
  }, [expression, angleMode, feedback, showToast]);

  const handleStoreMemory = useCallback(() => {
    feedback('action');
    const { result } = evaluateExpression(expression || '0', angleMode);
    if (result !== null) {
      setMemoryValue(result);
      showToast(`Stored in M: ${result}`);
    }
  }, [expression, angleMode, feedback, showToast]);

  // Toggle Angle mode DEG/RAD
  const handleToggleAngleMode = useCallback(() => {
    feedback('action');
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  }, [feedback]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHistoryOpen || isSettingsOpen) return;

      // Numbers & basic keys
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(e.key)) {
        e.preventDefault();
        handleInsert(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleInsert('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleInsert('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleInsert('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInsert('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleInsert('%');
      } else if (e.key === '^') {
        e.preventDefault();
        handleInsert('^');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInsert(e.key);
      } else if (e.key === '!' ) {
        e.preventDefault();
        handleInsert('!');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleInsert('sin(');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleInsert('cos(');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleInsert('tan(');
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleInsert('ln(');
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handleInsert('π');
      } else if (e.key === 'e') {
        e.preventDefault();
        handleInsert('e');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isHistoryOpen,
    isSettingsOpen,
    handleInsert,
    handleCalculate,
    handleBackspace,
    handleClear,
  ]);

  return (
    <div
      id="calculator-app-root"
      className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center sm:p-4 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Phone Mockup Frame Container */}
      <div
        id="android-phone-frame"
        className="w-full h-screen sm:h-[860px] sm:max-w-[430px] bg-neutral-900 sm:rounded-[44px] sm:border-[6px] sm:border-neutral-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden relative"
      >
        {/* Top Status Bar */}
        <AndroidStatusBar />

        {/* Display Screen */}
        <DisplayScreen
          expression={expression}
          previewResult={previewResult}
          hasError={hasError}
          angleMode={angleMode}
          onToggleAngleMode={handleToggleAngleMode}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onBackspace={handleBackspace}
          onClear={handleClear}
          memoryValue={memoryValue}
          accent={settings.accent}
          historyCount={history.length}
        />

        {/* Memory Bar */}
        <MemoryBar
          memoryValue={memoryValue}
          onClearMemory={handleClearMemory}
          onRecallMemory={handleRecallMemory}
          onAddToMemory={handleAddToMemory}
          onSubtractFromMemory={handleSubtractFromMemory}
          onStoreMemory={handleStoreMemory}
        />

        {/* Scientific Keypad (Collapsible/Expandable) */}
        <ScientificPad
          isExpanded={isScientificExpanded}
          onToggleExpand={() => setIsScientificExpanded(!isScientificExpanded)}
          onInsert={handleInsert}
          angleMode={angleMode}
          onToggleAngleMode={handleToggleAngleMode}
          accent={settings.accent}
        />

        {/* Basic Keypad Grid */}
        <BasicKeypad
          onInsert={handleInsert}
          onClear={handleClear}
          onCalculate={handleCalculate}
          onToggleSign={handleToggleSign}
          onParentheses={handleParentheses}
          accent={settings.accent}
        />

        {/* Android Home Navigation Bar Pill Indicator */}
        <div className="w-full flex justify-center pb-2 pt-1 select-none">
          <div className="w-32 h-1 rounded-full bg-neutral-600/70" />
        </div>

        {/* History Slide Drawer */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onClearHistory={() => {
            setHistory([]);
            showToast('History cleared');
          }}
          onSelectExpression={(expr) => setExpression(expr)}
          onSelectResult={(res) => setExpression((prev) => prev + res)}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        />

        {/* Transient Toast Notification */}
        {toastMessage && (
          <div
            id="app-toast-notification"
            className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-neutral-800/95 border border-neutral-700 text-xs font-medium text-neutral-200 shadow-xl backdrop-blur-xs z-50 animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Hint for Desktop Users */}
      <div className="hidden sm:flex items-center gap-4 mt-3 text-neutral-500 text-xs select-none">
        <span>Keyboard shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">0-9</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">+ - * /</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">Enter</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">s, c, t</kbd></span>
      </div>
    </div>
  );
}
