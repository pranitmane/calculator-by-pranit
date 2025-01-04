import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { evaluate } from 'mathjs';

export default function Index() {
  const [expression, setExpression] = useState<string>('0');
  const [result, setResult] = useState<string>('0');
  const [calculate, setCalculate] = useState<boolean>(false);

  const height = StatusBar.currentHeight;
  const paddingTop = "pt-[" + `${height ? height : 25}` + "px]";

  useEffect(() => {
    setResult(() => {
      return evaluateExpression(expression);
    })
  }, [expression]);

  const handlePress = (value: string) => {
    const operators = ['÷', '×', '-', '+', '%'];
    switch (value) {
      case 'AC':
        setCalculate(false);
        setExpression('0'); // Clear expression
        break;

      case 'DEL':
        setCalculate(false);
        setExpression((prev) => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;

      case '=':
        if (expression.trim() && expression !== '0' && result !== 'Error') {
          setCalculate(true);
        }
        break;

      default:
        if (calculate) {
          if (operators.includes(value)) {
            setCalculate(false);
            setExpression(result + value);
          }
          else {
            setCalculate(false);
            setExpression('0');
            setExpression((prev) => inputValidation(prev, value));
          }
        } else {
          setExpression((prev) => inputValidation(prev, value));
        }
        break;
    }
  };


  const renderButton = (value: string, buttonStyle: string = '', textStyle: string = '') => (
    <Pressable
      onPress={() => handlePress(value)}
      className={twMerge(
        'bg-gray-900 rounded-2xl p-4 flex-1 justify-center items-center active:scale-95 active:bg-gray-900/70 transition-all',
        buttonStyle
      )}
    >
      <Text className={twMerge('text-4xl text-gray-200/70',textStyle)}>
        {value}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className={twMerge('flex-1 bg-gray-950', paddingTop)}>
      {/* Display Section */}
      <View className="flex-1 gap-2 p-4 justify-end items-end">
        <Text
          className={twMerge(
            "transition-all duration-300 ease-in-out",
            !calculate ? "text-7xl text-gray-200/70" : "text-5xl text-gray-400/70"
          )}
        >
          {formatExpression(expression)}
        </Text>
        {expression !== '0' && (
          <Text
            className={twMerge(
              "transition-all duration-300 ease-in-out",
              calculate ? "text-7xl text-gray-200/70" : "text-5xl text-gray-400/70",
              result === 'Error' ? "text-red-500/70" : ""
            )}
          >
            {"= " + formatExpression(result)}
          </Text>
        )}
      </View>


      {/* Keypad Section */}
      <View className="flex-3 border-t border-gray-800 gap-2 p-4 max-h-[70%]">
        {/* Row 1 */}
        <View className="flex-row gap-2">
          {renderButton('AC', 'bg-red-800 active:bg-red-800/70')}
          {renderButton('DEL', 'bg-gray-800 active:bg-gray-800/70')}
          {renderButton('%', 'bg-gray-800 active:bg-gray-800/70')}
          {renderButton('÷', 'bg-gray-800 active:bg-gray-800/70')}
        </View>
        {/* Row 2 */}
        <View className="flex-row gap-2">
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('×', 'bg-gray-800 active:bg-gray-800/70')}
        </View>
        {/* Row 3 */}
        <View className="flex-row gap-2">
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('-', 'bg-gray-800 active:bg-gray-800/70')}
        </View>
        {/* Row 4 */}
        <View className="flex-row gap-2">
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('+', 'bg-gray-800 active:bg-gray-800/70')}
        </View>
        {/* Row 5 */}
        <View className="flex-row gap-2 min-h-fit">
          <View className='flex-1'>
            {renderButton('0')}
          </View>
          <View className='flex-row gap-2 flex-1 relative'>
            {renderButton('.')}
            {renderButton('=', 'bg-green-800 active:bg-green-800/70')}
          </View>
        </View>
        <Text className='text-center text-gray-500 text-lg font-light'>
          Calculator by <Link className=' underline text-sky-500' href='https://pranitmane.com'>Pranit</Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}


const formatExpression = (expression: string) => {
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

const evaluateExpression = (expression: string) => {
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

const inputValidation = (prev: string, value: string) => {
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
