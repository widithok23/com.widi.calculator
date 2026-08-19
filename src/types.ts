export type AngleMode = 'DEG' | 'RAD';

export type NumberFormatMode = 'NORMAL' | 'SCI' | 'ENG';

export type ThemeAccent = 'amber' | 'cyan' | 'emerald' | 'coral' | 'violet';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  angleMode: AngleMode;
}

export interface CalculatorSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  precision: number;
  formatMode: NumberFormatMode;
  accent: ThemeAccent;
}

export interface KeyButtonConfig {
  id: string;
  label: string;
  secondaryLabel?: string;
  action: () => void;
  type?: 'number' | 'operator' | 'function' | 'action' | 'equals' | 'scientific';
  ariaLabel?: string;
  badge?: string;
  span?: number;
  highlight?: boolean;
}
