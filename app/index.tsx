import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { evaluate } from 'mathjs';

export default function Index() {
  const [expression, setExpression] = useState<string>('0');
  const [result, setResult] = useState<string>('0');

  const height = StatusBar.currentHeight;
  const paddingTop = "pt-[" + `${height ? height : 25}` + "px]";

  useEffect(() => {
    setResult(() => {
      return evaluateExpression(sanitizeexpression(expression));
    })
  }, [expression]);

  const handlePress = (value: string) => {
    switch (value) {
      case 'AC':
        setExpression('0'); // Clear expression
        setResult('0'); // Clear result
        break;

      case 'DEL':
        setExpression((prev) => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;

      case '=':
        if (expression.trim()) {
          setResult(() => {
            return evaluateExpression(expression);
          });
        }
        break;

      default:
        if (['÷', '×', '-', '+', '%', '.'].includes(value)) {
          if (['÷', '×', '-', '+', '.'].includes(expression.slice(-1))) {
            return;
          }
        }
        setExpression((prev) => {
          if (prev === '0' && ((value !== '-') && (value !== '.'))) {
            return value;
          }
          else {
            return prev + value;
          }
        });
        break;
    }
  };


  const renderButton = (value: string, additionalClasses: string = '') => (
    <Pressable
      onPress={() => handlePress(value)}
      className={twMerge(
        'bg-gray-900 rounded-2xl p-4 flex-1 justify-center items-center active:scale-95 active:bg-gray-900/70 transition-all',
        additionalClasses
      )}
    >
      <Text className={twMerge('text-4xl text-gray-300')}>
        {value}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className={twMerge('flex-1 bg-gray-950', paddingTop)}>
      {/* Display Section */}
      <View className="flex-1 gap-2 bg-gray-900 rounded-b-3xl p-4 justify-end items-end">
        {
          expression === '0' ? (
            <Text className="text-7xl text-gray-300">
              {formatNumber(expression) || '0'}
            </Text>
          ) : (
            <Text className="text-5xl text-gray-500">
              {formatNumber(expression)}
            </Text>
          )
        }
        {
          expression === '0' ? null : (
            <Text className="text-7xl text-gray-300">
              {"= " + formatNumber(result)}
            </Text>
          )
        }
      </View>

      {/* Keypad Section */}
      <View className="flex-3 gap-2 p-4 max-h-[70%]">
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


const formatNumber = (num: string) => {
  if (!num.includes('.')) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [integerPart, decimalPart] = num.split('.');
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + decimalPart;
};

const sanitizeexpression = (expression: string) => {
  return expression
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/%(\d+)?/g, (match, number) => {
      return number ? `/100*${number}` : `/100`;
    })
    .replace(/\b0+(\d+)/g, '$1') // Fix for leading zeros
    .replace(/[^0-9%]$/, ''); // Remove trailing operators
};

const evaluateExpression = (expression: string) => {
  try {
    const result = evaluate(sanitizeexpression(expression));
    return Number.isFinite(result) ? parseFloat(result.toPrecision(9)).toString() : 'Error';
  } catch {
    return 'Error';
  }
};
