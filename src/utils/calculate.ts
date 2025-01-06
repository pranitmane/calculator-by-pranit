import { evaluate } from 'mathjs';

export const formatExpression = (expression: string) => {
  const addComma = (num: string) => {
    if (!num.includes('.')) {
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const [integerPart, decimalPart] = num.split('.');
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + decimalPart;
  };

  const parts = expression.split(/([+\-×÷%])/);
  return parts.map(part => {
    if (/[\d.]+/.test(part)) {
      return addComma(part);
    } else {
      return part;
    }
  }).join('');
};

export const evaluateExpression = (expression: string) => {
  const expressionParser = (expression: string) => {
    return expression
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/%(\d+)?/g, (match, number) => {
        return number ? `/100*${number}` : `/100`;
      })
      .replace(/\b0+(\d+)/g, '$1') // Fix for leading zeros
      .replace(/[^0-9%]$/, ''); // Remove trailing operators
  };
  try {
    const finalExpression = expressionParser(expression);
    const result = evaluate(finalExpression);
    return Number.isFinite(result) ? parseFloat(result.toPrecision(9)).toString() : 'Error';
  } catch {
    return 'Error';
  }
};

export const inputValidation = (prev: string, value: string) => {
  const operators = ['÷', '×', '-', '+', '%'];
  const lastChar = prev.slice(-1);
  const lastNumber = prev.split(/[-+×÷%]/).pop();

  if (prev === '0' && value !== '-' && value !== '.') {
    if (operators.includes(value)) {
      return prev; //prevent starting with operator
    }
    return value;
  }

  if (operators.includes(value) || value === '.') {
    if (operators.includes(lastChar)) {
      if (lastChar === '%') { //allow consecutive percentage
        return prev + value;
      }
      return prev.slice(0, -1) + value;
    }

    if (value === '.' && (lastNumber?.includes('.') || lastChar === '.')) {
      return prev;
    }

    return prev + value;
  }

  return prev + value;
};
