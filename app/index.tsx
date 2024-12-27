import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View, Pressable, SafeAreaView } from 'react-native';
import { twMerge } from 'tailwind-merge';

export default function Index() {
  const [input, setInput] = useState<string>('');

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
        'bg-gray-800 rounded-full flex-1 m-2 justify-center items-center h-16 shadow-md shadow-black active:scale-95 active:bg-gray-700',
        additionalClasses
      )}
    >
      <Text className={twMerge('text-3xl font-semibold text-gray-100')}>
        {value}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 gap-6 bg-gray-950 p-6 pt-14 pb-12">
      {/* Display Section */}
      <View className="flex-1 bg-gray-800 rounded-lg p-4 justify-end items-end shadow-lg shadow-black">
        <Text className="text-gray-200 text-6xl">{input || '0'}</Text>
      </View>

      {/* Keypad Section */}
      <View className="flex-3 mt-6">
        {/* Row 1 */}
        <View className="flex-row">
          {renderButton('AC', 'bg-red-800 active:bg-red-700')}
          {renderButton('%', 'bg-gray-600')}
          {renderButton('DEL', 'bg-yellow-800 active:bg-yellow-700')}
          {renderButton('÷', 'bg-gray-600')}
        </View>
        {/* Row 2 */}
        <View className="flex-row">
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('×', 'bg-gray-600')}
        </View>
        {/* Row 3 */}
        <View className="flex-row">
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('-', 'bg-gray-600')}
        </View>
        {/* Row 4 */}
        <View className="flex-row">
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('+', 'bg-gray-600')}
        </View>
        {/* Row 5 */}
        <View className="flex-row">
          {renderButton('0', 'flex-[2]')}
          {renderButton('.')}
          {renderButton('=', 'bg-green-800 active:bg-green-700')}
        </View>
      </View>
      <View>
        <Text className='text-center text-gray-400 text-lg font-light'>
          Calculator by <Link className=' underline text-sky-400' href='https://pranitmane.com'>Pranit</Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}