/**
 * Calculadoras VNI e VMI portadas apenas do vm-calcs.js legado.
 */

export type Tone = { t: string; c: string }

export type StressIndexParse = {
  value: number | null
  label: string
  ok: boolean
}

export type PeepOptimizationLevelInput = {
  peep: string | number
  plato: string | number
  si: string
}

export type PeepOptimizationResult = {
  index: number
  peep: number
  plato: number
  dp: number
  siLabel: string
  siOk: boolean
  dpClass: 'Otimo' | 'Aceitavel' | 'Elevado'
  score: number
}

export type HacorBaseFields = {
  fc: string
  ph: string
  gcs: string
  oxig: string
  fr: string
}

export type SofaFields = {
  resp: string
  cns: string
  cardio: string
  coag: string
  liver: string
  renal: string
}

export type GasoAnalysis = {
  tipo: string
  origem: string
  comp: string
  cor: string
  full: string
}

export function toNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(',', '.')
  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function calcDP(plato: number, peep: number): number | null {
  if (Number.isNaN(plato) || Number.isNaN(peep)) return null
  return plato - peep
}

export function interpDP(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v < 12) return { t: 'Otimo', c: '#4ade80' }
  if (v <= 15) return { t: 'Aceitavel', c: '#facc15' }
  return { t: 'Elevado', c: '#f87171' }
}

export function calcCest(vt: number, dp: number): number | null {
  if (Number.isNaN(vt) || Number.isNaN(dp) || dp === 0) return null
  return vt / dp
}

export function calcCdyn(vt: number, pico: number, peep: number): number | null {
  if ([vt, pico, peep].some((value) => Number.isNaN(value))) return null
  if (pico <= peep) return null
  return vt / (pico - peep)
}

export function calcRaw(pico: number, plato: number, fluxo: number): number | null {
  if ([pico, plato, fluxo].some((value) => Number.isNaN(value))) return null
  if (fluxo === 0) return null
  return (pico - plato) / (fluxo / 60)
}

export function parseStressIndex(value: string): StressIndexParse {
  const normalized = value.trim().replace(/\s/g, '')

  if (!normalized) {
    return { value: null, label: '-', ok: false }
  }

  if (normalized === '=1' || normalized === '1' || normalized === '1.0') {
    return { value: 1, label: '=1 (Ideal)', ok: true }
  }

  if (normalized === '>1') {
    return { value: 1.2, label: '>1 (Hiperdistensao)', ok: false }
  }

  if (normalized === '<1') {
    return { value: 0.8, label: '<1 (Colapso/Recrutavel)', ok: false }
  }

  const parsed = toNumber(normalized)
  if (parsed === null) {
    return { value: null, label: normalized, ok: false }
  }

  return {
    value: parsed,
    label: parsed.toFixed(2),
    ok: parsed >= 0.9 && parsed <= 1.1,
  }
}

export function calcPeepOptimization(levels: PeepOptimizationLevelInput[]): PeepOptimizationResult[] | null {
  const results: PeepOptimizationResult[] = []

  levels.forEach((level, index) => {
    const peep = toNumber(level.peep)
    const plato = toNumber(level.plato)
    if (peep === null || plato === null) return

    const dp = plato - peep
    const si = parseStressIndex(level.si)
    const dpClass = dp < 12 ? 'Otimo' : dp <= 15 ? 'Aceitavel' : 'Elevado'
    const score = (dp < 12 ? 3 : dp <= 15 ? 2 : 1) + (si.ok ? 3 : si.value !== null ? 1 : 0)

    results.push({
      index,
      peep,
      plato,
      dp,
      siLabel: si.label,
      siOk: si.ok,
      dpClass,
      score,
    })
  })

  if (!results.length) return null
  return results.sort((a, b) => b.score - a.score || a.dp - b.dp)
}

export function calcRecruitabilityByVolume(volInsp: number, volExp: number) {
  if ([volInsp, volExp].some((value) => Number.isNaN(value))) return null
  const difference = volInsp - volExp
  return { difference, recruitable: difference > 500 }
}

export function calcPVCompliance(lip: number, uip: number, volLip: number, volUip: number): number | null {
  if ([lip, uip, volLip, volUip].some((value) => Number.isNaN(value))) return null
  if (uip - lip <= 0) return null
  return (volUip - volLip) / (uip - lip)
}

export function calcSuggestedPeepFromLip(lip: number): number | null {
  if (Number.isNaN(lip)) return null
  return lip + 2
}

export function calcRSBI(fr: number, vc: number): number | null {
  if ([fr, vc].some((value) => Number.isNaN(value))) return null
  if (vc === 0) return null
  return fr / (vc / 1000)
}

