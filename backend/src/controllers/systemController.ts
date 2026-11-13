import { Request, Response, NextFunction } from 'express';
import { AppConfigModel, formatAppConfigForKora } from '../models/AppConfig';
import { SupportTicketModel, formatTicketForKora } from '../models/SupportTicket';

export const getSystemTime = (_req: Request, res: Response): void => {
  const now = new Date();
  const utcDate = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const utcTimestamp = now.getTime();

  const tomorrowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const secondsUntilReset = Math.floor((tomorrowUtc.getTime() - utcTimestamp) / 1000);

  res.status(200).json({
    success: true,
    serverUtcIso: now.toISOString(),
    serverUtcDate: utcDate,
    serverUtcTimestamp: utcTimestamp,
    secondsUntilDailyReset: secondsUntilReset,
  });
};

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

export const getPublicConfig = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let config = await AppConfigModel.findOne({ configId: 'global_config' });
    if (!config) {
      config = await AppConfigModel.create({
        configId: 'global_config',
        maintenanceMode: false,
        announcementTitle: 'Sistem Durumu: Normal',
        announcementMessage: 'Doksan Dakika sunucuları aktif ve kesintisiz çalışmaktadır.',
        minAppVersion: '1.0.0',
        forceUpdate: false,
      });
    }
    res.status(200).json({
      success: true,
      data: formatAppConfigForKora(config),
    });
  } catch (error) {
    next(error);
  }
};

export const createPublicTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { company_or_user_name, userName, user_email, userEmail, subject, message } = req.body;
    const ticket = await SupportTicketModel.create({
      companyOrUserName: company_or_user_name || userName || 'Doksan Dakika Oyuncusu',
      userEmail: user_email || userEmail || '',
      subject: subject || 'Oyun İçi Geri Bildirim',
      message: message || '',
      status: 'open',
    });

    res.status(201).json({
      success: true,
      data: formatTicketForKora(ticket),
    });
  } catch (error) {
    next(error);
  }
};
