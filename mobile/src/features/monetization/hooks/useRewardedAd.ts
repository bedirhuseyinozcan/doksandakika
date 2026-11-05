import { useState, useCallback } from 'react';
import { admobService } from '../services/admobService';

export const useRewardedAd = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showRewardedAd = useCallback(
    async (_rewardTitle: string, onRewardGranted: () => void) => {
      setIsLoading(true);

      admobService.showRewarded(
        () => {
          onRewardGranted();
        },
        () => {
          setIsLoading(false);
        }
      );
    },
    []
  );

  return {
    isLoading,
    showRewardedAd,
  };
};