export function interpRSBI(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v < 80) return { t: 'Favoravel ao desmame', c: '#4ade80' }
  if (v <= 105) return { t: 'Zona cinzenta', c: '#facc15' }
  return { t: 'Alto risco de falha', c: '#f87171' }
}

const HACOR_SCORE = {
  fc: { leq120: 0, ge121: 1 },
  ph: { ge735: 0, '730_734': 2, '725_729': 3, lt725: 4 },
  gcs: { '15': 0, '13_14': 2, '11_12': 5, le10: 10 },
  oxig: { ge201: 0, '176_200': 2, '151_175': 3, '126_150': 4, '101_125': 5, le100: 6 },
  fr: { le30: 0, '31_35': 1, '36_40': 2, '41_45': 3, ge46: 4 },
} as const

const HACOR_DX = {
  pneumonia: 2.5,
  choque_septico: 2.5,
  ards: 3,
  edema_cardiogenico: -4,
} as const

export function calcHacorBase(fields: HacorBaseFields): number | null {
  if ([fields.fc, fields.ph, fields.gcs, fields.oxig, fields.fr].every((value) => !String(value || '').trim())) {
    return null
  }

  const fc = HACOR_SCORE.fc[fields.fc as keyof typeof HACOR_SCORE.fc] ?? 0
  const ph = HACOR_SCORE.ph[fields.ph as keyof typeof HACOR_SCORE.ph] ?? 0
  const gcs = HACOR_SCORE.gcs[fields.gcs as keyof typeof HACOR_SCORE.gcs] ?? 0
  const oxig = HACOR_SCORE.oxig[fields.oxig as keyof typeof HACOR_SCORE.oxig] ?? 0
  const fr = HACOR_SCORE.fr[fields.fr as keyof typeof HACOR_SCORE.fr] ?? 0

  return fc + ph + gcs + oxig + fr
}

export function calcSofaTotal(fields: SofaFields): number {
  return [fields.resp, fields.cns, fields.cardio, fields.coag, fields.liver, fields.renal].reduce(
    (total, current) => {
      const value = toNumber(current)
      if (value === null || value < 0 || value > 4) return total
      return total + value
    },
    0
  )
}

export function calcUpdatedHacor(baseScore: number | null, diagnosis: string, sofaTotal: number): number | null {
  if (baseScore === null) return null
  const adjustment = HACOR_DX[diagnosis as keyof typeof HACOR_DX] ?? 0
  return baseScore + adjustment + 0.5 * sofaTotal
}

export function interpUpdatedHacor(v: number): { t: string; c: string; probability: string } | null {
  if (Number.isNaN(v)) return null
  if (v <= 7.0) return { t: 'Baixo', c: '#4ade80', probability: '~12,4%' }
  if (v < 7.5) return { t: 'Entre faixas', c: '#facc15', probability: '' }
  if (v <= 10.5) return { t: 'Moderado', c: '#facc15', probability: '~38,2%' }
  if (v < 11.0) return { t: 'Entre faixas', c: '#fb923c', probability: '' }
  if (v <= 14.0) return { t: 'Alto', c: '#fb923c', probability: '~67,1%' }
  return { t: 'Muito alto', c: '#f87171', probability: '>83,7%' }
}

export function calcROX(spo2: number, fio2: number, fr: number): number | null {
  if ([spo2, fio2, fr].some((value) => Number.isNaN(value))) return null
  if (fio2 === 0 || fr === 0) return null
  return (spo2 / fio2) * 100 / fr
}

export function interpROX(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 4.88) return { t: 'Menor risco de intubacao', c: '#4ade80' }
  if (v < 3.85) return { t: 'Alto risco de falha', c: '#f87171' }
  return { t: 'Zona intermediaria', c: '#facc15' }
}

export function calcAsynchronyIndex(events: number, totalCycles: number): number | null {
  if ([events, totalCycles].some((value) => Number.isNaN(value))) return null
  if (totalCycles === 0) return null
  return (events / totalCycles) * 100
}

export function interpAsynchronyIndex(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v > 10) return { t: 'Grave (>10%)', c: '#f87171' }
  return { t: 'Abaixo de 10%', c: '#4ade80' }
}

export function calcMechanicalPower(vcMl: number, dp: number, f: number): number | null {
  if ([vcMl, dp, f].some((value) => Number.isNaN(value))) return null
  return 0.098 * (vcMl / 1000) * dp * f
}

export function interpMechanicalPower(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v < 12) return { t: 'Normal', c: '#4ade80' }
  if (v <= 17) return { t: 'Injuria pulmonar', c: '#facc15' }
  if (v <= 22) return { t: 'SDRA leve', c: '#fb923c' }
  if (v <= 24) return { t: 'SDRA moderada', c: '#f87171' }
  if (v <= 27) return { t: 'SDRA severa', c: '#f87171' }
  return { t: 'Indicacao de ECMO', c: '#dc2626' }
}

export function calcVcByWeight(weightKg: number) {
  if (Number.isNaN(weightKg) || weightKg <= 0) return null
  return {
    protective: [Math.round(weightKg * 4), Math.round(weightKg * 6)] as const,
    conventional: [Math.round(weightKg * 6), Math.round(weightKg * 8)] as const,
  }
}

export function calcGlasgow(o: number, v: number | string, m: number) {
  if (v === 'T' || v === 't') {
    return {
      total: `${(o || 0) + (m || 0)}T`,
      interp: 'Intubado',
      cor: '#60a5fa',
    }
  }

  const total = (o || 0) + Number(v || 0) + (m || 0)
  if (total >= 15) return { total: 15, interp: 'Consciente e orientado', cor: '#4ade80' }
  if (total >= 13) return { total, interp: 'Disfuncao leve', cor: '#facc15' }
  if (total >= 9) return { total, interp: 'Disfuncao moderada', cor: '#fb923c' }
  return { total, interp: 'Coma', cor: '#f87171' }
}

export function analyzeGaso(gasoPH: number, gasoPaCO2: number, gasoHCO3: number): GasoAnalysis | null {
  if ([gasoPH, gasoPaCO2, gasoHCO3].some((value) => Number.isNaN(value))) return null

  let tipo = 'Normal'
  let origem = ''
  let comp = ''

  if (gasoPH < 7.35) {
    tipo = 'Acidose'
    if (gasoPaCO2 > 45 && gasoHCO3 < 22) {
      origem = 'Mista'
      comp = 'Nao compensada'
    } else if (gasoPaCO2 > 45) {
      origem = 'Respiratoria'
      comp = gasoHCO3 > 26 ? 'Parcial' : 'Nao compensada'
    } else if (gasoHCO3 < 22) {
      origem = 'Metabolica'
      comp = gasoPaCO2 < 35 ? 'Parcial' : 'Nao compensada'
    }
  } else if (gasoPH > 7.45) {
    tipo = 'Alcalose'
    if (gasoPaCO2 < 35 && gasoHCO3 > 26) {
      origem = 'Mista'
      comp = 'Nao compensada'
    } else if (gasoPaCO2 < 35) {
      origem = 'Respiratoria'
      comp = gasoHCO3 < 22 ? 'Parcial' : 'Nao compensada'
    } else if (gasoHCO3 > 26) {
      origem = 'Metabolica'
      comp = gasoPaCO2 > 45 ? 'Parcial' : 'Nao compensada'
    }
  }

  let cor = '#4ade80'
  if (tipo !== 'Normal') cor = '#facc15'
  if (origem === 'Mista' || comp === 'Nao compensada') cor = '#fb923c'
  if (gasoPH < 7.2 || gasoPH > 7.6) cor = '#f87171'

  return {
    tipo,
    origem,
    comp,
    cor,
    full: `${tipo}${origem ? ` ${origem}` : ''}${comp ? ` - ${comp}` : ''}`,
  }
}

export function calcPF(pao2: number, fio2: number): number | null {
  if ([pao2, fio2].some((value) => Number.isNaN(value))) return null
  if (fio2 === 0) return null
  return pao2 / (fio2 / 100)
}

export function interpPF(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 400) return { t: 'Normal', c: '#4ade80' }
  if (v >= 300) return { t: 'Preservado', c: '#4ade80' }
  if (v >= 200) return { t: 'SDRA leve', c: '#facc15' }
  if (v >= 100) return { t: 'SDRA moderada', c: '#fb923c' }
  return { t: 'SDRA grave', c: '#f87171' }
}

export function calcSF(spo2: number, fio2: number): number | null {
  if ([spo2, fio2].some((value) => Number.isNaN(value))) return null
  if (fio2 === 0) return null
  return spo2 / (fio2 / 100)
}

export function interpBE(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= -2 && v <= 2) return { t: 'Normal (-2 a +2)', c: '#4ade80' }
  if (v < -2) return { t: 'Excesso acido', c: '#facc15' }
  return { t: 'Excesso base', c: '#facc15' }
}

export function interpP01(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 1.5 && v <= 3.5) return { t: 'Drive normal (1.5-3.5)', c: '#4ade80' }
  if (v < 1.0) return { t: 'Drive hipo (<1.0)', c: '#f87171' }
  if (v < 1.5) return { t: 'Drive baixo-normal', c: '#facc15' }
  if (v <= 4.0) return { t: 'Drive levemente elevado', c: '#facc15' }
  return { t: 'Drive hiper (>4.0)', c: '#f87171' }
}

