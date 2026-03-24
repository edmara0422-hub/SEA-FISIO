import dynamic from 'next/dynamic'

const d = (loader: () => Promise<{ [k: string]: React.ComponentType<{ className?: string }> }>, name: string) =>
  dynamic(() => loader().then(m => m[name]), { ssr: false })

export const RESPIRATORY_SIMS: Record<string, React.ComponentType<{ className?: string }>> = {
  'respiratory-system': d(() => import('@/components/experience/respiratory-system-sim'), 'RespiratorySystemSim'),
  'respiratory-gas-exchange': d(() => import('@/components/experience/respiratory-gas-exchange-sim'), 'RespiratoryGasExchangeSim'),
  'respiratory-defense': d(() => import('@/components/experience/respiratory-defense-sim'), 'RespiratoryDefenseSim'),
  'respiratory-membrane': d(() => import('@/components/experience/respiratory-membrane-sim'), 'RespiratoryMembraneSim'),
  'respiratory-cough': d(() => import('@/components/experience/respiratory-cough-sim'), 'RespiratoryCoughSim'),
  'respiratory-ventilation': d(() => import('@/components/experience/respiratory-ventilation-sim'), 'RespiratoryVentilationSim'),
  'respiratory-oxyhb-curve': d(() => import('@/components/experience/respiratory-oxyhb-curve-sim'), 'RespiratoryOxyHbCurveSim'),
  'respiratory-control': d(() => import('@/components/experience/respiratory-control-sim'), 'RespiratoryControlSim'),
  'respiratory-volumes': d(() => import('@/components/experience/respiratory-volumes-sim'), 'RespiratoryVolumesSim'),
  'respiratory-oxytherapy': d(() => import('@/components/experience/respiratory-oxytherapy-sim'), 'RespiratoryOxytherapySim'),
  'respiratory-spirometry': d(() => import('@/components/experience/respiratory-spirometry-sim'), 'RespiratorySpirometrySim'),
  'respiratory-vni-modes': d(() => import('@/components/experience/respiratory-vni-modes-sim'), 'RespiratoryVniModesSim'),
  'respiratory-vmi-ventilator': d(() => import('@/components/experience/respiratory-vmi-ventilator-sim'), 'RespiratoryVmiVentilatorSim'),
  'respiratory-vmi-peep': d(() => import('@/components/experience/respiratory-vmi-peep-sim'), 'RespiratoryVmiPeepSim'),
  'respiratory-vmi-mechanics': d(() => import('@/components/experience/respiratory-vmi-mechanics-sim'), 'RespiratoryVmiMechanicsSim'),
  'respiratory-vmi-asynchrony': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'RespiratoryVmiAsynchronySim'),
  'async-ineffective': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncIneffectiveSim'),
  'async-double': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncDoubleSim'),
  'async-reverse': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncReverseSim'),
  'async-auto': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncAutoSim'),
  'async-premature': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncPrematureSim'),
  'async-delayed': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncDelayedSim'),
  'async-flow-starve': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncFlowStarveSim'),
  'async-flow-excess': d(() => import('@/components/experience/respiratory-vmi-asynchrony-sim'), 'AsyncFlowExcessSim'),
  'respiratory-vmi-stress-index': d(() => import('@/components/experience/respiratory-vmi-stress-index-sim'), 'RespiratoryVmiStressIndexSim'),
  'respiratory-vmi-psv-cycling': d(() => import('@/components/experience/respiratory-vmi-psv-cycling-sim'), 'RespiratoryVmiPsvCyclingSim'),
  'respiratory-vmi-vcv-analysis': d(() => import('@/components/experience/respiratory-vmi-vcv-analysis-sim'), 'RespiratoryVmiVcvAnalysisSim'),
  'respiratory-vmi-pcv-analysis': d(() => import('@/components/experience/respiratory-vmi-pcv-analysis-sim'), 'RespiratoryVmiPcvAnalysisSim'),
  'respiratory-vmi-psv-analysis': d(() => import('@/components/experience/respiratory-vmi-psv-analysis-sim'), 'RespiratoryVmiPsvAnalysisSim'),
  'respiratory-vmi-loops': d(() => import('@/components/experience/respiratory-vmi-loops-sim'), 'RespiratoryVmiLoopsSim'),
}
