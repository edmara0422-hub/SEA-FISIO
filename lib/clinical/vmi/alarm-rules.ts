import type { VentilatorConfig } from '@/lib/clinical/vmi/ventilator-engine'
import { calculateVMIMetrics } from '@/lib/clinical/vmi/vmi-metrics'

export function evaluateVMIAlarms(config: VentilatorConfig) {
  const metrics = calculateVMIMetrics(config)
  const alarms: string[] = []

  if (metrics.drivingPressureCmH2O > 15) {
    alarms.push('Driving pressure acima da meta protetora.')
  }

  if (metrics.mechanicalPowerJMin > 17) {
    alarms.push('Mechanical power em faixa de maior risco.')
  }

  if (metrics.staticComplianceMlPerCmH2O < 25) {
    alarms.push('Compliance estatica baixa.')
  }

  return alarms
}
