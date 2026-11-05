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
  console.log(`⚽ Toplam ${players.length} oyuncu/efsane MongoDB Atlas'a aktarılmak üzere hazırlanıyor...`);

  let count = 0;
  for (const p of players) {
    const playerId = p.id;
    const currentClub = {
      id: p.clubId ? String(p.clubId) : '0',
      name: p.club || (p.isLegend ? 'Efsane İkon' : 'Kulüpsüz'),
      logoUrl: p.logoUrl || undefined,
      league: p.league || (p.isLegend ? 'legend' : 'other'),
    };

    const doc = {
      playerId,
      name: p.name,
      leagues: p.leagues || [p.league || 'other'],
      currentClub,
      nationality: p.nationality || 'Dünya',
      position: p.position || 'CM',
      age: p.age || 27,
      shirtNumber: p.shirtNumber || undefined,
      marketValueEur: p.marketValueEur || (p.isLegend ? 100000000 : 15000000),
      careerPath: p.careerPath || [],
      blurImages: p.blurImages || [],
      originalImageUrl: p.imageUrl || undefined,
      isActive: true,
      isLegend: Boolean(p.isLegend),
    };

    await PlayerModel.findOneAndUpdate({ playerId }, doc, { upsert: true, new: true });
    count++;
    if (count % 50 === 0) {
      console.log(`⏳ [${count}/${players.length}] futbolcu kaydedildi...`);
    }
  }

  console.log(`🎉 Başarılı! Toplam ${count} futbolcu ve efsane MongoDB Atlas'a kaydedildi.`);
  await mongoose.disconnect();
}

if (require.main === module) {
  seedFromSearchIndex().catch((err) => {
    console.error('Seed hatası:', err);
    process.exit(1);
  });
}
