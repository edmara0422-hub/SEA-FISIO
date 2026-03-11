export function calculateCardioMetrics(config: {
  bpm: number
  prIntervalMs: number
  qrsWidthMs: number
  qtIntervalMs: number
}) {
  const rrIntervalMs = Math.round(60000 / config.bpm)
  const qtcBazettMs = Math.round(config.qtIntervalMs / Math.sqrt(rrIntervalMs / 1000))

  return {
    bpm: config.bpm,
    rrIntervalMs,
    prIntervalMs: config.prIntervalMs,
    qrsWidthMs: config.qrsWidthMs,
    qtcBazettMs,
  }
}
