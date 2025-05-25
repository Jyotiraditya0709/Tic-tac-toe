import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/basic-components';
import type { Player } from './EmojiTicTacToe';

interface PlayerInfoProps {
  player: Player;
  isActive: boolean;
  isWinner?: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isActive, isWinner = false }) => {
  return (
    <Card className={`
      transition-all duration-300 transform hover:scale-105
      ${isActive ? 'ring-2 ring-green-400 bg-green-50 animate-pulse' : ''} 
      ${isWinner ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 animate-bounce' : ''}
    `}>
      <CardHeader className="pb-3">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <span className={`${isWinner ? 'animate-spin' : ''}`}>
            Player {player.id} {player.id === 1 ? '🔴' : '🔵'}
          </span>
          {isActive && <span className="text-green-500 animate-bounce">👈</span>}
          {isWinner && <span className="text-yellow-500 animate-bounce">👑</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-3">
          <div className={`transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
            <div className="text-sm text-gray-600 mb-1">Category:</div>
            <div className="font-semibold text-lg">
              {player.category ? (
                <>
                  {player.category === 'Animals' && '🐶 Animals'}
                  {player.category === 'Food' && '🍎 Food'}
                  {player.category === 'Custom' && '✨ Custom'}
                </>
              ) : 'Not selected'}
            </div>
          </div>
          
          <div className={`transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
            <div className="text-sm text-gray-600 mb-1">Emojis on board:</div>
            <div className="text-lg font-bold">
              {player.placedEmojis.length}/3
            </div>
          </div>
          
          {player.placedEmojis.length > 0 && (
            <div className="transition-all duration-300">
              <div className="text-sm text-gray-600 mb-2">Current emojis:</div>
              <div className="flex justify-center gap-1 flex-wrap">
                {player.placedEmojis.map((placed, index) => (
                  <span 
                    key={placed.timestamp} 
                    className={`
                      text-xl transition-all duration-300 hover:scale-125
                      ${index === 0 ? 'opacity-50 animate-pulse' : 'animate-[scale-in_0.3s_ease-out]'}
                    `}
                    title={index === 0 ? 'Oldest (will vanish next)' : ''}
                  >
                    {placed.emoji}
                  </span>
                ))}
              </div>
              {player.placedEmojis.length === 3 && (
                <div className="text-xs text-orange-600 mt-1 animate-pulse">
                  Next placement will remove oldest emoji
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerInfo;
