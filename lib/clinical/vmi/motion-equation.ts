export interface MotionEquationInput {
  flowLitersPerSecond: number
  volumeLiters: number
  resistanceCmH2OPerLps: number
  elastanceCmH2OPerLiter: number
  peepCmH2O: number
  muscularPressureCmH2O?: number
}

export function computeAirwayPressure(input: MotionEquationInput) {
  const resistivePressure = input.flowLitersPerSecond * input.resistanceCmH2OPerLps
  const elasticPressure = input.volumeLiters * input.elastanceCmH2OPerLiter
  const muscularPressure = input.muscularPressureCmH2O || 0

  return resistivePressure + elasticPressure + input.peepCmH2O - muscularPressure
}
