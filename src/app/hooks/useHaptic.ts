import { useCallback } from 'react';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptic() {
  const vibrate = useCallback((style: HapticStyle = 'light') => {
    // Check if vibration API is supported
    if (!navigator.vibrate) return;

    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50]
    };

    navigator.vibrate(patterns[style]);
  }, []);

  const impact = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    vibrate(intensity);
  }, [vibrate]);

  const notification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    vibrate(type);
  }, [vibrate]);

  const selection = useCallback(() => {
    vibrate('light');
  }, [vibrate]);

  return {
    vibrate,
    impact,
    notification,
    selection
  };
}
