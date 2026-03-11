import type { LoopPoint } from '@/lib/clinical/common/types'

export function buildPVLoop(volume: number[], pressure: number[]): LoopPoint[] {
  return volume.map((sample, index) => ({
    x: sample,
    y: pressure[index] || 0,
  }))
}

export function buildFVLoop(flow: number[], volume: number[]): LoopPoint[] {
  return volume.map((sample, index) => ({
    x: sample,
    y: flow[index] || 0,
  }))
}
