
import { useCallback } from 'react';

export const useSoundEffects = () => {
  const playSound = useCallback((frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  const playPlaceEmoji = useCallback(() => {
    playSound(800, 0.1, 'sine');
  }, [playSound]);

  const playEmojiVanish = useCallback(() => {
    playSound(400, 0.2, 'triangle');
  }, [playSound]);

  const playWin = useCallback(() => {
    // Victory fanfare
    setTimeout(() => playSound(523, 0.2), 0);    // C
    setTimeout(() => playSound(659, 0.2), 150);  // E
    setTimeout(() => playSound(784, 0.2), 300);  // G
    setTimeout(() => playSound(1047, 0.4), 450); // C (higher)
  }, [playSound]);

  const playGameStart = useCallback(() => {
    playSound(660, 0.15, 'square');
    setTimeout(() => playSound(880, 0.15, 'square'), 100);
  }, [playSound]);

  const playButtonClick = useCallback(() => {
    playSound(1000, 0.05, 'square');
  }, [playSound]);

  const playCannotPlace = useCallback(() => {
    playSound(200, 0.3, 'triangle');
  }, [playSound]);

  return {
    playPlaceEmoji,
    playEmojiVanish,
    playWin,
    playGameStart,
    playButtonClick,
    playCannotPlace
  };
};
