import { AngleMode, NumberFormatMode } from '../types';

// Factorial calculation with safety bounds
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer');
  }
  if (n > 170) {
    return Infinity;
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Clean small floating point errors (e.g. 0.1 + 0.2 -> 0.3)
export function sanitizeFloat(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return value;
  // Round extremely small values to 0 (e.g. cos(90 deg) -> 6.12e-17 -> 0)
  if (Math.abs(value) < 1e-15) return 0;
  const str = value.toPrecision(14);
  return parseFloat(str);
}

// Convert degrees to radians if needed
function toRad(angle: number, mode: AngleMode): number {
  return mode === 'DEG' ? (angle * Math.PI) / 180 : angle;
}

// Convert radians to degrees if needed
function fromRad(angle: number, mode: AngleMode): number {
  return mode === 'DEG' ? (angle * 180) / Math.PI : angle;
}

export function formatResult(value: number, formatMode: NumberFormatMode = 'NORMAL', precision = 8): string {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

  const cleaned = sanitizeFloat(value);

  if (formatMode === 'SCI') {
    return cleaned.toExponential(precision > 10 ? 6 : Math.max(2, precision - 2));
  }

  if (formatMode === 'ENG') {
    const exp = Math.floor(Math.log10(Math.abs(cleaned || 1)));
    const engExp = Math.floor(exp / 3) * 3;
    const mantissa = cleaned / Math.pow(10, engExp);
    return `${mantissa.toFixed(4)}e${engExp >= 0 ? '+' : ''}${engExp}`;
  }

  // Normal mode
  const abs = Math.abs(cleaned);
  if (abs > 0 && (abs >= 1e12 || abs <= 1e-7)) {
    return cleaned.toExponential(6);
  }

  // Format with standard locale string if practical, avoiding floating noise
  const parts = cleaned.toString().split('.');
  const intPart = parseInt(parts[0], 10).toLocaleString('en-US');
  if (parts.length > 1) {
    let decPart = parts[1];
    if (decPart.length > precision) {
      decPart = cleaned.toFixed(precision).split('.')[1] || '';
      decPart = decPart.replace(/0+$/, '');
    }
    return decPart.length > 0 ? `${intPart}.${decPart}` : intPart;
  }
  return intPart;
}

// Token types for Shunting Yard Parser
type TokenType = 'NUMBER' | 'OP' | 'FUNC' | 'LPAREN' | 'RPAREN' | 'POSTFIX';

interface Token {
  type: TokenType;
  value: string;
  args?: number;
}

const CONSTANTS: Record<string, number> = {
  'π': Math.PI,
  'pi': Math.PI,
  'PI': Math.PI,
  'e': Math.E,
  'E': Math.E,
  'φ': 1.618033988749895, // Golden ratio
};

// Operator Precedence and Associativity
const OPERATORS: Record<string, { precedence: number; rightAssoc?: boolean; args: number }> = {
  '+': { precedence: 1, args: 2 },
  '-': { precedence: 1, args: 2 },
  '×': { precedence: 2, args: 2 },
  '*': { precedence: 2, args: 2 },
  '÷': { precedence: 2, args: 2 },
  '/': { precedence: 2, args: 2 },
  '%': { precedence: 2, args: 2 },
  'mod': { precedence: 2, args: 2 },
  '^': { precedence: 3, rightAssoc: true, args: 2 },
  'UNARY_MINUS': { precedence: 4, rightAssoc: true, args: 1 },
  '!': { precedence: 5, args: 1 }, // Postfix factorial
  '²': { precedence: 5, args: 1 }, // Postfix square
  '³': { precedence: 5, args: 1 }, // Postfix cube
};

// Tokenizer
export function tokenize(rawExpr: string): Token[] {
  let expr = rawExpr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/,/g, '')
    .trim();

  const tokens: Token[] = [];
  let i = 0;

  const isAlpha = (ch: string) => /[a-zA-Zπφ√∛]/.test(ch);
  const isDigit = (ch: string) => /[0-9.]/.test(ch);

  while (i < expr.length) {
    const ch = expr[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Numbers
    if (isDigit(ch)) {
      let numStr = '';
      while (i < expr.length && (isDigit(expr[i]) || expr[i] === 'e' || expr[i] === 'E')) {
        // Handle scientific notation in number like 1.2e+5
        if ((expr[i] === 'e' || expr[i] === 'E') && i + 1 < expr.length && (expr[i + 1] === '+' || expr[i + 1] === '-')) {
          numStr += expr[i] + expr[i + 1];
          i += 2;
          continue;
        }
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Special root symbols
    if (ch === '√' || ch === '∛') {
      tokens.push({ type: 'FUNC', value: ch === '√' ? 'sqrt' : 'cbrt' });
      i++;
      continue;
    }

    // Constants: π, φ
    if (ch === 'π' || ch === 'φ') {
      tokens.push({ type: 'NUMBER', value: CONSTANTS[ch].toString() });
      i++;
      continue;
    }

    // Postfix square and cube
    if (ch === '²' || ch === '³') {
      tokens.push({ type: 'POSTFIX', value: ch });
      i++;
      continue;
    }

    // Identifiers (functions, constants, mod)
    if (isAlpha(ch)) {
      let id = '';
      while (i < expr.length && isAlpha(expr[i])) {
        id += expr[i];
        i++;
      }

      if (id in CONSTANTS) {
        tokens.push({ type: 'NUMBER', value: CONSTANTS[id].toString() });
      } else if (id === 'mod') {
        tokens.push({ type: 'OP', value: 'mod' });
      } else {
        // Function name like sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, ln, log, log2, sqrt, cbrt, abs, exp
        tokens.push({ type: 'FUNC', value: id.toLowerCase() });
      }
      continue;
    }

    // Factorial
    if (ch === '!') {
      tokens.push({ type: 'POSTFIX', value: '!' });
      i++;
      continue;
    }

    // Left Paren
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    // Right Paren
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Operators: +, -, *, /, %, ^
    if (['+', '-', '*', '/', '%', '^'].includes(ch)) {
      // Check for unary minus: if at start or previous token is an operator or LPAREN
      if (ch === '-') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'OP' || prev.type === 'LPAREN' || prev.type === 'FUNC') {
          tokens.push({ type: 'OP', value: 'UNARY_MINUS' });
          i++;
          continue;
        }
      }
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    // Unknown char, advance
    i++;
  }

  // Inject implicit multiplication:
  // e.g. NUMBER ( -> NUMBER * (
  // ) NUMBER -> ) * NUMBER
  // ) ( -> ) * (
  // NUMBER FUNC -> NUMBER * FUNC
  // ) FUNC -> ) * FUNC
  // POSTFIX NUMBER -> POSTFIX * NUMBER
  const withImplicitMul: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const curr = tokens[idx];
    const next = tokens[idx + 1];

    withImplicitMul.push(curr);

    if (next) {
      const isCurrMultiplier =
        curr.type === 'NUMBER' ||
        curr.type === 'RPAREN' ||
        curr.type === 'POSTFIX';

      const isNextMultiplicand =
        next.type === 'LPAREN' ||
        next.type === 'FUNC' ||
        (next.type === 'NUMBER' && curr.type === 'RPAREN') ||
        (next.type === 'NUMBER' && curr.type === 'POSTFIX');

      if (isCurrMultiplier && isNextMultiplicand) {
        withImplicitMul.push({ type: 'OP', value: '*' });
      }
    }
  }

  return withImplicitMul;
}

// Convert Infix tokens to RPN using Shunting-Yard
function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'POSTFIX') {
      output.push(token);
    } else if (token.type === 'FUNC') {
      opStack.push(token);
    } else if (token.type === 'OP') {
      const o1 = token;
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top.type === 'FUNC') {
          output.push(opStack.pop()!);
          continue;
        }
        if (top.type === 'OP') {
          const o2 = top;
          const o1Info = OPERATORS[o1.value];
          const o2Info = OPERATORS[o2.value];

          if (!o1Info || !o2Info) break;

          if (
            (!o1Info.rightAssoc && o1Info.precedence <= o2Info.precedence) ||
            (o1Info.rightAssoc && o1Info.precedence < o2Info.precedence)
          ) {
            output.push(opStack.pop()!);
            continue;
          }
        }
        break;
      }
      opStack.push(o1);
    } else if (token.type === 'LPAREN') {
      opStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
        output.push(opStack.pop()!);
      }
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'LPAREN') {
        opStack.pop(); // Pop '('
      }
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNC') {
        output.push(opStack.pop()!);
      }
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop()!;
    if (op.type !== 'LPAREN' && op.type !== 'RPAREN') {
      output.push(op);
    }
  }

  return output;
}

