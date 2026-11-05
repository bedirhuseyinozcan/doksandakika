import { Platform } from 'react-native';

const GOOGLE_TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';
const GOOGLE_TEST_REWARDED = 'ca-app-pub-3940256099942544/5224354917';

declare const process: any;

const getInterstitialUnitId = (): string => {
  const customId = typeof process !== 'undefined' ? process?.env?.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID : undefined;
  return customId || GOOGLE_TEST_INTERSTITIAL;
};

const getRewardedUnitId = (): string => {
  const customId = typeof process !== 'undefined' ? process?.env?.EXPO_PUBLIC_ADMOB_REWARDED_ID : undefined;
  return customId || GOOGLE_TEST_REWARDED;
};

class AdMobService {
  private isAvailable: boolean = false;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private interstitialInstance: any = null;
  private rewardedInstance: any = null;
  private isInterstitialLoaded: boolean = false;
  private isRewardedLoaded: boolean = false;

  // Başlangıçta (constructor) ASLA senkron reklam yüklemesi yapılmaz (Android çökmesini önler)
  constructor() {
    this.isAvailable = false;
  }

  public async initialize(): Promise<void> {
    if (Platform.OS === 'web' || this.isInitialized || this.isInitializing) return;

    this.isInitializing = true;
    try {
      const mobileAdsModule = require('react-native-google-mobile-ads');
      const mobileAds = mobileAdsModule.default || mobileAdsModule;

      if (typeof mobileAds === 'function') {
        await mobileAds().initialize();
        this.isAvailable = true;
        this.isInitialized = true;
        this.preloadInterstitial();
        this.preloadRewarded();
      }
    } catch (e) {
      console.warn('AdMob initialization safely skipped or failed:', e);
      this.isAvailable = false;
    } finally {
      this.isInitializing = false;
    }
  }

  public preloadInterstitial(): void {
    if (!this.isAvailable || Platform.OS === 'web' || !this.isInitialized) return;

    try {
      const mobileAdsModule = require('react-native-google-mobile-ads');
      const InterstitialAd = mobileAdsModule.InterstitialAd;
      const AdEventType = mobileAdsModule.AdEventType;
      if (!InterstitialAd || !AdEventType) return;

      const adUnitId = getInterstitialUnitId();
      this.interstitialInstance = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.interstitialInstance.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialLoaded = true;
      });

      this.interstitialInstance.addAdEventListener(AdEventType.ERROR, () => {
        this.isInterstitialLoaded = false;
      });

      this.interstitialInstance.load();
    } catch {
      this.isInterstitialLoaded = false;
    }
  }

  public preloadRewarded(): void {
    if (!this.isAvailable || Platform.OS === 'web' || !this.isInitialized) return;

    try {
      const mobileAdsModule = require('react-native-google-mobile-ads');
      const RewardedAd = mobileAdsModule.RewardedAd;
      const RewardedAdEventType = mobileAdsModule.RewardedAdEventType;
      const AdEventType = mobileAdsModule.AdEventType;
      if (!RewardedAd || !RewardedAdEventType || !AdEventType) return;

      const adUnitId = getRewardedUnitId();
      this.rewardedInstance = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.rewardedInstance.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isRewardedLoaded = true;
      });

      this.rewardedInstance.addAdEventListener(RewardedAdEventType.ERROR, () => {
        this.isRewardedLoaded = false;
      });

      this.rewardedInstance.load();
    } catch {
      this.isRewardedLoaded = false;
    }
  }

  public showInterstitial(onDismiss: () => void): void {
    if (!this.isAvailable || !this.interstitialInstance || !this.isInterstitialLoaded) {
      onDismiss();
      this.preloadInterstitial();
      return;
    }

    try {
      const mobileAdsModule = require('react-native-google-mobile-ads');
      const AdEventType = mobileAdsModule.AdEventType;

      const unsubscribeClosed = this.interstitialInstance.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribeClosed();
          this.isInterstitialLoaded = false;
          onDismiss();
          this.preloadInterstitial();
        }
      );

      this.interstitialInstance.show().catch(() => {
        onDismiss();
        this.preloadInterstitial();
      });
    } catch {
      onDismiss();
    }
  }

  public showRewarded(
    onRewardEarned: () => void,
    onClosed: () => void
  ): void {
    if (!this.isAvailable || !this.rewardedInstance || !this.isRewardedLoaded) {
      onRewardEarned();
      onClosed();
      this.preloadRewarded();
      return;
    }

    try {
      const mobileAdsModule = require('react-native-google-mobile-ads');
      const RewardedAdEventType = mobileAdsModule.RewardedAdEventType;
      const AdEventType = mobileAdsModule.AdEventType;

      const unsubscribeEarned = this.rewardedInstance.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onRewardEarned();
        }
      );

      const unsubscribeClosed = this.rewardedInstance.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribeEarned();
          unsubscribeClosed();
          this.isRewardedLoaded = false;
          onClosed();
          this.preloadRewarded();
        }
      );

      this.rewardedInstance.show().catch(() => {
        onRewardEarned();
        onClosed();
        this.preloadRewarded();
      });
    } catch {
      onRewardEarned();
      onClosed();
    }
  }

  public isReady(): boolean {
    return this.isAvailable && this.isInitialized;
  }
}

export const admobService = new AdMobService();
