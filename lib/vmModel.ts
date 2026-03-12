/**
 * Modelo de curva de pressão das vias aéreas (ventilação mecânica).
 * Parâmetros: FR (irpm), I:E (ex.: 1:2), PEEP (cmH2O), pressão de pico (cmH2O).
 * Ciclo: subida na inspiração (rampa + platô), descida na expiração até PEEP.
 */

export interface VMParams {
  /** Frequência respiratória (irpm), ex.: 12 */
  fr: number
  /** Razão I:E (inspiração : expiração), ex.: 1/2 para 1:2 */
  ieRatio?: number // Ti/Te = 1/2 => Ti = 1/(1+2) do ciclo
  /** PEEP em cmH2O, ex.: 5 */
  peep: number
  /** Pressão de platô (pico) em cmH2O, ex.: 20 */
  peakPressure?: number
  /** Amostras por segundo */
  sampleRate?: number
  /** Quantos ciclos gerar */
  cycles?: number
}

export interface VentilationLegacyParams {
  respiratoryRate: number
  inspiratoryTime?: number
  peep?: number
  peakPressure?: number
  sampleRate?: number
  cycles?: number
}

/**
 * Gera pontos { t (s), pressure (cmH2O) } para um ciclo de VM.
 * Inspiração: rampa linear até pico, platô curto. Expiração: queda exponencial até PEEP.
 */
export function generateVMPressureData(params: VMParams): { t: number; pressure: number }[] {
  const {
    fr,
    ieRatio = 1 / 2,
    peep = 5,
    peakPressure = 20,
    sampleRate = 50,
    cycles = 4,
  } = params

  const periodSec = 60 / fr // período total (insp + exp)
  const ti = periodSec / (1 + 1 / ieRatio) // tempo inspiração
  const te = periodSec - ti // tempo expiração
  const plateauFraction = 0.15 // platô nos últimos 15% da inspiração
  const rampEnd = ti * (1 - plateauFraction)

  const points: { t: number; pressure: number }[] = []
  const step = 1 / sampleRate
  let t = 0

  for (let c = 0; c < cycles; c++) {
    // Inspiração: rampa 0 -> rampEnd, platô até ti
    for (let s = 0; s < ti; s += step) {
      let p = peep
      if (s < rampEnd) {
        p = peep + ((peakPressure - peep) * s) / rampEnd
      } else {
        p = peakPressure
      }
      points.push({ t, pressure: p })
      t += step
    }
    // Expiração: queda (exponencial ou linear) até PEEP
    const tau = te * 0.4 // constante de tempo da queda
    for (let s = 0; s < te; s += step) {
      const decay = 1 - Math.exp(-s / tau)
      const p = peakPressure - (peakPressure - peep) * decay
      points.push({ t, pressure: Math.max(peep, p) })
      t += step
    }
  }

  return points
}

/**
 * Compatibilidade com chamadas legadas que esperam um array de pressão.
 */
export function generateVentilationData(params: VentilationLegacyParams): number[] {
  const {
    respiratoryRate,
    inspiratoryTime,
    peep = 5,
    peakPressure = 20,
    sampleRate = 50,
    cycles = 4,
  } = params

  const ieRatio =
    inspiratoryTime && inspiratoryTime > 0 && inspiratoryTime < 1
      ? inspiratoryTime / (1 - inspiratoryTime)
      : 1 / 2

  return generateVMPressureData({
    fr: respiratoryRate,
    ieRatio,
    peep,
    peakPressure,
    sampleRate,
    cycles,
  }).map((point) => point.pressure)
}
