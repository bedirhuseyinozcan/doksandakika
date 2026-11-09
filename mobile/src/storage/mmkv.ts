import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IAppStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string | boolean | number): void;
  getBoolean(key: string): boolean | undefined;
  getNumber(key: string): number | undefined;
  delete(key: string): void;
  clearAll(): void;
  getKeysWithPrefix(prefix: string): string[];
  hydrateFromDisk(): Promise<void>;
}

const MAX_ASYNC_STORAGE_VALUE_LENGTH = 500_000;
const HYDRATION_TIMEOUT_MS = 3500;

class UniversalStorage implements IAppStorage {
  private memory = new Map<string, string>();
  private nativeMMKV: any = null;
  private isHydrated = false;
  private hydrationPromise: Promise<void> | null = null;

  constructor() {
    this.initNativeMMKV();
  }

  private initNativeMMKV(): void {
    // React Native 0.86+ / Expo 57 New Architecture:
    // Güvenli ve sıfır C++ çökme riski için in-memory Map + AsyncStorage disk persistansı kullanılır.
    this.nativeMMKV = null;
  }

  public async hydrateFromDisk(): Promise<void> {
    if (this.isHydrated || Platform.OS === 'web') {
      this.isHydrated = true;
      return;
    }
    if (this.hydrationPromise) {
      return this.hydrationPromise;
    }

    const performHydration = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const allAppKeys = keys.filter((k) => k.startsWith('doksan_') || k.startsWith('penalty_'));

        const oversizedCacheKeys = allAppKeys.filter((k) => k.includes('search_index_cache'));
        if (oversizedCacheKeys.length > 0) {
          try {
            await AsyncStorage.multiRemove(oversizedCacheKeys);
          } catch {}
        }

        const appKeys = allAppKeys.filter((k) => !k.includes('search_index_cache'));

        if (appKeys.length > 0) {
          try {
            const pairs = await AsyncStorage.multiGet(appKeys);
            for (const [k, v] of pairs) {
              if (k && v !== null) {
                this.memory.set(k, v);
              }
            }
          } catch (multiGetErr) {
            console.warn('multiGet fallback to individual getItem:', multiGetErr);
            for (const k of appKeys) {
              try {
                const v = await AsyncStorage.getItem(k);
                if (v !== null) {
                  this.memory.set(k, v);
                }
              } catch (keyErr) {
                console.warn(`[Storage] Skipping unreadable key "${k}":`, keyErr);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Disk hydration warning:', e);
      }
    };

    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn('[Storage] hydrateFromDisk timed out after 3500ms, proceeding with available memory.');
        resolve();
      }, HYDRATION_TIMEOUT_MS);
    });

    this.hydrationPromise = Promise.race([performHydration(), timeoutPromise]).finally(() => {
      this.isHydrated = true;
    });

    return this.hydrationPromise;
  }

  getString(key: string): string | undefined {
    let result: string | undefined;

    if (this.nativeMMKV) {
      try {
        const val = this.nativeMMKV.getString(key);
        if (val !== undefined) result = val;
      } catch {}
    }
    if (result === undefined && Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) result = val;
      } catch {}
    }
    if (result === undefined) {
      result = this.memory.get(key);
    }

    if (result === undefined && key.startsWith('doksan_')) {
      const legacyKey = key.replace('doksan_', 'penalty_');
      const legacyVal = this.getString(legacyKey);
      if (legacyVal !== undefined) {
        this.set(key, legacyVal);
        return legacyVal;
      }
    }

    return result;
  }

  set(key: string, value: string | boolean | number): void {
    const strVal = String(value);
    this.memory.set(key, strVal);

    if (this.nativeMMKV) {
      try {
        this.nativeMMKV.set(key, value);
      } catch {}
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, strVal);
      } catch {}
      return;
    }

    
    if (key.includes('search_index_cache') || strVal.length > MAX_ASYNC_STORAGE_VALUE_LENGTH) {
      console.warn(
        `[Storage] Skipping disk write for "${key}" (${strVal.length} chars exceeds ${MAX_ASYNC_STORAGE_VALUE_LENGTH} limit)`
      );
      return;
    }

    AsyncStorage.setItem(key, strVal).catch(() => {});
  }

  getKeysWithPrefix(prefix: string): string[] {
    const matched = new Set<string>();
    for (const k of this.memory.keys()) {
      if (k.startsWith(prefix)) {
        matched.add(k);
      }
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            matched.add(k);
          }
        }
      } catch {}
    }
    return Array.from(matched);
  }

  getBoolean(key: string): boolean | undefined {
    if (this.nativeMMKV) {
      try {
        const val = this.nativeMMKV.getBoolean(key);
        if (val !== undefined) return val;
      } catch {}
    }
    const val = this.getString(key);
    return val === undefined ? undefined : val === 'true';
  }

  getNumber(key: string): number | undefined {
    if (this.nativeMMKV) {
      try {
        const val = this.nativeMMKV.getNumber(key);
        if (val !== undefined) return val;
      } catch {}
    }
    const val = this.getString(key);
    return val === undefined ? undefined : Number(val);
  }

  delete(key: string): void {
    this.memory.delete(key);
    if (this.nativeMMKV) {
      try {
        this.nativeMMKV.delete(key);
      } catch {}
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(key);
      } catch {}
      return;
    }
    AsyncStorage.removeItem(key).catch(() => {});
  }

  clearAll(): void {
    this.memory.clear();
    if (this.nativeMMKV) {
      try {
        this.nativeMMKV.clearAll();
      } catch {}
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.clear();
      } catch {}
      return;
    }
    AsyncStorage.clear().catch(() => {});
  }
}

export const appStorage = new UniversalStorage();

export const StorageKeys = {
  USER_COINS: 'doksan_user_coins',
  USER_XP: 'doksan_user_xp',
  UNLOCKED_LEVELS: 'doksan_unlocked_levels',
  UNLOCKED_COSMETICS: 'doksan_unlocked_cosmetics',
  EQUIPPED_COSMETIC_ID: 'doksan_equipped_cosmetic_id',
  SEARCH_INDEX_CACHE: 'doksan_search_index_cache_v9_2627',
  SEARCH_INDEX_TIMESTAMP: 'doksan_search_index_timestamp',
  SELECTED_LEAGUE_MODE: 'doksan_selected_league_mode',
  SOUND_ENABLED: 'doksan_sound_enabled',
  HAPTICS_ENABLED: 'doksan_haptics_enabled',
  DAILY_COMPLETED_PREFIX: 'doksan_daily_completed_',
  DAILY_SESSION_PREFIX: 'doksan_daily_session_',
  LEVEL_CACHE_PREFIX: 'doksan_level_cache_v7_2627_',
  CURRENT_STREAK: 'doksan_current_streak',
  MAX_STREAK: 'doksan_max_streak',
  LAST_COMPLETED_DATE: 'doksan_last_completed_date',
  GAME_STATS: 'doksan_game_stats',
  SERVER_TIME_OFFSET_MS: 'doksan_server_time_offset_ms',
  LAST_SERVER_UTC_DATE: 'doksan_last_server_utc_date',
} as const;
