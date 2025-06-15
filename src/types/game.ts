export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
  isHidden?: boolean;
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  gameStatus: 'waiting' | 'dealing' | 'playing' | 'dealer-turn' | 'finished';
  result: 'win' | 'lose' | 'push' | null;
  playerScore: number;
  dealerScore: number;
  balance: number;
  currentBet: number;
  streak: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface GameActions {
  dealCards: () => void;
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  placeBet: (amount: number) => void;
  resetGame: () => void;
}