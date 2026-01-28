
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const hapticFeedback = {
  // Light impact (e.g., keyboard tap, weak button)
  light: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (navigator.vibrate) {
        navigator.vibrate(10); // Weak vibration for web
      }
    } catch (e) {
      console.error('Haptics error:', e);
    }
  },

  // Medium impact (e.g., standard button)
  medium: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    } catch (e) {
      console.error('Haptics error:', e);
    }
  },

  // Heavy impact (e.g., destructive action)
  heavy: async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    } catch (e) {
      console.error('Haptics error:', e);
    }
  },

  // Success notification (e.g., task completed)
  success: async () => {
    try {
      if (isNative) {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch (e) {
      console.error('Haptics error:', e);
    }
  },

  // Error notification (e.g., validation failed)
  error: async () => {
    try {
      if (isNative) {
        await Haptics.notification({ type: NotificationType.Error });
      } else if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50, 30, 50]);
      }
    } catch (e) {
      console.error('Haptics error:', e);
    }
  },
  
  // Selection change (e.g., picker wheel)
  selection: async () => {
      try {
        if (isNative) {
           await Haptics.selectionStart();
           await Haptics.selectionChanged();
           await Haptics.selectionEnd();
        }
      } catch (e) {
          // ignore
      }
  }
};
