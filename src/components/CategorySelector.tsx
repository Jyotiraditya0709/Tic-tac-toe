import React, { useState } from 'react';
import { Button } from '@/components/ui/basic-components';
import { Input } from '@/components/ui/form-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/basic-components';
import type { EmojiCategories } from './EmojiTicTacToe';

interface CategorySelectorProps {
  playerId: 1 | 2;
  categories: EmojiCategories;
  onCategorySelect: (playerId: 1 | 2, category: keyof EmojiCategories, customEmojis?: string[]) => void;
  selectedCategory: keyof EmojiCategories | null;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  playerId,
  categories,
  onCategorySelect,
  selectedCategory
}) => {
  const [customInput, setCustomInput] = useState('');
  const [customEmojis, setCustomEmojis] = useState<string[]>([]);

  const handleCustomEmojiAdd = () => {
    if (customInput.trim() && customEmojis.length < 15) {
      const newEmojis = [...customEmojis, customInput.trim()];
      setCustomEmojis(newEmojis);
      setCustomInput('');
      
      if (selectedCategory === 'Custom') {
        onCategorySelect(playerId, 'Custom', newEmojis);
      }
    }
  };

  const handleCategorySelect = (category: keyof EmojiCategories) => {
    if (category === 'Custom') {
      onCategorySelect(playerId, category, customEmojis);
    } else {
      onCategorySelect(playerId, category);
    }
  };

  const removeCustomEmoji = (index: number) => {
    const newEmojis = customEmojis.filter((_, i) => i !== index);
    setCustomEmojis(newEmojis);
    
    if (selectedCategory === 'Custom') {
      onCategorySelect(playerId, 'Custom', newEmojis);
    }
  };

  return (
    <Card className={`
      transition-all duration-300 transform hover:scale-105 
      ${selectedCategory ? 'ring-2 ring-blue-400 animate-[scale-in_0.3s_ease-out]' : ''}
    `}>
      <CardHeader>
        <CardTitle className="text-center animate-[fade-in_0.5s_ease-out]">
          Player {playerId} {playerId === 1 ? '🔴' : '🔵'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Button
            onClick={() => handleCategorySelect('Animals')}
            variant={selectedCategory === 'Animals' ? 'default' : 'outline'}
            className="w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🐶 Animals
          </Button>
          
          <Button
            onClick={() => handleCategorySelect('Food')}
            variant={selectedCategory === 'Food' ? 'default' : 'outline'}
            className="w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🍎 Food
          </Button>
          
          <Button
            onClick={() => handleCategorySelect('Custom')}
            variant={selectedCategory === 'Custom' ? 'default' : 'outline'}
            className="w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ✨ Custom
          </Button>
        </div>

        {selectedCategory === 'Custom' && (
          <div className="space-y-3 animate-[fade-in_0.4s_ease-out]">
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Add emoji..."
                maxLength={2}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomEmojiAdd()}
                className="transition-all duration-200 focus:scale-105"
              />
              <Button 
                onClick={handleCustomEmojiAdd}
                disabled={!customInput.trim() || customEmojis.length >= 15}
                size="sm"
                className="transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Add
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Add at least 3 emojis (max 15)
            </div>
            
            {customEmojis.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg animate-[fade-in_0.3s_ease-out]">
                {customEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => removeCustomEmoji(index)}
                    className="text-lg hover:bg-red-100 rounded p-1 transition-all duration-200 transform hover:scale-125 active:scale-95"
                    title="Click to remove"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <div className="text-xs text-center text-gray-500">
              {customEmojis.length}/15 emojis
            </div>
          </div>
        )}

        {selectedCategory && selectedCategory !== 'Custom' && (
          <div className="text-center p-3 bg-gray-50 rounded-lg animate-[fade-in_0.4s_ease-out]">
            <div className="text-sm text-gray-600 mb-2">Preview:</div>
            <div className="flex flex-wrap justify-center gap-1">
              {categories[selectedCategory].slice(0, 8).map((emoji, index) => (
                <span 
                  key={index} 
                  className="text-lg transition-all duration-200 hover:scale-125 animate-[scale-in_0.2s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
              {categories[selectedCategory].length > 8 && (
                <span className="text-gray-400 animate-pulse">...</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
