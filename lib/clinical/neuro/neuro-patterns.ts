export interface EEGPatternPreset {
  id: string
  label: string
  dominantFrequencyHz: number
  amplitudeMicrovolts: number
  noiseFactor: number
}

export const EEG_PATTERNS: Record<string, EEGPatternPreset> = {
  alpha: {
    id: 'alpha',
    label: 'Ritmo alfa',
    dominantFrequencyHz: 10,
    amplitudeMicrovolts: 34,
    noiseFactor: 0.34,
  },
  beta: {
    id: 'beta',
    label: 'Ritmo beta',
    dominantFrequencyHz: 18,
    amplitudeMicrovolts: 18,
    noiseFactor: 0.4,
  },
}
