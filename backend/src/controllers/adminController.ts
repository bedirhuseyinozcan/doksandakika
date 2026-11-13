import { Request, Response, NextFunction } from 'express';
import { PlayerModel } from '../models/Player';
import { DailyChallengeModel } from '../models/DailyChallenge';
import { LevelModel } from '../models/Level';
import { AppConfigModel, formatAppConfigForKora } from '../models/AppConfig';
import { SupportTicketModel, formatTicketForKora } from '../models/SupportTicket';
import { AppError } from '../middlewares/errorHandler';

const getOrCreateGlobalConfig = async () => {
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
  return config;
};

// ==========================================
// 1. TELEMETRY & OVERVIEW
// ==========================================
export const getAdminOverview = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalPlayers,
      activePlayers,
      legendsCount,
      superLigPlayers,
      totalDailyChallenges,
      totalLevels,
      openTickets,
      config,
    ] = await Promise.all([
      PlayerModel.countDocuments(),
      PlayerModel.countDocuments({ isActive: true }),
      PlayerModel.countDocuments({ isLegend: true }),
      PlayerModel.countDocuments({ leagues: 'super_lig' }),
      DailyChallengeModel.countDocuments(),
      LevelModel.countDocuments(),
      SupportTicketModel.countDocuments({ status: { $in: ['open', 'Açık'] } }),
      getOrCreateGlobalConfig(),
    ]);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const todayChallengesCount = await DailyChallengeModel.countDocuments({ date: todayStr });

    res.status(200).json({
      success: true,
      data: {
        totalPlayers,
        activePlayers,
        inactivePlayers: Math.max(0, totalPlayers - activePlayers),
        legendsCount,
        superLigPlayers,
        totalDailyChallenges,
        todayChallengesCount,
        totalLevels,
        openTickets,
        maintenanceMode: config.maintenanceMode,
        serverUtcDate: todayStr,
        serverUtcIso: now.toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. REMOTE CONFIG (MAINTENANCE & BROADCAST)
// ==========================================
export const getAdminConfig = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await getOrCreateGlobalConfig();
    res.status(200).json({
      success: true,
      data: formatAppConfigForKora(config),
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body || {};
    const updateFields: Record<string, unknown> = {};

    if (typeof body.maintenance_mode === 'boolean') {
      updateFields.maintenanceMode = body.maintenance_mode;
    } else if (typeof body.maintenanceMode === 'boolean') {
      updateFields.maintenanceMode = body.maintenanceMode;
    }

    if (body.announcement_title !== undefined || body.announcementTitle !== undefined) {
      updateFields.announcementTitle = body.announcement_title ?? body.announcementTitle ?? '';
    }

    if (body.announcement_message !== undefined || body.announcementMessage !== undefined) {
      updateFields.announcementMessage = body.announcement_message ?? body.announcementMessage ?? '';
    }

    if (body.min_app_version !== undefined || body.minAppVersion !== undefined) {
      updateFields.minAppVersion = body.min_app_version ?? body.minAppVersion ?? '1.0.0';
    }

    if (typeof body.force_update === 'boolean') {
      updateFields.forceUpdate = body.force_update;
    } else if (typeof body.forceUpdate === 'boolean') {
      updateFields.forceUpdate = body.forceUpdate;
    }

    const updated = await AppConfigModel.findOneAndUpdate(
      { configId: 'global_config' },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: formatAppConfigForKora(updated),
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. SUPPORT TICKETS
// ==========================================
export const getAdminTickets = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tickets = await SupportTicketModel.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets.map(formatTicketForKora),
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_notes, adminNotes } = req.body;

    const update: Record<string, unknown> = {};
    if (status !== undefined) update.status = status;
    if (admin_notes !== undefined || adminNotes !== undefined) {
      update.adminNotes = admin_notes ?? adminNotes;
    }

    const ticket = await SupportTicketModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!ticket) {
      return next(new AppError('Destek bileti bulunamadı.', 404));
    }

    res.status(200).json({
      success: true,
      data: formatTicketForKora(ticket),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await SupportTicketModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Bilet silindi.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. PLAYERS MANAGEMENT (MONGODB ATLAS)
// ==========================================
export const getAdminPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const league = (req.query.league as string | undefined)?.trim();
    const isActiveParam = req.query.isActive as string | undefined;
    const isLegendParam = req.query.isLegend as string | undefined;
    const limit = Math.min(parseInt((req.query.limit as string) || '150', 10), 500);

    const filter: Record<string, unknown> = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { knownName: regex },
        { 'currentClub.name': regex },
        { nationality: regex },
        { playerId: regex },
      ];
    }

    if (league && league.length > 0 && league !== 'all') {
      filter.leagues = league;
    }

    if (isActiveParam === 'true') filter.isActive = true;
    if (isActiveParam === 'false') filter.isActive = false;
    if (isLegendParam === 'true') filter.isLegend = true;

    const players = await PlayerModel.find(filter)
      .sort({ updatedAt: -1, name: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertAdminPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;
    const playerId = (body.playerId || `custom_${Date.now()}`).toString().trim();

    const clubName = body.currentClub?.name || body.clubName || 'Serbest';
    const clubLeague = body.currentClub?.league || body.league || 'super_lig';
    const clubId =
      body.currentClub?.id ||
      `club_${clubName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

    const leagues: string[] = Array.isArray(body.leagues)
      ? body.leagues
      : [clubLeague];

    const payload = {
      playerId,
      name: body.name,
      knownName: body.knownName || body.name,
      leagues,
      currentClub: {
        id: clubId,
        name: clubName,
        logoUrl: body.currentClub?.logoUrl || body.clubLogoUrl || '',
        league: clubLeague,
      },
      nationality: body.nationality || 'Turkey',
      position: body.position || 'CF',
      age: Number(body.age) || 25,
      shirtNumber: body.shirtNumber != null ? Number(body.shirtNumber) : undefined,
      marketValueEur: body.marketValueEur != null ? Number(body.marketValueEur) : 0,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
      isLegend: typeof body.isLegend === 'boolean' ? body.isLegend : false,
      ...(Array.isArray(body.careerPath) && { careerPath: body.careerPath }),
      ...(body.originalImageUrl !== undefined && { originalImageUrl: body.originalImageUrl }),
    };

    const player = await PlayerModel.findOneAndUpdate(
      { playerId },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { playerId } = req.params;
    const body = req.body;

    const existing = await PlayerModel.findOne({ playerId });
    if (!existing) {
      return next(new AppError(`Futbolcu bulunamadı: ${playerId}`, 404));
    }

    if (body.name !== undefined) existing.name = body.name;
    if (body.knownName !== undefined) existing.knownName = body.knownName;
    if (body.nationality !== undefined) existing.nationality = body.nationality;
    if (body.position !== undefined) existing.position = body.position;
    if (body.age !== undefined) existing.age = Number(body.age);
    if (body.shirtNumber !== undefined) existing.shirtNumber = Number(body.shirtNumber);
    if (body.marketValueEur !== undefined) existing.marketValueEur = Number(body.marketValueEur);
    if (typeof body.isActive === 'boolean') existing.isActive = body.isActive;
    if (typeof body.isLegend === 'boolean') existing.isLegend = body.isLegend;
    if (Array.isArray(body.leagues)) existing.leagues = body.leagues;

    if (body.clubName !== undefined || body.currentClub !== undefined) {
      const newClubName = body.currentClub?.name ?? body.clubName ?? existing.currentClub.name;
      const newLeague = body.currentClub?.league ?? body.league ?? existing.currentClub.league;
      existing.currentClub = {
        id:
          body.currentClub?.id ??
          `club_${newClubName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        name: newClubName,
        logoUrl: body.currentClub?.logoUrl ?? existing.currentClub.logoUrl ?? '',
        league: newLeague,
      };
      if (!existing.leagues.includes(newLeague)) {
        existing.leagues.push(newLeague);
      }
    }

    await existing.save();

    res.status(200).json({
      success: true,
      data: existing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { playerId } = req.params;
    await PlayerModel.findOneAndDelete({ playerId });
    res.status(200).json({
      success: true,
      message: 'Futbolcu silindi.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. DAILY CHALLENGES MANAGEMENT
// ==========================================
export const getAdminDailyChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const date = (req.query.date as string | undefined)?.trim();
    const leagueMode = (req.query.leagueMode as string | undefined)?.trim();
    const gameMode = (req.query.gameMode as string | undefined)?.trim();

    const filter: Record<string, unknown> = {};
    if (date) filter.date = date;
    if (leagueMode && leagueMode !== 'all') filter.leagueMode = leagueMode;
    if (gameMode && gameMode !== 'all') filter.gameMode = gameMode;

    const challenges = await DailyChallengeModel.find(filter)
      .populate('playerRef', 'playerId name currentClub nationality position age')
      .sort({ date: -1, leagueMode: 1, gameMode: 1 })
      .limit(100);

    const formatted = challenges.map((c) => {
      const populatedPlayer = c.playerRef as unknown as {
        playerId?: string;
        name?: string;
        currentClub?: { name?: string; league?: string };
        nationality?: string;
        position?: string;
      } | null;

      return {
        id: c._id.toString(),
        date: c.date,
        gameMode: c.gameMode,
        leagueMode: c.leagueMode,
        playerId: c.playerId,
        playerName: populatedPlayer?.name || c.playerId,
        playerClub: populatedPlayer?.currentClub?.name || '',
        playerPosition: populatedPlayer?.position || '',
        difficulty: c.difficulty,
        hints: c.hints || [],
        createdAt: c.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertAdminDailyChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, gameMode, leagueMode, playerId, difficulty, hints } = req.body;

    if (!date || !gameMode || !leagueMode || !playerId) {
      return next(
        new AppError('date, gameMode, leagueMode ve playerId alanları zorunludur.', 400)
      );
    }

    const player = await PlayerModel.findOne({ playerId });
    if (!player) {
      return next(new AppError(`Seçilen playerId (${playerId}) veritabanında bulunamadı.`, 404));
    }

    const challenge = await DailyChallengeModel.findOneAndUpdate(
      { date, gameMode, leagueMode },
      {
        $set: {
          date,
          gameMode,
          leagueMode,
          playerId: player.playerId,
          playerRef: player._id,
          difficulty: difficulty || 'medium',
          hints: Array.isArray(hints) ? hints : [],
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        id: challenge._id.toString(),
        date: challenge.date,
        gameMode: challenge.gameMode,
        leagueMode: challenge.leagueMode,
        playerId: challenge.playerId,
        playerName: player.name,
        playerClub: player.currentClub?.name || '',
        playerPosition: player.position,
        difficulty: challenge.difficulty,
        hints: challenge.hints,
        createdAt: challenge.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminDailyChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await DailyChallengeModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Günlük soru kaydı silindi.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. LEVELS MANAGEMENT
// ==========================================
export const getAdminLevels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gameMode = (req.query.gameMode as string | undefined)?.trim();
    const leagueMode = (req.query.leagueMode as string | undefined)?.trim();
    const limit = Math.min(parseInt((req.query.limit as string) || '100', 10), 300);

    const filter: Record<string, unknown> = {};
    if (gameMode && gameMode !== 'all') filter.gameMode = gameMode;
    if (leagueMode && leagueMode !== 'all') filter.leagueMode = leagueMode;

    const levels = await LevelModel.find(filter)
      .populate('playerRef', 'playerId name currentClub position nationality')
      .sort({ levelNumber: 1, leagueMode: 1, gameMode: 1 })
      .limit(limit);

    const formatted = levels.map((lvl) => {
      const populatedPlayer = lvl.playerRef as unknown as {
        name?: string;
        currentClub?: { name?: string };
        position?: string;
      } | null;

      return {
        id: lvl._id.toString(),
        levelNumber: lvl.levelNumber,
        gameMode: lvl.gameMode,
        leagueMode: lvl.leagueMode,
        playerId: lvl.playerId,
        playerName: populatedPlayer?.name || lvl.playerId,
        playerClub: populatedPlayer?.currentClub?.name || '',
        rewardCoins: lvl.rewardCoins,
        rewardXp: lvl.rewardXp,
        hints: lvl.hints || [],
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertAdminLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { levelNumber, gameMode, leagueMode, playerId, rewardCoins, rewardXp, hints } = req.body;

    if (!levelNumber || !gameMode || !leagueMode || !playerId) {
      return next(
        new AppError('levelNumber, gameMode, leagueMode ve playerId alanları zorunludur.', 400)
      );
    }

    const player = await PlayerModel.findOne({ playerId });
    if (!player) {
      return next(new AppError(`Seçilen playerId (${playerId}) veritabanında bulunamadı.`, 404));
    }

    const level = await LevelModel.findOneAndUpdate(
      { levelNumber: Number(levelNumber), gameMode, leagueMode },
      {
        $set: {
          levelNumber: Number(levelNumber),
          gameMode,
          leagueMode,
          playerId: player.playerId,
          playerRef: player._id,
          rewardCoins: rewardCoins != null ? Number(rewardCoins) : 25,
          rewardXp: rewardXp != null ? Number(rewardXp) : 50,
          hints: Array.isArray(hints) ? hints : [],
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        id: level._id.toString(),
        levelNumber: level.levelNumber,
        gameMode: level.gameMode,
        leagueMode: level.leagueMode,
        playerId: level.playerId,
        playerName: player.name,
        playerClub: player.currentClub?.name || '',
        rewardCoins: level.rewardCoins,
        rewardXp: level.rewardXp,
        hints: level.hints,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await LevelModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Seviye silindi.',
    });
  } catch (error) {
    next(error);
  }
};
