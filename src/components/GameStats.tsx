import React from 'react';
import { Trophy, Target, DollarSign, TrendingUp } from 'lucide-react';

interface GameStatsProps {
  balance: number;
  gamesPlayed: number;
  gamesWon: number;
  streak: number;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  balance, 
  gamesPlayed, 
  gamesWon, 
  streak 
}) => {
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  const stats = [
    {
      icon: DollarSign,
      label: 'Balance',
      value: `$${balance}`,
      color: 'text-green-400',
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${winRate}%`,
      color: 'text-blue-400',
    },
    {
      icon: Trophy,
      label: 'Games Won',
      value: `${gamesWon}/${gamesPlayed}`,
      color: 'text-yellow-400',
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: streak > 0 ? `+${streak}` : `${streak}`,
      color: streak > 0 ? 'text-green-400' : 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-gray-300 text-xs">{stat.label}</span>
          </div>
          <div className={`text-lg font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameStats;