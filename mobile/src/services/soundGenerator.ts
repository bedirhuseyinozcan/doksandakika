function generateWavBase64(
  sampleRate: number,
  notes: Array<{ freq: number; durationMs: number; gain?: number }>
): string {
  let totalSamples = 0;
  for (const n of notes) {
    totalSamples += Math.floor(sampleRate * (n.durationMs / 1000));
  }

  const byteRate = sampleRate * 2; 
  const dataSize = totalSamples * 2;
  const headerSize = 44;
  const totalLength = headerSize + dataSize;
  const buffer = new Uint8Array(totalLength);
  const view = new DataView(buffer.buffer);

  buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46; // "RIFF"
  view.setUint32(4, 36 + dataSize, true);
  buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45; // "WAVE"

  // fmt Subchunk
  buffer[12] = 0x66; buffer[13] = 0x6d; buffer[14] = 0x74; buffer[15] = 0x20; // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, 2, true);  // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data Subchunk
  buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61; // "data"
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (const n of notes) {
    const count = Math.floor(sampleRate * (n.durationMs / 1000));
    const gain = n.gain ?? 0.3;
    for (let i = 0; i < count; i++) {
      const t = i / sampleRate;
      // Fade out envelope at the end of each note
      const envelope = 1 - (i / count) * 0.4;
      const sample = Math.sin(2 * Math.PI * n.freq * t) * gain * envelope * 32767;
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample)));
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  // Saf JavaScript Base64 dönüştürücü (Node.js Buffer veya tarayıcı btoa bağımlılığı yoktur)
  const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let base64 = '';
  const len = buffer.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = buffer[i];
    const b1 = i + 1 < len ? buffer[i + 1] : 0;
    const b2 = i + 2 < len ? buffer[i + 2] : 0;

    base64 += b64chars[(b0 >> 2) & 0x3f];
    base64 += b64chars[((b0 << 4) | (b1 >> 4)) & 0x3f];
    base64 += i + 1 < len ? b64chars[((b1 << 2) | (b2 >> 6)) & 0x3f] : '=';
    base64 += i + 2 < len ? b64chars[b2 & 0x3f] : '=';
  }

  return `data:audio/wav;base64,${base64}`;
}

const SAMPLE_RATE = 22050;

// 1. Dokunma / Tıklama Sesi (Kısa ve tok)
export const SOUND_TAP_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 580, durationMs: 25, gain: 0.2 },
]);

// 2. Doğru Tahmin / Başarı Zili (C5 - E5 - G5)
export const SOUND_SUCCESS_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 523.25, durationMs: 70, gain: 0.25 },
  { freq: 659.25, durationMs: 90, gain: 0.28 },
  { freq: 783.99, durationMs: 160, gain: 0.3 },
]);

// 3. Uyarı / İpucu Sesi
export const SOUND_WARNING_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 440, durationMs: 60, gain: 0.2 },
  { freq: 370, durationMs: 80, gain: 0.2 },
]);

// 4. Hata / Yanlış Tahmin (Tok düşük frekans)
export const SOUND_ERROR_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 220, durationMs: 90, gain: 0.25 },
  { freq: 160, durationMs: 140, gain: 0.28 },
]);

// 5. Galibiyet & Kupa Fanfarı (Büyük zafer)
export const SOUND_WIN_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 523.25, durationMs: 90, gain: 0.25 },
  { freq: 659.25, durationMs: 90, gain: 0.25 },
  { freq: 783.99, durationMs: 90, gain: 0.28 },
  { freq: 1046.5, durationMs: 240, gain: 0.32 },
]);

// 6. Hakem Düdüğü (Gerçek maç atmosferi)
export const SOUND_WHISTLE_URI = generateWavBase64(SAMPLE_RATE, [
  { freq: 2800, durationMs: 120, gain: 0.3 },
  { freq: 3100, durationMs: 140, gain: 0.35 },
  { freq: 2800, durationMs: 160, gain: 0.3 },
]);
