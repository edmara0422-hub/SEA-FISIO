import dynamic from 'next/dynamic'

const d = (loader: () => Promise<{ [k: string]: React.ComponentType<{ className?: string }> }>, name: string) =>
  dynamic(() => loader().then(m => m[name]), { ssr: false })

export const NEURO_SIMS: Record<string, React.ComponentType<{ className?: string }>> = {
  'neuro-pump': d(() => import('@/components/experience/neuro-pump-sim'), 'NeuroPumpSim'),
  'neuro-action-potential': d(() => import('@/components/experience/neuro-action-potential-sim'), 'NeuroActionPotentialSim'),
  'neuro-tube': d(() => import('@/components/experience/neuro-tube-sim'), 'NeuroTubeSim'),
  'neuro-synapse-timeline': d(() => import('@/components/experience/neuro-synapse-timeline-sim'), 'NeuroSynapseTimelineSim'),
  'neuro-neuron-anatomy': d(() => import('@/components/experience/neuro-neuron-anatomy-sim'), 'NeuroNeuronAnatomySim'),
  'neuro-glia-ecosystem': d(() => import('@/components/experience/neuro-glia-ecosystem-sim'), 'NeuroGliaEcosystemSim'),
  'neuro-axon-transport': d(() => import('@/components/experience/neuro-axon-transport-sim'), 'NeuroAxonTransportSim'),
  'neuro-saltatory-conduction': d(() => import('@/components/experience/neuro-saltatory-conduction-sim'), 'NeuroSaltatoryConductionSim'),
  'neuro-neuron-types': d(() => import('@/components/experience/neuro-neuron-types-sim'), 'NeuroNeuronTypesSim'),
  'neuro-metabolic-chain': d(() => import('@/components/experience/neuro-metabolic-chain-sim'), 'NeuroMetabolicChainSim'),
  'neuro-bhe': d(() => import('@/components/experience/neuro-bhe-sim'), 'NeuroBHESim'),
  'neuro-glia-support': d(() => import('@/components/experience/neuro-glia-support-sim'), 'NeuroGliaSupportSim'),
}
