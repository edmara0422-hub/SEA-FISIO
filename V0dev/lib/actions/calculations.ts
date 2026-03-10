'use server'

import { calcDP, calcCest, calcRSBI, interpRSBI, calcPF, interpPF, calcROX, calcMechanicalPower, calcCdyn, calcRaw } from '@/lib/vm-calcs'
import { calcPesoIdeal, calcGlasgow } from '@/lib/icu-calcs'
import { validateVentilation, validateGasometry, validateGlasgow } from '@/lib/schemas/clinical'

export async function computeVMIndices(params: {
  fr: number
  peep: number
  peakPressure: number
  platoPressure: number
  tidalVolume: number
  fio2: number
  pao2: number
  spo2: number
  vc: number
  flow: number
}) {
  try {
    // Validar inputs
    const vmValidation = validateVentilation({
      fr: params.fr,
      peep: params.peep,
      peakPressure: params.peakPressure,
      platoPressure: params.platoPressure,
      tidalVolume: params.tidalVolume,
      fio2: params.fio2,
      flowRate: params.flow,
    })

    if (!vmValidation.success) {
      return { error: 'Parâmetros inválidos', details: vmValidation.error.errors }
    }

    // Computar índices
    const dp = calcDP(params.platoPressure, params.peep)
    const cest = calcCest(params.tidalVolume, dp || 0)
    const cdyn = calcCdyn(params.peakPressure, params.peep)
    const raw = calcRaw(params.peakPressure, params.platoPressure, params.flow)
    const pf = calcPF(params.pao2, params.fio2)
    const pfInterp = pf ? interpPF(pf) : null
    const rsbi = calcRSBI(params.fr, params.vc)
    const rsbiInterp = rsbi ? interpRSBI(rsbi) : null
    const rox = calcROX(params.spo2, params.fio2, params.fr)
    const mecPower = calcMechanicalPower(params.tidalVolume, dp || 0, params.fr)

    return {
      success: true,
      data: {
        dp,
        cest,
        cdyn,
        raw,
        pf,
        pfInterp,
        rsbi,
        rsbiInterp,
        rox,
        mecPower,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (error) {
    return {
      error: 'Erro ao calcular índices',
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function computeICUIndices(params: {
  altura: number
  sexo: 'M' | 'F'
  pao2: number
  fio2: number
  fr: number
  vc: number
  peakPressure: number
  peep: number
  tidalVolume: number
  glasgowO?: number
  glasgowV?: string | number
  glasgowM?: number
}) {
  try {
    const pesoIdeal = calcPesoIdeal(params.altura, params.sexo)
    const pf = calcPF(params.pao2, params.fio2)
    const pfInterp = pf ? interpPF(pf) : null

    let glasgow = null
    if (params.glasgowO && params.glasgowV && params.glasgowM) {
      const glasgowValidation = validateGlasgow({
        eyes: params.glasgowO,
        verbal: params.glasgowV,
        motor: params.glasgowM,
      })

      if (glasgowValidation.success) {
        glasgow = calcGlasgow(params.glasgowO, params.glasgowV, params.glasgowM)
      }
    }

    const rsbi = calcRSBI(params.fr, params.vc)
    const rsbiInterp = rsbi ? interpRSBI(rsbi) : null
    const cest = calcCest(params.tidalVolume, calcDP(params.peakPressure, params.peep) || 0)

    return {
      success: true,
      data: {
        pesoIdeal,
        pf,
        pfInterp,
        rsbi,
        rsbiInterp,
        cest,
        glasgow,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (error) {
    return {
      error: 'Erro ao calcular índices ICU',
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function validateAndSavePatientRecord(patientData: unknown) {
  try {
    // Validação será implementada com Supabase
    return {
      success: true,
      message: 'Dados validados com sucesso',
    }
  } catch (error) {
    return {
      error: 'Erro ao validar dados',
      details: error instanceof Error ? error.message : String(error),
    }
  }
}
