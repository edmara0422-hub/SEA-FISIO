export interface EEGEngineConfig {
  seconds: number
  sampleRateHz: number
  dominantFrequencyHz: number
  amplitudeMicrovolts: number
  noiseFactor?: number
}

export function generateEEGSignal(config: EEGEngineConfig) {
  const totalSamples = Math.floor(config.seconds * config.sampleRateHz)
  const signal = new Array<number>(totalSamples)

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / config.sampleRateHz
    const dominant =
      Math.sin(time * Math.PI * 2 * config.dominantFrequencyHz) *
      (config.amplitudeMicrovolts / 40)
    const harmonic =
      Math.sin(time * Math.PI * 2 * config.dominantFrequencyHz * 0.5) *
      (config.amplitudeMicrovolts / 75)
    const noise =
      Math.sin(time * 17) * (config.noiseFactor || 0) +
      Math.cos(time * 29) * ((config.noiseFactor || 0) * 0.4)

    signal[index] = dominant + harmonic + noise
  }

  return signal
}
