import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, SafeAreaView, Image } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { evaluateExpression, formatExpression, inputValidation } from '../utils/calculate';
import { useColorScheme } from "nativewind";

export default function Index() {
  const [expression, setExpression] = useState<string>('0');
  const [result, setResult] = useState<string>('0');
  const [calculate, setCalculate] = useState<boolean>(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

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
        'bg-numbers rounded-xl border dark:border-white/15 border-black/20 p-4 flex-1 justify-center items-center active:scale-95 active:bg-numbersActive transition-all',
        buttonStyle
      )}
    >
      <Text className={twMerge('text-4xl text-textNumbers', textStyle)}>
        {value}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className={twMerge('flex-1 p-4 gap-4 bg-primary pt-safe', colorScheme === 'dark' ? 'darkTheme' : 'lightTheme')}>
      <View className='flex-row'>
        <Pressable className='p-4 ml-auto border dark:border-white/15 border-black/20 rounded-xl active:scale-95' onPress={toggleColorScheme}>
          <Text className='text-textNumbers'>{colorScheme}</Text>
        </Pressable>
      </View>
      {/* Display Section */}
      <View className="flex-1 gap-2 justify-end items-end">
        <Text
          className={twMerge(
            "transition-all duration-300 ease-in-out",
            !calculate ? "text-7xl text-inputActive" : "text-5xl text-textNumbers"
          )}
        >
          {formatExpression(expression)}
        </Text>
        {expression !== '0' && (
          <Text
            className={twMerge(
              "transition-all duration-300 ease-in-out",
              calculate ? "text-7xl text-inputActive" : "text-5xl text-textNumbers",
              result === 'Error' ? "text-clear" : ""
            )}
          >
            {"= " + formatExpression(result)}
          </Text>
        )}
      </View>

      <View className="border-b dark:border-white/15 border-black/20" />

      {/* Keypad Section */}
      <View className="flex-3 gap-1 max-h-[70%]">
        {/* Row 1 */}
        <View className="flex-row gap-1">
          {renderButton('AC', 'bg-clear active:bg-clearActive', 'text-textClear text-3xl')}
          {renderButton('DEL', 'bg-operators active:bg-operatorsActive', 'text-textOperators text-3xl')}
          {renderButton('%', 'bg-operators active:bg-operatorsActive', 'text-textOperators')}
          {renderButton('÷', 'bg-operators active:bg-operatorsActive', 'text-textOperators')}
        </View>
        {/* Row 2 */}
        <View className="flex-row gap-1">
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('×', 'bg-operators active:bg-operatorsActive', 'text-textOperators')}
        </View>
        {/* Row 3 */}
        <View className="flex-row gap-1">
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('-', 'bg-operators active:bg-operatorsActive', 'text-textOperators')}
        </View>
        {/* Row 4 */}
        <View className="flex-row gap-1">
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('+', 'bg-operators active:bg-operatorsActive', 'text-textOperators')}
        </View>
        {/* Row 5 */}
        <View className="flex-row gap-1 min-h-fit">
          <View className='flex-1'>
            {renderButton('0', 'rounded-bl-3xl')}
          </View>
          <View className='flex-row gap-1 flex-1 relative'>
            {renderButton('.')}
            {renderButton('=', 'bg-equalOperator active:bg-equalOperatorActive rounded-br-3xl', 'text-textEqualOperator')}
          </View>
        </View>
      </View>
      {/* <Text className='text-center text-green-100/50 text-lg font-light'>
        Calculator by <Link className=' underline' href='https://pranitmane.com'>Pranit</Link>
      </Text> */}
    </SafeAreaView>
  );
}
