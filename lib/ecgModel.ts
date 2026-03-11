/**
 * Modelo de ECG (derivação DII) com morfologia P–QRS–T realista.
 * Parâmetros: FC (bpm), taxa de amostragem (Hz). Retorna pontos { t (s), value (mV) }.
 * Durações típicas: P ~80ms, PR ~120–200ms, QRS ~80–100ms, QT ~350–440ms.
 */

const PR_INTERVAL = 0.16
const QT_INTERVAL = 0.38

function gaussian(t: number, center: number, width: number, amp: number): number {
  return amp * Math.exp(-((t - center) ** 2) / (2 * width * width))
}

/**
 * Gera um batimento cardíaco (um ciclo P-QRS-T) em mV, começando em t=0.
 * t em segundos. Forma aproximada: P pequena positiva, QRS (Q neg, R alto, S neg), T positiva.
 */
function oneBeat(t: number): number {
  if (t < 0 || t > QT_INTERVAL + 0.1) return 0
  let v = 0
  // Onda P (positiva em DII)
  v += gaussian(t, 0.04, 0.02, 0.15)
  // Q (negativa)
  v += gaussian(t, PR_INTERVAL + 0.02, 0.015, -0.1)
  // R (alta positiva)
  v += gaussian(t, PR_INTERVAL + 0.05, 0.02, 1.2)
  // S (negativa)
  v += gaussian(t, PR_INTERVAL + 0.08, 0.02, -0.25)
  // T (positiva, arredondada)
  v += gaussian(t, PR_INTERVAL + 0.2, 0.06, 0.35)
  return v
}

export interface ECGParams {
  /** Batimentos por minuto (ex.: 72) */
  bpm: number
  /** Amostras por segundo (ex.: 250) */
  sampleRate?: number
  /** Quantos batimentos gerar */
  beats?: number
}

/**
 * Retorna array de pontos { t, value } para ECG em loop (vários batimentos).
 */
export function generateECGData(params: ECGParams): { t: number; value: number }[] {
  const { bpm, sampleRate = 250, beats = 4 } = params
  const periodSec = 60 / bpm
  const points: { t: number; value: number }[] = []
  const step = 1 / sampleRate
  for (let beat = 0; beat < beats; beat++) {
    const t0 = beat * periodSec
    for (let s = 0; s < periodSec; s += step) {
      const t = t0 + s
      points.push({ t, value: oneBeat(s) })
    }
  }
  return points
}
