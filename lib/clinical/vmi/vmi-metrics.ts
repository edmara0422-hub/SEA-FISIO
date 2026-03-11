import type { VentilatorConfig } from '@/lib/clinical/vmi/ventilator-engine'

export function calculateVMIMetrics(config: VentilatorConfig) {
  const drivingPressureCmH2O = config.targetTidalVolumeMl / config.complianceMlPerCmH2O
  const plateauPressureCmH2O = config.peepCmH2O + drivingPressureCmH2O
  const staticComplianceMlPerCmH2O = config.targetTidalVolumeMl / Math.max(0.1, drivingPressureCmH2O)
  const mechanicalPowerJMin =
    0.098 *
    config.respiratoryRate *
    ((config.targetTidalVolumeMl / 1000) *
      (plateauPressureCmH2O - 0.5 * drivingPressureCmH2O))

  return {
    drivingPressureCmH2O,
    plateauPressureCmH2O,
    staticComplianceMlPerCmH2O,
    mechanicalPowerJMin,
  }
}
