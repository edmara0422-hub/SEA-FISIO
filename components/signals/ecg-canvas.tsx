'use client'

import { useMemo } from 'react'
import { generateECGSignal } from '@/lib/clinical/cardio/ecg-engine'
import { RHYTHM_LIBRARY } from '@/lib/clinical/cardio/rhythm-library'
import { SignalCanvas } from '@/components/signals/signal-canvas'

export function ECGCanvas() {
  const rhythm = RHYTHM_LIBRARY.sinus
  const signal = useMemo(
    () =>
      generateECGSignal({
        bpm: rhythm.bpm,
        sampleRateHz: 500,
        seconds: 4,
        pAmplitudeMv: rhythm.pAmplitudeMv,
        qrsAmplitudeMv: rhythm.qrsAmplitudeMv,
        tAmplitudeMv: rhythm.tAmplitudeMv,
        prIntervalMs: rhythm.prIntervalMs,
        qrsWidthMs: rhythm.qrsWidthMs,
        qtIntervalMs: rhythm.qtIntervalMs,
        noiseFactor: rhythm.noiseFactor,
      }),
    [rhythm]
  )

  return (
    <SignalCanvas
      title="Derivacao DII | Canvas foundation"
      subtitle="Renderer novo para sweep clinico e ritmos reais."
      samples={signal}
      stroke="rgba(248,113,113,0.95)"
      height={360}
      gain={115}
      verticalOrigin={0.5}
      speed={1.8}
    />
  )
}
