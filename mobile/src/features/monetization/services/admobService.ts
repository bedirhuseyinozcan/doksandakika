import { Platform } from 'react-native';

// Google Resmi Test Reklam Kimlikleri (Geliştirme aşamasında ban yememek için)
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
  private interstitialInstance: any = null;
  private rewardedInstance: any = null;
  private isInterstitialLoaded: boolean = false;
  private isRewardedLoaded: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (Platform.OS === 'web') return;

    try {
      const mobileAds = require('react-native-google-mobile-ads');
      const { InterstitialAd, RewardedAd } = mobileAds;

      if (InterstitialAd && RewardedAd) {
        this.isAvailable = true;
        this.preloadInterstitial();
        this.preloadRewarded();
      }
    } catch {
      this.isAvailable = false;
    }
  }

  public preloadInterstitial(): void {
    if (!this.isAvailable || Platform.OS === 'web') return;

    try {
      const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
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
    if (!this.isAvailable || Platform.OS === 'web') return;

    try {
      const { RewardedAd, RewardedAdEventType } = require('react-native-google-mobile-ads');
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
      const { AdEventType } = require('react-native-google-mobile-ads');

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
      // Reklam hazır değilse veya webdeyse kullanıcıyı mağdur etme, ödülü ver
      onRewardEarned();
      onClosed();
      this.preloadRewarded();
      return;
    }

    try {
      const { RewardedAdEventType, AdEventType } = require('react-native-google-mobile-ads');
      let earned = false;

      const unsubscribeEarned = this.rewardedInstance.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          earned = true;
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
    return this.isAvailable;
  }
}

export const admobService = new AdMobService();
