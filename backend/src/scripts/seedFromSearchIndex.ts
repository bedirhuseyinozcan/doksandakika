import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { PlayerModel } from '../models/Player';
import { connectDatabase } from '../config/db';

export async function seedFromSearchIndex(): Promise<void> {
  await connectDatabase();

  const searchIndexPath = path.resolve(__dirname, '../../../mobile/src/assets/data/search-index.json');
  console.log(`📂 Arama indeksi okunuyor: ${searchIndexPath}`);

  if (!fs.existsSync(searchIndexPath)) {
    console.error('❌ search-index.json dosyası bulunamadı!');
    await mongoose.disconnect();
    return;
  }

  const raw = fs.readFileSync(searchIndexPath, 'utf8');
  const players = JSON.parse(raw);
  console.log(`⚽ Toplam ${players.length} oyuncu/efsane MongoDB Atlas için hazırlanıyor...`);

  const bulkOps = players.map((p: any, index: number) => {
    const isLegend = Boolean(p.isLegend);
    const currentClub = {
      id: isLegend ? 'legend' : p.clubId ? String(p.clubId) : '0',
      name: isLegend ? 'Efsane İkon' : p.club || 'Kulüpsüz',
      logoUrl: isLegend ? '' : p.logoUrl || undefined,
      league: p.league || (isLegend ? 'legend' : 'other'),
    };

    // search-index.json sırasını MongoDB'de birebir korumak için indeks bazlı azalan piyasa değeri
    const deterministicMarketValue =
      p.marketValueEur ||
      (isLegend
        ? 150_000_000 - index
        : Math.max(100_000, 100_000_000 - index * 20_000));

    return {
      updateOne: {
        filter: { playerId: p.id },
        update: {
          $set: {
            playerId: p.id,
            name: p.name,
            leagues: p.leagues || [p.league || 'other'],
            currentClub,
            nationality: p.nationality || 'Dünya',
            position: p.position || 'CM',
            age: p.age || 27,
            ...(p.shirtNumber ? { shirtNumber: p.shirtNumber } : {}),
            marketValueEur: deterministicMarketValue,
            careerPath: p.careerPath || [],
            blurImages: p.blurImages || [],
            originalImageUrl: p.imageUrl || undefined,
            // Efsaneler isActive: false olmalı ki aktif modları (WhoAreYa/Contextinho) bozmasın!
            isActive: !isLegend,
            isLegend,
          },
        },
        upsert: true,
      },
    };
  });

  const chunkSize = 500;
  for (let i = 0; i < bulkOps.length; i += chunkSize) {
    const chunk = bulkOps.slice(i, i + chunkSize);
    await PlayerModel.bulkWrite(chunk);
    console.log(`⏳ [${Math.min(i + chunkSize, bulkOps.length)}/${players.length}] futbolcu kaydedildi...`);
  }

  console.log(`🎉 Başarılı! Toplam ${players.length} futbolcu ve efsane MongoDB Atlas'a güncellendi.`);
  await mongoose.disconnect();
}

if (require.main === module) {
  seedFromSearchIndex().catch((err) => {
    console.error('Seed hatası:', err);
    process.exit(1);
  });
}
