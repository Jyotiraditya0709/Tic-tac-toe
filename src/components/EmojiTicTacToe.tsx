import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent } from '@/components/ui/basic-components';
import CategorySelector from './CategorySelector';
import GameBoard from './GameBoard';
import PlayerInfo from './PlayerInfo';
import { useSoundEffects } from '../hooks/useSoundEffects';

export interface EmojiCategories {
  Animals: string[];
  Food: string[];
  Custom: string[];
}

export interface Player {
  id: 1 | 2;
  category: keyof EmojiCategories | null;
  customEmojis: string[];
  placedEmojis: Array<{ emoji: string; position: number; timestamp: number }>;
}

export interface Cell {
  emoji: string | null;
  player: 1 | 2 | null;
  cannotPlaceHere: boolean;
}

const EMOJI_CATEGORIES: EmojiCategories = {
  Animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🐦'],
  Food: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🥨', '🍕', '🍔', '🌮'],
  Custom: []
};

const EmojiTicTacToe = () => {
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [board, setBoard] = useState<Cell[]>(
    Array(9).fill(null).map(() => ({ emoji: null, player: null, cannotPlaceHere: false }))
  );
  
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, category: null, customEmojis: [], placedEmojis: [] },
    { id: 2, category: null, customEmojis: [], placedEmojis: [] }
  ]);

  const {
    playPlaceEmoji,
    playEmojiVanish,
    playWin,
    playGameStart,
    playButtonClick,
    playCannotPlace
  } = useSoundEffects();

  const checkWinner = (newBoard: Cell[]) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoard[a].player && 
          newBoard[a].player === newBoard[b].player && 
          newBoard[a].player === newBoard[c].player) {
        setWinningCells(pattern);
        return newBoard[a].player;
      }
    }
    return null;
  };

  const getRandomEmoji = (player: Player): string => {
    if (!player.category) return '❓';
    
    if (player.category === 'Custom') {
      return player.customEmojis[Math.floor(Math.random() * player.customEmojis.length)];
    }
    
    const categoryEmojis = EMOJI_CATEGORIES[player.category];
    return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
  };

  const handleCellClick = (index: number) => {
    if (gamePhase !== 'playing' || board[index].emoji || board[index].cannotPlaceHere) {
      if (board[index].cannotPlaceHere) {
        playCannotPlace();
      }
      return;
    }

    const currentPlayerData = players.find(p => p.id === currentPlayer)!;
    const newEmoji = getRandomEmoji(currentPlayerData);
    
    playPlaceEmoji();
    
    const newBoard = [...board];
    const newPlayers = [...players];
    const playerIndex = newPlayers.findIndex(p => p.id === currentPlayer);
    
    // Add new emoji
    newBoard[index] = { emoji: newEmoji, player: currentPlayer, cannotPlaceHere: false };
    const newPlacedEmoji = { emoji: newEmoji, position: index, timestamp: Date.now() };
    newPlayers[playerIndex].placedEmojis.push(newPlacedEmoji);

    // Check if player has more than 3 emojis
    if (newPlayers[playerIndex].placedEmojis.length > 3) {
      const oldestEmoji = newPlayers[playerIndex].placedEmojis.shift()!;
      const oldPosition = oldestEmoji.position;
      
      // Play vanish sound
      setTimeout(() => playEmojiVanish(), 200);
      
      // Remove the oldest emoji from board and mark as cannot place
      newBoard[oldPosition] = { emoji: null, player: null, cannotPlaceHere: true };
      
      // Clear the cannotPlaceHere flag after a brief moment
      setTimeout(() => {
        setBoard(prevBoard => {
          const updatedBoard = [...prevBoard];
          updatedBoard[oldPosition].cannotPlaceHere = false;
          return updatedBoard;
        });
      }, 1000);
    }

    setBoard(newBoard);
    setPlayers(newPlayers);

    // Check for winner
    const winnerResult = checkWinner(newBoard);
    if (winnerResult) {
      setWinner(winnerResult);
      setGamePhase('finished');
      setShowCelebration(true);
      
      // Play win sound
      setTimeout(() => playWin(), 300);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
      return;
    }

    // Switch turns
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const startGame = () => {
    const bothPlayersReady = players.every(p => 
      p.category && (p.category !== 'Custom' || p.customEmojis.length >= 3)
    );
    
    if (bothPlayersReady) {
      playGameStart();
      setGamePhase('playing');
    }
  };

  const resetGame = () => {
    playButtonClick();
    setGamePhase('setup');
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setShowCelebration(false);
    setBoard(Array(9).fill(null).map(() => ({ emoji: null, player: null, cannotPlaceHere: false })));
    setPlayers([
      { id: 1, category: null, customEmojis: [], placedEmojis: [] },
      { id: 2, category: null, customEmojis: [], placedEmojis: [] }
    ]);
  };

  const updatePlayerCategory = (playerId: 1 | 2, category: keyof EmojiCategories, customEmojis: string[] = []) => {
    playButtonClick();
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, category, customEmojis } 
        : p
    ));
  };

  if (gamePhase === 'setup') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-[fade-in_0.5s_ease-out]">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-[fade-in_0.7s_ease-out]">
              Choose Your Emoji Categories
            </h2>
            <p className="text-gray-600 animate-[fade-in_0.9s_ease-out]">
              Each player picks a category for their emojis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="animate-[slide-in-left_0.5s_ease-out]">
              <CategorySelector
                playerId={1}
                categories={EMOJI_CATEGORIES}
                onCategorySelect={updatePlayerCategory}
                selectedCategory={players[0].category}
              />
            </div>
            <div className="animate-[slide-in-right_0.5s_ease-out]">
              <CategorySelector
                playerId={2}
                categories={EMOJI_CATEGORIES}
                onCategorySelect={updatePlayerCategory}
                selectedCategory={players[1].category}
              />
            </div>
          </div>

          <div className="text-center animate-[fade-in_1.1s_ease-out]">
            <Button 
              onClick={startGame}
              disabled={!players.every(p => p.category && (p.category !== 'Custom' || p.customEmojis.length >= 3))}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              🚀 Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-[fade-in_0.5s_ease-out]">
      <CardContent className="p-6">
        {gamePhase === 'finished' && winner && (
          <div className="text-center mb-6">
            <div className={`text-6xl mb-4 ${showCelebration ? 'animate-bounce' : ''}`}>
              🎉
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              Player {winner} Wins!
            </h2>
            {showCelebration && (
              <div className="flex justify-center gap-2 mt-4 animate-bounce">
                <span className="text-2xl">🎊</span>
                <span className="text-2xl">🏆</span>
                <span className="text-2xl">🎊</span>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="animate-[slide-in-left_0.6s_ease-out]">
            <PlayerInfo 
              player={players[0]} 
              isActive={currentPlayer === 1 && gamePhase === 'playing'} 
              isWinner={winner === 1}
            />
          </div>
          
          <div className="lg:col-span-1 animate-[scale-in_0.5s_ease-out]">
            <GameBoard 
              board={board}
              onCellClick={handleCellClick}
              gamePhase={gamePhase}
              winningCells={winningCells}
            />
            
            {gamePhase === 'playing' && (
              <div className="text-center mt-4 animate-[fade-in_0.8s_ease-out]">
                <p className="text-lg font-semibold text-gray-700 animate-pulse">
                  Player {currentPlayer}'s Turn
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Remember: Only 3 emojis max on board!
                </p>
              </div>
            )}
          </div>
          
          <div className="animate-[slide-in-right_0.6s_ease-out]">
            <PlayerInfo 
              player={players[1]} 
              isActive={currentPlayer === 2 && gamePhase === 'playing'} 
              isWinner={winner === 2}
            />
          </div>
        </div>

        <div className="text-center mt-6 animate-[fade-in_1s_ease-out]">
          <Button 
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            🔁 Play Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiTicTacToe;
