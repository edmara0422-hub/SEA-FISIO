import { clamp } from '@/lib/clinical/common/constraints'

export interface ECGEngineConfig {
  bpm: number
  sampleRateHz: number
  seconds: number
  pAmplitudeMv: number
  qrsAmplitudeMv: number
  tAmplitudeMv: number
  prIntervalMs: number
  qrsWidthMs: number
  qtIntervalMs: number
  noiseFactor?: number
}

function gaussian(t: number, center: number, width: number, amplitude: number) {
  return amplitude * Math.exp(-((t - center) ** 2) / (2 * width * width))
}

export function generateECGSignal(config: ECGEngineConfig) {
  const bpm = clamp(config.bpm, 20, 220)
  const periodSec = 60 / bpm
  const totalSamples = Math.floor(config.seconds * config.sampleRateHz)
  const samples = new Array<number>(totalSamples)

  const prSec = config.prIntervalMs / 1000
  const qrsSec = config.qrsWidthMs / 1000
  const qtSec = config.qtIntervalMs / 1000

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / config.sampleRateHz
    const localTime = time % periodSec

    let value = 0
    value += gaussian(localTime, 0.08, 0.02, config.pAmplitudeMv)
    value += gaussian(localTime, prSec + 0.02, qrsSec * 0.16, -config.qrsAmplitudeMv * 0.12)
    value += gaussian(localTime, prSec + qrsSec * 0.45, qrsSec * 0.18, config.qrsAmplitudeMv)
    value += gaussian(localTime, prSec + qrsSec * 0.72, qrsSec * 0.18, -config.qrsAmplitudeMv * 0.22)
    value += gaussian(localTime, Math.min(periodSec - 0.12, qtSec), 0.06, config.tAmplitudeMv)

    const baselineDrift = Math.sin(time * Math.PI * 0.4) * 0.012
    const noise = Math.sin(time * 37.0) * (config.noiseFactor || 0)

    samples[index] = value + baselineDrift + noise
  }

  return samples
}
