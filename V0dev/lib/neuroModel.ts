/**
 * Modelo de simulação de Atividade Neural
 * Gera séries temporais realistas baseadas em modelos de propagação neural
 * Referência: Ritmos EEG simplificados e propagação de ativação
 */

interface NeuralActivityConfig {
  duration: number // segundos
  sampleRate: number // Hz
  frequency: number // frequência dominante (Hz) - para ritmo oscilatório
  amplitude: number // amplitude da oscilação
  burstProbability?: number // probabilidade de "bursts" de atividade (0-1)
}

/**
 * Gera sinal neural com características oscilatórias realistas
 * Simula ritmo alfa (~10Hz), beta (~20Hz) ou theta (~6Hz)
 */
export function generateNeuralSignal(config: NeuralActivityConfig): number[] {
  const { duration, sampleRate, frequency, amplitude, burstProbability = 0.3 } = config

  const totalSamples = Math.floor(duration * sampleRate)
  const data: number[] = []

  for (let i = 0; i < totalSamples; i++) {
    const timeInSeconds = i / sampleRate

    // Oscilação principal (frequência pura)
    let signal = amplitude * Math.sin(2 * Math.PI * frequency * timeInSeconds)

    // Modulação em envelope (ampliação e redução graduais)
    const envelopeFrequency = 0.5 // Hz - mudanças lentas
    const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * envelopeFrequency * timeInSeconds)
    signal *= envelope

    // Adiciona "bursts" ocasionais (explosões de atividade)
    if (Math.random() < burstProbability / sampleRate) {
      const burstDuration = Math.floor(sampleRate * 0.2) // 200ms
      for (let j = 0; j < burstDuration && i + j < totalSamples; j++) {
        const burstAmplitude = amplitude * 1.5
        const burstPhase = 2 * Math.PI * frequency * (i + j) / sampleRate
        data[i + j] = (data[i + j] || 0) + burstAmplitude * Math.sin(burstPhase)
      }
    }

    // Ruído rosa (1/f noise) para mais realismo
    const pinkNoise = generatePinkNoise(i) * amplitude * 0.1
    signal += pinkNoise

    data.push(signal)
  }

  return data
}

/**
 * Gera padrões de ativação neural em rede
 * Simula propagação de atividade através de regiões conectadas
 */
export function generateNeuralNetworkActivity(config: {
  numberOfNodes: number
  duration: number
  sampleRate: number
  propagationSpeed: number // 0-1, como fração da rede
  activationThreshold?: number
}): number[][] {
  const { numberOfNodes, duration, sampleRate, propagationSpeed, activationThreshold = 0.6 } = config

  const totalSamples = Math.floor(duration * sampleRate)
  const activity: number[][] = Array(numberOfNodes)
    .fill(null)
    .map(() => Array(totalSamples).fill(0))

  // Inicia ativação em nós aleatórios
  const activeNodes = new Set<number>()
  for (let i = 0; i < numberOfNodes * 0.2; i++) {
    activeNodes.add(Math.floor(Math.random() * numberOfNodes))
  }

  // Simula propagação ao longo do tempo
  for (let t = 0; t < totalSamples; t++) {
    const timeInSeconds = t / sampleRate

    for (const nodeIdx of activeNodes) {
      // Decaimento exponencial da ativação
      const baseActivation = Math.exp(-timeInSeconds / 0.5) // 500ms decay
      activity[nodeIdx][t] = baseActivation * Math.sin(2 * Math.PI * 10 * timeInSeconds)

      // Propagação para nós vizinhos
      if (Math.random() < propagationSpeed) {
        const neighborCount = Math.floor(numberOfNodes * 0.1)
        for (let i = 0; i < neighborCount; i++) {
          const neighbor = Math.floor(Math.random() * numberOfNodes)
          if (!activeNodes.has(neighbor)) {
            activeNodes.add(neighbor)
          }
        }
      }
    }

    // Cleanup: remove nós que decairam muito
    activeNodes.forEach((nodeIdx) => {
      if (Math.abs(activity[nodeIdx][t]) < activationThreshold * 0.1) {
        activeNodes.delete(nodeIdx)
      }
    })

    // Ocasionalmente inicia nova onda de ativação
    if (Math.random() < 0.01) {
      for (let i = 0; i < 3; i++) {
        activeNodes.add(Math.floor(Math.random() * numberOfNodes))
      }
    }
  }

  return activity
}

/**
 * Gera série temporal de "disparos" neurais (spike times)
 * Simula trens de potenciais de ação
 */
export function generateSpikeTrain(config: {
  duration: number
  firingRate: number // Hz (disparos por segundo, média)
  refractoryPeriod?: number // ms
  burstiness?: number // 0-1, quanto mais próximos os disparos
}): number[] {
  const { duration, firingRate, refractoryPeriod = 2, burstiness = 0.5 } = config

  const spikes: number[] = []
  const refractoryMs = refractoryPeriod
  let lastSpikeTime = -refractoryMs

  const meanInterval = 1000 / firingRate // ms entre disparos

  for (let t = 0; t < duration * 1000; t += 1) {
    const timeSinceLast = t - lastSpikeTime

    if (timeSinceLast > refractoryMs) {
      // Intervalos entre disparos seguem distribuição com variabilidade
      const expectedInterval = meanInterval * (1 - burstiness + Math.random() * burstiness)

      if (Math.random() < (1000 / expectedInterval) / 1000) {
        spikes.push(t)
        lastSpikeTime = t
      }
    }
  }

  return spikes
}

/**
 * Ruído rosa (1/f) - mais realista para sinais neurais
 * Usar gerador de estado interno para consistência
 */
let pinkNoiseBuffer = { value: 0 }

function generatePinkNoise(seed: number): number {
  // Implementação simplificada de Voss-McCartney
  const rand = Math.sin(seed * 12.9898) * 43758.5453
  pinkNoiseBuffer.value = 0.99 * pinkNoiseBuffer.value + (rand - Math.floor(rand))
  return pinkNoiseBuffer.value
}

/**
 * Calcula características do sinal neural
 */
export function analyzeNeuralSignal(signal: number[]) {
  if (signal.length === 0) return null

  const mean = signal.reduce((a, b) => a + b, 0) / signal.length
  const variance = signal.reduce((sum, x) => sum + (x - mean) ** 2, 0) / signal.length
  const stdDev = Math.sqrt(variance)

  // Encontra picos (máximos locais)
  const peaks = []
  for (let i = 1; i < signal.length - 1; i++) {
    if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
      peaks.push({ index: i, value: signal[i] })
    }
  }

  return {
    mean,
    stdDev,
    min: Math.min(...signal),
    max: Math.max(...signal),
    peakCount: peaks.length,
    peaks: peaks.slice(0, 10), // Top 10 peaks
  }
}
