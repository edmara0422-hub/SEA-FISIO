'use client'

import { useMemo } from 'react'
import { SignalCanvas } from '@/components/signals/signal-canvas'
import { DEFAULT_VENTILATOR_CONFIG, generateVentilatorWaveforms } from '@/lib/clinical/vmi/ventilator-engine'

export function VMWaveCanvas() {
  const waveforms = useMemo(
    () => generateVentilatorWaveforms(DEFAULT_VENTILATOR_CONFIG),
    []
  )

  return (
    <div className="space-y-5">
      <SignalCanvas
        title="Pressao de vias aereas"
        subtitle="Curva derivada da equacao de movimento."
        samples={waveforms.pressure}
        stroke="rgba(56,189,248,0.95)"
        height={170}
        gain={5.2}
        verticalOrigin={0.88}
        speed={1.1}
      />
      <SignalCanvas
        title="Fluxo"
        samples={waveforms.flow}
        stroke="rgba(34,197,94,0.95)"
        height={170}
        gain={72}
        verticalOrigin={0.5}
        speed={1.1}
      />
      <SignalCanvas
        title="Volume"
        samples={waveforms.volume}
        stroke="rgba(250,204,21,0.95)"
        height={170}
        gain={160}
        verticalOrigin={0.9}
        speed={1.1}
      />
    </div>
  )
}
