import { generateECGSignal } from '@/lib/clinical/cardio/ecg-engine'

type ECGWorkerRequest = {
  type: 'generate'
  payload: Parameters<typeof generateECGSignal>[0]
}

self.onmessage = (event: MessageEvent<ECGWorkerRequest>) => {
  if (event.data.type !== 'generate') return

  const signal = generateECGSignal(event.data.payload)
  self.postMessage({ type: 'generated', payload: signal })
}
