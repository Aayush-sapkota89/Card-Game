import { useState, useCallback } from 'react';
import { Card, GameState, GameActions } from '../types/game';

const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      let value = parseInt(rank);
      if (isNaN(value)) {
        value = rank === 'A' ? 11 : 10;
      }
      deck.push({ suit, rank, value });
    }
  }

  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateScore = (hand: Card[]): number => {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.isHidden) continue;
    
    if (card.rank === 'A') {
      aces++;
      score += 11;
    } else {
      score += card.value;
    }
  }

  // Adjust for aces
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};

const initialState: GameState = {
  playerHand: [],
  dealerHand: [],
  deck: createDeck(),
  gameStatus: 'waiting',
  result: null,
  playerScore: 0,
  dealerScore: 0,
  balance: 1000,
  currentBet: 10,
  streak: 0,
  gamesPlayed: 0,
  gamesWon: 0,
};

export const useBlackjack = (): [GameState, GameActions] => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const dealCards = useCallback(() => {
    if (gameState.balance < gameState.currentBet) return;

    const newDeck = gameState.deck.length < 20 ? createDeck() : [...gameState.deck];
    const playerHand: Card[] = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand: Card[] = [
      newDeck.pop()!,
      { ...newDeck.pop()!, isHidden: true }
    ];

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore([dealerHand[0]]);

    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: newDeck,
      gameStatus: playerScore === 21 ? 'dealer-turn' : 'playing',
      playerScore,
      dealerScore,
      balance: prev.balance - prev.currentBet,
    }));

    // Auto-handle blackjack
    if (playerScore === 21) {
      setTimeout(() => {
        setGameState(prev => {
          const revealedDealerHand = prev.dealerHand.map(card => ({ ...card, isHidden: false }));
          const finalDealerScore = calculateScore(revealedDealerHand);
          
          let result: 'win' | 'lose' | 'push';
          let payout = 0;

          if (finalDealerScore === 21) {
            result = 'push';
            payout = prev.currentBet;
          } else {
            result = 'win';
            payout = prev.currentBet * 2.5; // Blackjack pays 3:2
          }

          return {
            ...prev,
            dealerHand: revealedDealerHand,
            dealerScore: finalDealerScore,
            gameStatus: 'finished',
            result,
            balance: prev.balance + payout,
            streak: result === 'win' ? prev.streak + 1 : 0,
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: result === 'win' ? prev.gamesWon + 1 : prev.gamesWon,
          };
        });
      }, 1000);
    }
  }, [gameState.deck, gameState.balance, gameState.currentBet]);

  const hit = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;

    const newDeck = [...gameState.deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...gameState.playerHand, newCard];
    const newScore = calculateScore(newPlayerHand);

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      deck: newDeck,
      playerScore: newScore,
      gameStatus: newScore > 21 ? 'finished' : 'playing',
      result: newScore > 21 ? 'lose' : null,
      streak: newScore > 21 ? 0 : prev.streak,
      gamesPlayed: newScore > 21 ? prev.gamesPlayed + 1 : prev.gamesPlayed,
    }));
  }, [gameState.gameStatus, gameState.deck, gameState.playerHand]);

  const stand = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prev => ({ ...prev, gameStatus: 'dealer-turn' }));

    // Dealer AI
    setTimeout(() => {
      setGameState(prev => {
        let dealerHand = prev.dealerHand.map(card => ({ ...card, isHidden: false }));
        let dealerScore = calculateScore(dealerHand);
        const newDeck = [...prev.deck];

        // Dealer hits on soft 17
        while (dealerScore < 17) {
          const newCard = newDeck.pop()!;
          dealerHand.push(newCard);
          dealerScore = calculateScore(dealerHand);
        }

        let result: 'win' | 'lose' | 'push';
        let payout = 0;

        if (dealerScore > 21) {
          result = 'win';
          payout = prev.currentBet * 2;
        } else if (prev.playerScore > dealerScore) {
          result = 'win';
          payout = prev.currentBet * 2;
        } else if (prev.playerScore < dealerScore) {
          result = 'lose';
          payout = 0;
        } else {
          result = 'push';
          payout = prev.currentBet;
        }

        return {
          ...prev,
          dealerHand,
          dealerScore,
          deck: newDeck,
          gameStatus: 'finished',
          result,
          balance: prev.balance + payout,
          streak: result === 'win' ? prev.streak + 1 : result === 'lose' ? 0 : prev.streak,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: result === 'win' ? prev.gamesWon + 1 : prev.gamesWon,
        };
      });
    }, 1000);
  }, [gameState.gameStatus]);

  const doubleDown = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || gameState.balance < gameState.currentBet) return;

    const newDeck = [...gameState.deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...gameState.playerHand, newCard];
    const newScore = calculateScore(newPlayerHand);

    setGameState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      deck: newDeck,
      playerScore: newScore,
      balance: prev.balance - prev.currentBet,
      currentBet: prev.currentBet * 2,
      gameStatus: newScore > 21 ? 'finished' : 'dealer-turn',
      result: newScore > 21 ? 'lose' : null,
      streak: newScore > 21 ? 0 : prev.streak,
      gamesPlayed: newScore > 21 ? prev.gamesPlayed + 1 : prev.gamesPlayed,
    }));

    if (newScore <= 21) {
      // Auto-stand after double down
      setTimeout(() => stand(), 500);
    }
  }, [gameState.gameStatus, gameState.deck, gameState.playerHand, gameState.balance, gameState.currentBet, stand]);

  const placeBet = useCallback((amount: number) => {
    if (gameState.gameStatus === 'waiting' && gameState.balance >= amount) {
      setGameState(prev => ({ ...prev, currentBet: amount }));
    }
  }, [gameState.gameStatus, gameState.balance]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      gameStatus: 'waiting',
      result: null,
      playerScore: 0,
      dealerScore: 0,
    }));
  }, []);

  const gameActions: GameActions = {
    dealCards,
    hit,
    stand,
    doubleDown,
    placeBet,
    resetGame,
  };

  return [gameState, gameActions];
};