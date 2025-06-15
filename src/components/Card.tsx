import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  className?: string;
  isDealing?: boolean;
}

const Card: React.FC<CardProps> = ({ card, className = '', isDealing = false }) => {
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900';
  };

  if (card.isHidden) {
    return (
      <div className={`
        relative w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-blue-800 to-blue-900 
        rounded-lg shadow-lg border border-blue-600 flex items-center justify-center
        transform transition-all duration-300 ${isDealing ? 'animate-pulse' : ''}
        ${className}
      `}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full opacity-50"></div>
        <div className="absolute inset-2 border border-blue-600 rounded-md opacity-30"></div>
      </div>
    );
  }

  return (
    <div className={`
      relative w-16 h-24 sm:w-20 sm:h-28 bg-white rounded-lg shadow-lg border border-gray-300
      flex flex-col justify-between p-2 sm:p-3 transform transition-all duration-300
      hover:shadow-xl hover:scale-105 ${isDealing ? 'animate-bounce' : ''}
      ${className}
    `}>
      {/* Top rank and suit */}
      <div className={`flex flex-col items-center ${getSuitColor(card.suit)}`}>
        <span className="text-xs sm:text-sm font-bold leading-none">{card.rank}</span>
        <span className="text-lg sm:text-xl leading-none">{getSuitSymbol(card.suit)}</span>
      </div>
      
      {/* Center suit symbol */}
      <div className={`absolute inset-0 flex items-center justify-center ${getSuitColor(card.suit)}`}>
        <span className="text-2xl sm:text-3xl opacity-20">{getSuitSymbol(card.suit)}</span>
      </div>
      
      {/* Bottom rank and suit (rotated) */}
      <div className={`flex flex-col items-center transform rotate-180 ${getSuitColor(card.suit)}`}>
        <span className="text-xs sm:text-sm font-bold leading-none">{card.rank}</span>
        <span className="text-lg sm:text-xl leading-none">{getSuitSymbol(card.suit)}</span>
      </div>
    </div>
  );
};

export default Card;