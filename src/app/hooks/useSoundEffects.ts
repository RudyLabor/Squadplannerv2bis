import { useCallback, useRef } from 'react';

type SoundEffect = 'click' | 'success' | 'error' | 'notification' | 'whoosh';

// Subtle sound effects using Web Audio API
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Gentle envelope
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }, [getAudioContext]);

  const play = useCallback((effect: SoundEffect) => {
    try {
      switch (effect) {
        case 'click':
          playTone(800, 0.05, 'sine');
          break;
        case 'success':
          playTone(600, 0.1, 'sine');
          setTimeout(() => playTone(800, 0.1, 'sine'), 50);
          break;
        case 'error':
          playTone(300, 0.15, 'sine');
          break;
        case 'notification':
          playTone(700, 0.08, 'sine');
          setTimeout(() => playTone(900, 0.08, 'sine'), 80);
          break;
        case 'whoosh':
          playTone(400, 0.2, 'sawtooth');
          break;
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('Sound effect failed:', error);
    }
  }, [playTone]);

  return { play };
}
