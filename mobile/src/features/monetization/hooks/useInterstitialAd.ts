import { useCallback } from 'react';
import { admobService } from '../services/admobService';

export const useInterstitialAd = () => {
  const showInterstitialIfDue = useCallback(
    (completedLevel: number, onComplete: () => void) => {
      if (completedLevel <= 0 || completedLevel % 3 !== 0) {
        onComplete();
        return;
      }

      admobService.showInterstitial(() => {
        onComplete();
      });
    },
    []
  );

  return {
    showInterstitialIfDue,
  };
};
