/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme:{
    extend:{
      colors:{
        primary: 'var(--bg-primary)',
        inputActive: 'var(--text-input-active)',
        numbers: 'var(--bg-numbers)',
        numbersActive: 'var(--bg-numbers-active)',
        textNumbers: 'var(--text-numbers)',
        operators: 'var(--bg-operators)',
        operatorsActive: 'var(--bg-operators-active)',
        textOperators: 'var(--text-operators)',
        equalOperator: 'var(--bg-equal-operator)',
        equalOperatorActive: 'var(--bg-equal-operator-active)',
        textEqualOperator: 'var(--text-equal-operator)',
        clear: 'var(--bg-clear)',
        clearActive: 'var(--bg-clear-active)',
        textClear: 'var(--text-clear)',
      }
    }
  },
  plugins: [],
};
