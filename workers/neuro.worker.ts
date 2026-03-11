import { generateEEGSignal } from '@/lib/clinical/neuro/eeg-engine'

type NeuroWorkerRequest = {
  type: 'generate'
  payload: Parameters<typeof generateEEGSignal>[0]
}

self.onmessage = (event: MessageEvent<NeuroWorkerRequest>) => {
  if (event.data.type !== 'generate') return

  const signal = generateEEGSignal(event.data.payload)
  self.postMessage({ type: 'generated', payload: signal })
}
