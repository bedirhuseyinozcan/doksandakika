import { apiClient } from './client';

export interface ISystemTimeData {
  serverUtcIso: string;
  serverUtcDate: string;
  serverUtcTimestamp: number;
  secondsUntilDailyReset: number;
}

export interface IRemoteConfigData {
  id: string;
  maintenance_mode: boolean;
  announcement_title?: string;
  announcement_message?: string;
  min_app_version?: string;
  force_update: boolean;
  updated_at: string;
}

export const systemApi = {
  getSystemTime: async (): Promise<ISystemTimeData> => {
    const res = await apiClient.get('/system/time');
    return res.data;
  },

  getSearchIndex: async () => {
    const res = await apiClient.get('/players/search-index');
    return res.data.data;
  },

  getRemoteConfig: async (): Promise<IRemoteConfigData | null> => {
    try {
      const res = await apiClient.get('/system/config');
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  createSupportTicket: async (payload: {
    userName?: string;
    userEmail?: string;
    subject: string;
    message: string;
  }) => {
    const res = await apiClient.post('/system/tickets', payload);
    return res.data?.data;
  },
};
