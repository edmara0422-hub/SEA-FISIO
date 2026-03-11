export const ML_PER_LITER = 1000
export const SECONDS_PER_MINUTE = 60

export function mlToLiters(volumeMl: number) {
  return volumeMl / ML_PER_LITER
}

export function litersToMl(volumeLiters: number) {
  return volumeLiters * ML_PER_LITER
}
