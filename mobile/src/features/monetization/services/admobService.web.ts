class WebAdMobService {
  public async initialize(): Promise<void> {
    return Promise.resolve();
  }

  public preloadInterstitial(): void {
    
  }

  public preloadRewarded(): void {
    
  }

  public showInterstitial(onDismiss: () => void): void {
    
    onDismiss();
  }

  public showRewarded(
    onRewardEarned: () => void,
    onClosed: () => void
  ): void {
    
    onRewardEarned();
    onClosed();
  }

  public isReady(): boolean {
    return false;
  }
}

export const admobService = new WebAdMobService();