// Evaluate RPN Tokens
function evaluateRPN(rpn: Token[], angleMode: AngleMode): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const num = parseFloat(token.value);
      if (Number.isNaN(num)) throw new Error('Invalid number');
      stack.push(num);
    } else if (token.type === 'POSTFIX') {
      if (stack.length < 1) throw new Error('Invalid expression');
      const val = stack.pop()!;
      if (token.value === '!') {
        stack.push(factorial(val));
      } else if (token.value === '²') {
        stack.push(val * val);
      } else if (token.value === '³') {
        stack.push(val * val * val);
      }
    } else if (token.type === 'OP') {
      if (token.value === 'UNARY_MINUS') {
        if (stack.length < 1) throw new Error('Invalid expression');
        stack.push(-stack.pop()!);
        continue;
      }

      if (stack.length < 2) throw new Error('Invalid expression');
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by zero');
          stack.push(a / b);
          break;
        case '%':
        case 'mod':
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator ${token.value}`);
      }
    } else if (token.type === 'FUNC') {
      if (stack.length < 1) throw new Error('Invalid function call');
      const arg = stack.pop()!;
      const fn = token.value;

      switch (fn) {
        case 'sin': {
          const rad = toRad(arg, angleMode);
          // Precise checks for DEG mode clean integers
          if (angleMode === 'DEG' && arg % 180 === 0) {
            stack.push(0);
          } else if (angleMode === 'DEG' && (arg - 90) % 360 === 0) {
            stack.push(1);
          } else if (angleMode === 'DEG' && (arg - 270) % 360 === 0) {
            stack.push(-1);
          } else {
            stack.push(Math.sin(rad));
          }
          break;
        }
        case 'cos': {
          const rad = toRad(arg, angleMode);
          if (angleMode === 'DEG' && (arg - 90) % 180 === 0) {
            stack.push(0);
          } else if (angleMode === 'DEG' && arg % 360 === 0) {
            stack.push(1);
          } else if (angleMode === 'DEG' && (arg - 180) % 360 === 0) {
            stack.push(-1);
          } else {
            stack.push(Math.cos(rad));
          }
          break;
        }
        case 'tan': {
          if (angleMode === 'DEG' && (arg - 90) % 180 === 0) {
            throw new Error('Undefined (tan 90°)');
          }
          if (angleMode === 'DEG' && arg % 180 === 0) {
            stack.push(0);
          } else {
            stack.push(Math.tan(toRad(arg, angleMode)));
          }
          break;
        }
        case 'asin':
        case 'sin⁻¹':
        case 'arcsin': {
          if (arg < -1 || arg > 1) throw new Error('Domain error: asin [-1, 1]');
          stack.push(fromRad(Math.asin(arg), angleMode));
          break;
        }
        case 'acos':
        case 'cos⁻¹':
        case 'arccos': {
          if (arg < -1 || arg > 1) throw new Error('Domain error: acos [-1, 1]');
          stack.push(fromRad(Math.acos(arg), angleMode));
          break;
        }
        case 'atan':
        case 'tan⁻¹':
        case 'arctan': {
          stack.push(fromRad(Math.atan(arg), angleMode));
          break;
        }
        case 'sinh':
          stack.push(Math.sinh(arg));
          break;
        case 'cosh':
          stack.push(Math.cosh(arg));
          break;
        case 'tanh':
          stack.push(Math.tanh(arg));
          break;
        case 'asinh':
          stack.push(Math.asinh(arg));
          break;
        case 'acosh':
          if (arg < 1) throw new Error('Domain error: acosh [1, ∞)');
          stack.push(Math.acosh(arg));
          break;
        case 'atanh':
          if (arg <= -1 || arg >= 1) throw new Error('Domain error: atanh (-1, 1)');
          stack.push(Math.atanh(arg));
          break;
        case 'ln':
          if (arg <= 0) throw new Error('Domain error: ln (0, ∞)');
          stack.push(Math.log(arg));
          break;
        case 'log':
        case 'log10':
          if (arg <= 0) throw new Error('Domain error: log (0, ∞)');
          stack.push(Math.log10(arg));
          break;
        case 'log2':
          if (arg <= 0) throw new Error('Domain error: log2 (0, ∞)');
          stack.push(Math.log2(arg));
          break;
        case 'sqrt':
          if (arg < 0) throw new Error('Cannot root negative number');
          stack.push(Math.sqrt(arg));
          break;
        case 'cbrt':
          stack.push(Math.cbrt(arg));
          break;
        case 'abs':
          stack.push(Math.abs(arg));
          break;
        case 'exp':
          stack.push(Math.exp(arg));
          break;
        default:
          throw new Error(`Unknown function: ${fn}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid calculation');
  }

  return stack[0];
}

// Auto-balance open parentheses for live preview
function autoBalanceParentheses(expr: string): string {
  let openCount = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '(') openCount++;
    if (expr[i] === ')') openCount--;
  }
  if (openCount > 0) {
    return expr + ')'.repeat(openCount);
  }
  return expr;
}

// Main evaluation function
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { result: number | null; error: string | null } {
  if (!expr || !expr.trim()) return { result: null, error: null };

  try {
    const balanced = autoBalanceParentheses(expr);
    const tokens = tokenize(balanced);
    if (tokens.length === 0) return { result: null, error: null };

    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn, angleMode);

    if (Number.isNaN(result)) {
      return { result: null, error: 'Calculation error' };
    }

    return { result: sanitizeFloat(result), error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return { result: null, error: message };
  }
}
