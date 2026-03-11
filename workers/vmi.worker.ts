import { generateVentilatorWaveforms } from '@/lib/clinical/vmi/ventilator-engine'

type VMIWorkerRequest = {
  type: 'generate'
  payload: Parameters<typeof generateVentilatorWaveforms>[0]
}

self.onmessage = (event: MessageEvent<VMIWorkerRequest>) => {
  if (event.data.type !== 'generate') return

  const waveforms = generateVentilatorWaveforms(event.data.payload)
  self.postMessage({ type: 'generated', payload: waveforms })
}
