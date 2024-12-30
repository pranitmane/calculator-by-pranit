import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { twMerge } from 'tailwind-merge';

export default function Index() {
  const [input, setInput] = useState<string>('');
  const height = StatusBar.currentHeight;
  const paddingTop = "pt-[" + `${height ? height : 25}` + "px]";
  const handlePress = (value: string) => {
    if (value === 'AC') {
      setInput(''); // Clear input
    } else if (value === 'DEL') {
      setInput((prev) => prev.slice(0, -1)); // Delete last character
    } else if (value === '=') {
      if (input.trim() === '') {
        // Do nothing if input is empty
      } else {
        try {
          // Handle leading zeros and operators properly
          const sanitizedInput = input
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/%/g, '/100')
            .replace(/\b0+(\d+)/g, '$1'); // Fix for leading zeros

          const result = Function(`'use strict'; return (${sanitizedInput})`)();
          setInput(Number.isFinite(result) ? result.toString() : 'Error');
        } catch (e) {
          setInput('Error'); // Handle invalid input cases
        }
      }
    } else {
      setInput((prev) => prev + value); // Append value
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
      <View className="flex-1 bg-gray-900 rounded-b-3xl p-4 justify-end items-end">
        <Text className="text-8xl text-gray-300 ">{input || '0'}</Text>
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