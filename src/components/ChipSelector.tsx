import React from 'react';

interface ChipSelectorProps {
  onBetSelect: (amount: number) => void;
  currentBet: number;
  balance: number;
  disabled?: boolean;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({ 
  onBetSelect, 
  currentBet, 
  balance, 
  disabled = false 
}) => {
  const chips = [
    { value: 5, color: 'bg-red-500', label: '$5' },
    { value: 10, color: 'bg-blue-500', label: '$10' },
    { value: 25, color: 'bg-green-500', label: '$25' },
    { value: 50, color: 'bg-purple-500', label: '$50' },
    { value: 100, color: 'bg-yellow-500', label: '$100' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => onBetSelect(chip.value)}
          disabled={disabled || balance < chip.value}
          className={`
            relative w-12 h-12 sm:w-14 sm:h-14 rounded-full ${chip.color} 
            text-white font-bold text-xs sm:text-sm shadow-lg border-4 border-white
            transform transition-all duration-200 hover:scale-110 hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            ${currentBet === chip.value ? 'ring-4 ring-yellow-400 scale-110' : ''}
            active:scale-95
          `}
        >
          <div className="absolute inset-1 rounded-full border border-white opacity-30"></div>
          <span className="relative z-10">{chip.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ChipSelector;