
import React from 'react';
import type { Cell } from './EmojiTicTacToe';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface GameBoardProps {
  board: Cell[];
  onCellClick: (index: number) => void;
  gamePhase: 'setup' | 'playing' | 'finished';
  winningCells?: number[];
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, gamePhase, winningCells = [] }) => {
  const { playButtonClick } = useSoundEffects();

  const handleCellClick = (index: number) => {
    if (gamePhase === 'playing' && !board[index].emoji && !board[index].cannotPlaceHere) {
      playButtonClick();
    }
    onCellClick(index);
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto aspect-square">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleCellClick(index)}
          disabled={gamePhase !== 'playing'}
          className={`
            aspect-square flex items-center justify-center text-3xl md:text-4xl
            rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95
            ${cell.emoji 
              ? `bg-white shadow-lg border-2 border-gray-200 ${winningCells.includes(index) ? 'animate-bounce bg-gradient-to-br from-yellow-200 to-orange-200 border-yellow-400' : ''}` 
              : cell.cannotPlaceHere 
                ? 'bg-red-100 border-2 border-red-300 cursor-not-allowed animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-400 hover:shadow-md'
            }
            ${gamePhase !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${cell.emoji ? 'animate-[scale-in_0.3s_ease-out]' : ''}
          `}
        >
          <span className={`${cell.emoji ? 'animate-[fade-in_0.5s_ease-out]' : ''}`}>
            {cell.emoji || (cell.cannotPlaceHere ? '🚫' : '')}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
