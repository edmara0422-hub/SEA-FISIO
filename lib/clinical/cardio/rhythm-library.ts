export interface RhythmPreset {
  id: string
  label: string
  bpm: number
  pAmplitudeMv: number
  qrsAmplitudeMv: number
  tAmplitudeMv: number
  prIntervalMs: number
  qrsWidthMs: number
  qtIntervalMs: number
  noiseFactor: number
}

export const RHYTHM_LIBRARY: Record<string, RhythmPreset> = {
  sinus: {
    id: 'sinus',
    label: 'Ritmo sinusal',
    bpm: 72,
    pAmplitudeMv: 0.14,
    qrsAmplitudeMv: 1.2,
    tAmplitudeMv: 0.32,
    prIntervalMs: 160,
    qrsWidthMs: 92,
    qtIntervalMs: 390,
    noiseFactor: 0.008,
  },
  tachycardia: {
    id: 'tachycardia',
    label: 'Taquicardia sinusal',
    bpm: 126,
    pAmplitudeMv: 0.12,
    qrsAmplitudeMv: 1.1,
    tAmplitudeMv: 0.28,
    prIntervalMs: 140,
    qrsWidthMs: 88,
    qtIntervalMs: 340,
    noiseFactor: 0.01,
  },
}
