export const PHYSIOLOGIC_LIMITS = {
  cardio: {
    bpm: { min: 20, max: 220 },
  },
  vmi: {
    respiratoryRate: { min: 4, max: 45 },
    peepCmH2O: { min: 0, max: 24 },
    complianceMlPerCmH2O: { min: 5, max: 120 },
    resistanceCmH2OPerLps: { min: 1, max: 60 },
  },
  neuro: {
    dominantFrequencyHz: { min: 0.5, max: 80 },
  },
} as const

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
