import { Schema, model, Document } from 'mongoose';

export interface IAppConfig extends Document {
  configId: string;
  maintenanceMode: boolean;
  announcementTitle: string;
  announcementMessage: string;
  minAppVersion: string;
  forceUpdate: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const AppConfigSchema = new Schema<IAppConfig>(
  {
    configId: {
      type: String,
      required: true,
      unique: true,
      default: 'global_config',
      index: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    announcementTitle: {
      type: String,
      default: 'Sistem Durumu: Normal',
    },
    announcementMessage: {
      type: String,
      default: 'Doksan Dakika sunucuları aktif ve kesintisiz çalışmaktadır.',
    },
    minAppVersion: {
      type: String,
      default: '1.0.0',
    },
    forceUpdate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const formatAppConfigForKora = (doc: IAppConfig) => ({
  id: doc.configId || 'global_config',
  maintenance_mode: doc.maintenanceMode,
  announcement_title: doc.announcementTitle,
  announcement_message: doc.announcementMessage,
  min_app_version: doc.minAppVersion,
  force_update: doc.forceUpdate,
  updated_at: (doc.updatedAt || new Date()).toISOString(),
});

export const AppConfigModel = model<IAppConfig>('AppConfig', AppConfigSchema);
