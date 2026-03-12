export interface TimeSeriesData {
  timestamp: number[]
  value: number[]
  parameter: string
}

export interface PredictionResult {
  predicted: number[]
  confidence: number
  trend: 'improving' | 'stable' | 'worsening'
  nextValues: number[]
}

export class TimeSeriesPredictor {
  private ready = false

  async initialize() {
    this.ready = true
  }

  async predict(timeSeries: TimeSeriesData, lookAhead: number = 5): Promise<PredictionResult> {
    if (!this.ready) {
      await this.initialize()
    }

    const values = timeSeries.value.filter((value) => Number.isFinite(value))
    const safeLookAhead = Math.max(1, Math.floor(lookAhead))

    if (values.length === 0) {
      return {
        predicted: [0],
        confidence: 0,
        trend: 'stable',
        nextValues: Array.from({ length: safeLookAhead }, () => 0),
      }
    }

    const recentWindow = values.slice(-Math.min(values.length, 10))
    const lastValue = recentWindow[recentWindow.length - 1]

    if (recentWindow.length === 1) {
      return {
        predicted: [lastValue],
        confidence: 0.5,
        trend: 'stable',
        nextValues: Array.from({ length: safeLookAhead }, () => lastValue),
      }
    }

    const deltas = recentWindow.slice(1).map((value, index) => value - recentWindow[index])
    const averageDelta = deltas.reduce((sum, value) => sum + value, 0) / deltas.length
    const baseline = recentWindow.reduce((sum, value) => sum + value, 0) / recentWindow.length
    const variance =
      recentWindow.reduce((sum, value) => sum + (value - baseline) ** 2, 0) / recentWindow.length
    const normalizedVariance = Math.sqrt(variance) / Math.max(Math.abs(baseline), 1)
    const confidence = Math.max(0.35, Math.min(0.92, 0.88 - normalizedVariance * 0.25))

    const predicted = [lastValue + averageDelta]
    const nextValues = Array.from({ length: safeLookAhead }, (_, index) => lastValue + averageDelta * (index + 1))

    let trend: 'improving' | 'stable' | 'worsening' = 'stable'
    if (averageDelta < -0.1) {
      trend = 'improving'
    } else if (averageDelta > 0.1) {
      trend = 'worsening'
    }

    return {
      predicted,
      confidence,
      trend,
      nextValues,
    }
  }

  dispose() {
    this.ready = false
  }
}

export function analyzeCorrelation(
  data1: number[],
  data2: number[]
): { correlation: number; interpretation: string } {
  if (data1.length !== data2.length || data1.length < 2) {
    return { correlation: 0, interpretation: 'Dados insuficientes' }
  }

  const n = data1.length
  const mean1 = data1.reduce((a, b) => a + b, 0) / n
  const mean2 = data2.reduce((a, b) => a + b, 0) / n

  const numerator = data1.reduce((sum, x, i) => sum + (x - mean1) * (data2[i] - mean2), 0)
  const sum1 = Math.sqrt(data1.reduce((sum, x) => sum + (x - mean1) ** 2, 0))
  const sum2 = Math.sqrt(data2.reduce((sum, x) => sum + (x - mean2) ** 2, 0))

  const correlation = numerator / (sum1 * sum2 || 1)

  let interpretation = 'Sem correlação'
  if (correlation > 0.7) {
    interpretation = 'Forte correlação positiva'
  } else if (correlation > 0.4) {
    interpretation = 'Correlação positiva moderada'
  } else if (correlation < -0.7) {
    interpretation = 'Forte correlação negativa'
  } else if (correlation < -0.4) {
    interpretation = 'Correlação negativa moderada'
  }

  return { correlation, interpretation }
}

export function analyzeVolatility(data: number[]): {
  volatility: number
  risk: 'baixo' | 'moderado' | 'alto'
} {
  if (data.length < 2) {
    return { volatility: 0, risk: 'baixo' }
  }

  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length
  const volatility = Math.sqrt(variance)

  let risk: 'baixo' | 'moderado' | 'alto' = 'moderado'
  if (volatility < 5) {
    risk = 'baixo'
  } else if (volatility > 15) {
    risk = 'alto'
  }

  return { volatility, risk }
}

export function detectAnomalies(
  data: number[],
  threshold: number = 2.5
): Array<{ index: number; value: number; zscore: number }> {
  if (data.length < 3) return []

  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const stdDev = Math.sqrt(data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length)

  return data
    .map((value, index) => ({
      index,
      value,
      zscore: Math.abs((value - mean) / (stdDev || 1)),
    }))
    .filter((item) => item.zscore > threshold)
}
