import React from 'react';
import { useBlackjack } from './hooks/useBlackjack';
import Card from './components/Card';
import ChipSelector from './components/ChipSelector';
import GameStats from './components/GameStats';
import { Spade } from 'lucide-react';

function App() {
  const [gameState, gameActions] = useBlackjack();

  const getResultMessage = () => {
    switch (gameState.result) {
      case 'win':
        return gameState.playerScore === 21 && gameState.playerHand.length === 2
          ? 'Blackjack! You win!'
          : 'You win!';
      case 'lose':
        return gameState.playerScore > 21 ? 'Bust! You lose!' : 'You lose!';
      case 'push':
        return "It's a push!";
      default:
        return '';
    }
  };

  const getResultColor = () => {
    switch (gameState.result) {
      case 'win':
        return 'text-green-400';
      case 'lose':
        return 'text-red-400';
      case 'push':
        return 'text-yellow-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Spade className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Blackjack
            </h1>
            <Spade className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300 text-lg">Beat the dealer to 21!</p>
        </div>

        {/* Game Stats */}
        <GameStats
          balance={gameState.balance}
          gamesPlayed={gameState.gamesPlayed}
          gamesWon={gameState.gamesWon}
          streak={gameState.streak}
        />

        {/* Game Area */}
        <div className="bg-green-800/30 backdrop-blur-sm rounded-2xl border border-green-700 p-6 md:p-8 mb-6">
          {/* Dealer Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Dealer</h2>
              <div className="text-lg font-bold text-gray-300">
                Score: {gameState.gameStatus === 'finished' || gameState.gameStatus === 'dealer-turn' 
                  ? gameState.dealerScore 
                  : '?'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start min-h-[7rem]">
              {gameState.dealerHand.map((card, index) => (
                <Card
                  key={`dealer-${index}`}
                  card={card}
                  isDealing={gameState.gameStatus === 'dealing'}
                  className="transition-all duration-500 ease-out"
                  style={{ animationDelay: `${index * 200}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Player Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">You</h2>
              <div className="text-lg font-bold text-gray-300">
                Score: {gameState.playerScore}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start min-h-[7rem]">
              {gameState.playerHand.map((card, index) => (
                <Card
                  key={`player-${index}`}
                  card={card}
                  isDealing={gameState.gameStatus === 'dealing'}
                  className="transition-all duration-500 ease-out"
                  style={{ animationDelay: `${(index + gameState.dealerHand.length) * 200}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Result Message */}
          {gameState.result && (
            <div className="text-center mt-6">
              <div className={`text-2xl md:text-3xl font-bold ${getResultColor()} animate-pulse`}>
                {getResultMessage()}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          {gameState.gameStatus === 'waiting' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Place Your Bet</h3>
                <div className="text-gray-300 mb-4">
                  Current Bet: <span className="text-yellow-400 font-bold">${gameState.currentBet}</span>
                </div>
                <ChipSelector
                  onBetSelect={gameActions.placeBet}
                  currentBet={gameState.currentBet}
                  balance={gameState.balance}
                />
              </div>
              <div className="text-center">
                <button
                  onClick={gameActions.dealCards}
                  disabled={gameState.balance < gameState.currentBet}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 
                           disabled:cursor-not-allowed text-white font-bold py-3 px-8 
                           rounded-lg text-lg transform transition-all duration-200 
                           hover:scale-105 active:scale-95 shadow-lg"
                >
                  Deal Cards
                </button>
              </div>
            </div>
          )}

          {gameState.gameStatus === 'playing' && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={gameActions.hit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold 
                         py-3 px-6 rounded-lg transform transition-all duration-200 
                         hover:scale-105 active:scale-95 shadow-lg"
              >
                Hit
              </button>
              <button
                onClick={gameActions.stand}
                className="bg-red-500 hover:bg-red-600 text-white font-bold 
                         py-3 px-6 rounded-lg transform transition-all duration-200 
                         hover:scale-105 active:scale-95 shadow-lg"
              >
                Stand
              </button>
              {gameState.playerHand.length === 2 && gameState.balance >= gameState.currentBet && (
                <button
                  onClick={gameActions.doubleDown}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold 
                           py-3 px-6 rounded-lg transform transition-all duration-200 
                           hover:scale-105 active:scale-95 shadow-lg"
                >
                  Double Down
                </button>
              )}
            </div>
          )}

          {(gameState.gameStatus === 'dealer-turn' || gameState.gameStatus === 'finished') && 
           gameState.gameStatus !== 'waiting' && (
            <div className="text-center">
              <button
                onClick={gameActions.resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold 
                         py-3 px-8 rounded-lg text-lg transform transition-all duration-200 
                         hover:scale-105 active:scale-95 shadow-lg"
              >
                New Game
              </button>
            </div>
          )}

          {gameState.balance === 0 && (
            <div className="text-center mt-4">
              <div className="text-red-400 font-bold mb-4">Game Over - No more chips!</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold 
                         py-3 px-8 rounded-lg transform transition-all duration-200 
                         hover:scale-105 active:scale-95 shadow-lg"
              >
                Restart with $1000
              </button>
            </div>
          )}
        </div>

        {/* Game Rules */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Get as close to 21 as possible without going over. Dealer stands on 17.</p>
          <p>Blackjack pays 3:2. Face cards are worth 10. Aces are 1 or 11.</p>
        </div>
      </div>
    </div>
  );
}

export default App;