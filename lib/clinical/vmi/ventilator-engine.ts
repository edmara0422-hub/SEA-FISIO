import { mlToLiters } from '@/lib/clinical/common/units'
import { computeAirwayPressure } from '@/lib/clinical/vmi/motion-equation'

export interface VentilatorConfig {
  respiratoryRate: number
  ieRatio: number
  peepCmH2O: number
  targetTidalVolumeMl: number
  inspiratoryFlowLpm: number
  complianceMlPerCmH2O: number
  resistanceCmH2OPerLps: number
  sampleRateHz: number
  seconds: number
}

export const DEFAULT_VENTILATOR_CONFIG: VentilatorConfig = {
  respiratoryRate: 16,
  ieRatio: 0.5,
  peepCmH2O: 8,
  targetTidalVolumeMl: 460,
  inspiratoryFlowLpm: 48,
  complianceMlPerCmH2O: 34,
  resistanceCmH2OPerLps: 10,
  sampleRateHz: 120,
  seconds: 10,
}

export function generateVentilatorWaveforms(config: VentilatorConfig) {
  const totalSamples = Math.floor(config.sampleRateHz * config.seconds)
  const pressure = new Array<number>(totalSamples)
  const flow = new Array<number>(totalSamples)
  const volume = new Array<number>(totalSamples)

  const cycleTimeSec = 60 / config.respiratoryRate
  const inspiratoryTimeSec = cycleTimeSec * (config.ieRatio / (1 + config.ieRatio))
  const expiratoryTimeSec = cycleTimeSec - inspiratoryTimeSec
  const dt = 1 / config.sampleRateHz
  const targetVolumeL = mlToLiters(config.targetTidalVolumeMl)
  const elastanceCmH2OPerLiter = 1000 / config.complianceMlPerCmH2O
  const peakInspiratoryFlowLps = config.inspiratoryFlowLpm / 60
  let previousCyclePosition = 0
  let currentVolume = 0

  for (let sample = 0; sample < totalSamples; sample += 1) {
    const time = sample * dt
    const cyclePosition = time % cycleTimeSec

    if (sample > 0 && cyclePosition < previousCyclePosition) {
      currentVolume = 0
    }

    let currentFlow = 0

    if (cyclePosition <= inspiratoryTimeSec) {
      const progress = cyclePosition / Math.max(0.001, inspiratoryTimeSec)
      currentFlow = peakInspiratoryFlowLps * (1 - progress * 0.35)
    } else {
      const expTime = cyclePosition - inspiratoryTimeSec
      const decay = Math.exp(-expTime / Math.max(0.12, expiratoryTimeSec * 0.42))
      currentFlow = -peakInspiratoryFlowLps * 0.85 * decay
    }

    currentVolume = Math.max(0, Math.min(targetVolumeL, currentVolume + currentFlow * dt))

    flow[sample] = currentFlow
    volume[sample] = currentVolume
    pressure[sample] = computeAirwayPressure({
      flowLitersPerSecond: currentFlow,
      volumeLiters: currentVolume,
      resistanceCmH2OPerLps: config.resistanceCmH2OPerLps,
      elastanceCmH2OPerLiter,
      peepCmH2O: config.peepCmH2O,
    })
    previousCyclePosition = cyclePosition
  }

  return {
    pressure,
    flow,
    volume,
    meta: {
      cycleTimeSec,
      inspiratoryTimeSec,
      expiratoryTimeSec,
    },
  }
}