export function interpPocc(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 5 && v <= 10) return { t: 'Normal (5-10)', c: '#4ade80' }
  if (v < 5) return { t: 'Baixo (<5)', c: '#facc15' }
  return { t: 'Elevado (>10)', c: '#fb923c' }
}

export function calcPmusc(pocc: number): number | null {
  if (Number.isNaN(pocc)) return null
  return Math.abs(0.75 * pocc)
}

export function interpPmusc(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v < 5) return { t: 'Superassistencia (<5)', c: '#60a5fa' }
  if (v <= 10) return { t: 'Protecao diafragmatica (5-10)', c: '#4ade80' }
  if (v <= 13) return { t: 'Esforco moderado (10-13)', c: '#facc15' }
  return { t: 'Esforco excessivo (>13)', c: '#f87171' }
}

export function calcMrcTotal(values: Array<string | number>): number | null {
  if (values.length !== 12) return null
  const parsed = values.map((value) => toNumber(value))
  if (parsed.some((value) => value === null)) return null
  return (parsed as number[]).reduce((total, current) => total + current, 0)
}

export function interpMrc(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 48) return { t: 'Normal (>=48)', c: '#4ade80' }
  if (v >= 36) return { t: 'Fraqueza leve (36-47)', c: '#facc15' }
  if (v >= 24) return { t: 'Fraqueza mod. (24-35)', c: '#fb923c' }
  return { t: 'Grave (<24) ICU-AW', c: '#f87171' }
}

export function calcPermeTotal(values: Array<string | number>): number | null {
  if (values.length !== 7) return null
  const parsed = values.map((value) => toNumber(value))
  if (parsed.some((value) => value === null)) return null
  return (parsed as number[]).reduce((total, current) => total + current, 0)
}

export function interpPerme(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 16) return { t: 'Alta (16-21)', c: '#4ade80' }
  if (v >= 8) return { t: 'Moderada (8-15)', c: '#facc15' }
  return { t: 'Baixa (0-7)', c: '#f87171' }
}

export function interpIMS(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v >= 7) return { t: 'Alta (7-10)', c: '#4ade80' }
  if (v >= 4) return { t: 'Moderada (4-6)', c: '#facc15' }
  if (v >= 1) return { t: 'Baixa (1-3)', c: '#fb923c' }
  return { t: 'Imobilidade (0)', c: '#f87171' }
}

export function calcVDVT(paCO2: number, petCO2: number): number | null {
  if ([paCO2, petCO2].some((value) => Number.isNaN(value))) return null
  if (paCO2 === 0) return null
  return (paCO2 - petCO2) / paCO2
}

export function interpVDVT(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v <= 0.4) return { t: 'Normal', c: '#4ade80' }
  if (v <= 0.6) return { t: 'Elevado', c: '#facc15' }
  return { t: 'Grave', c: '#f87171' }
}

export function calcVentilatoryRatio(ve: number, paCO2: number, weightKg: number): number | null {
  if ([ve, paCO2, weightKg].some((value) => Number.isNaN(value) || value <= 0)) return null
  const vePredicted = 0.1 * weightKg
  return (ve * paCO2) / (vePredicted * 40)
}

export function interpVentilatoryRatio(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v <= 1.2) return { t: 'Troca de CO2 ideal', c: '#4ade80' }
  if (v <= 2.0) return { t: 'Ineficiencia moderada', c: '#facc15' }
  return { t: 'Ineficiencia grave', c: '#f87171' }
}

export function calcCO2Gap(paCO2: number, etCO2: number): number | null {
  if ([paCO2, etCO2].some((value) => Number.isNaN(value))) return null
  return paCO2 - etCO2
}

export function interpCO2Gap(v: number): Tone | null {
  if (Number.isNaN(v)) return null
  if (v <= 5) return { t: 'Fisiologico', c: '#4ade80' }
  if (v <= 10) return { t: 'Elevado', c: '#facc15' }
  return { t: 'Grave', c: '#f87171' }
}

export function summarizeWeaningCriteria(piMax: number | null, peMax: number | null, cvMlKg: number | null) {
  let passed = 0
  let total = 0

  if (piMax !== null && !Number.isNaN(piMax)) {
    total += 1
    if (Math.abs(piMax) >= 30) passed += 1
  }

  if (peMax !== null && !Number.isNaN(peMax)) {
    total += 1
    if (Math.abs(peMax) >= 40) passed += 1
  }

  if (cvMlKg !== null && !Number.isNaN(cvMlKg)) {
    total += 1
    if (cvMlKg >= 10) passed += 1
  }

  if (!total) return null

  return {
    passed,
    total,
    c: passed === total ? '#4ade80' : passed >= total - 1 ? '#facc15' : '#f87171',
    t: `${passed}/${total} criterios basicos`,
  }
}
