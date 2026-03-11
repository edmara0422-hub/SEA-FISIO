export function calculateNeuroMetrics(signal: number[], sampleRateHz: number) {
  const rmsMicrovolts = Math.sqrt(
    signal.reduce((sum, sample) => sum + sample ** 2, 0) / Math.max(1, signal.length)
  )

  let peakCount = 0
  for (let index = 1; index < signal.length - 1; index += 1) {
    if (signal[index] > signal[index - 1] && signal[index] > signal[index + 1]) {
      peakCount += 1
    }
  }

  const zeroCrossings = signal.reduce((count, sample, index) => {
    if (index === 0) return count
    return count + (Math.sign(sample) !== Math.sign(signal[index - 1]) ? 1 : 0)
  }, 0)

  const dominantFrequencyEstimate = (zeroCrossings / 2) / (signal.length / sampleRateHz)
  const dominantBandLabel =
    dominantFrequencyEstimate < 4
      ? 'Delta'
      : dominantFrequencyEstimate < 8
        ? 'Theta'
        : dominantFrequencyEstimate < 12
          ? 'Alpha'
          : dominantFrequencyEstimate < 30
            ? 'Beta'
            : 'Gamma'

  return {
    rmsMicrovolts,
    peakCount,
    dominantBandLabel,
  }
}
