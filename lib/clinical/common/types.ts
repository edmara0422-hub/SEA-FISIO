export type ClinicalModule = 'home' | 'cardio' | 'vmi' | 'neuro'

export interface SignalWindow {
  sampleRateHz: number
  seconds: number
}

export interface LoopPoint {
  x: number
  y: number
}

export interface MetricValue {
  label: string
  value: number
  unit?: string
}
