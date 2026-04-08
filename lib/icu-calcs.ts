/**
 * Cálculos do Prontuário ICU (referência do projeto antigo)
 */

export type SedativeEntry = {
  droga: string
  inicio: string
  atual: string
  unidade: string
  suspensao?: string
}

export type BNMEntry = {
  droga: string
  inicio: string
  atual: string
  unidade: string
  suspensao?: string
}

export type DVAEntry = {
  droga: string
  inicio: string
  dose: string
  unidade: string
  suspensao?: string
}

export type LabExamEntry = {
  data: string
  hb: string
  ht: string
  leuco: string
  plaq: string
  creat: string
  ureia: string
  k: string
  na: string
  lac: string
  pcr: string
  bt: string
  alb: string
  tgo: string
  tgp: string
  inr: string
}

export type ImageExamEntry = {
  data: string
  tipo: string
  laudo: string
  achados: string[]
}

export type GasometryHistoryEntry = {
  ts: string
  data: string
  hora: string
  pH: string
  paCO2: string
  paO2: string
  hco3: string
  be: string
  sao2: string
  lactato: string
  fio2: string
  sf: string
  pf: string
  analise: string
  obs: string
}

export type VMHistoryEntry = {
  ts: string
  modo: string
  vt: string
  vc: string
  ve: string
  fr: string
  peep: string
  fio2: string
  fluxo: string
  trigger: string
  ti: string
  ie: string
  ppico: string
  pplato: string
  pmean: string
  ps: string
  ciclagem: string
  rampa: string
  ipap: string
  epap: string
  p01: string
  pocc: string
  p1: string
  p2: string
  si: string
  pmusc: string
  dp: string
  cest: string
  cdyn: string
  raw: string
  mp: string
  pf: string
}

export type PeepOptEntry = {
  peep: string
  plato: string
  si: string
}

export type MraRow = {
  plato: string
  peep: string
  cest: string
  sat: string
  pam: string
  best: boolean
}

export type TitRow = {
  pico: string
  plato: string
  peep: string
  cest: string
  si: string
  sat: string
  pam: string
  best: boolean
}

export type DesmHistEntry = {
  ts: string
  pimax: string
  pemax: string
  vc: string
  fr: string
  cv: string
  vm: string
  rsbi: string
  analise: string
}

export type DesmEtapaEntry = {
  ts: string
  treOK: boolean
  treDt: string
  treTm: string
  extOK: boolean
  extResult: string
  descVMOK: boolean
  descResult: string
  tipo: string
}

export type PronaHistEntry = {
  ts: string
  tempo: string
  dataInicio: string
  horaInicio: string
}

export type MrcHistEntry = {
  ts: string
  ombroD: string; ombroE: string
  cotoveloD: string; cotoveloE: string
  punhoD: string; punhoE: string
  quadrilD: string; quadrilE: string
  joelhoD: string; joelhoE: string
  tornozeloD: string; tornozeloE: string
  total: number
}

export type PermeHistEntry = {
  ts: string
  estado: string
  barreira: string
  forcaMS: string
  forcaMI: string
  leito: string
  transf: string
  marcha: string
  total: number
}

export type ImsHistEntry = {
  ts: string
  score: string
}

export function calcPesoIdeal(alt: number, sexo: string): number {
  if (!alt || alt < 100 || alt > 250) return 0
  if (sexo === 'M') return 50 + 0.91 * (alt - 152.4)
  if (sexo === 'F') return 45.5 + 0.91 * (alt - 152.4)
  return 47.75 + 0.91 * (alt - 152.4)
}

export function calcPF(pao2: number, fio2: number): number | null {
  if (fio2 === 0) return null
  return pao2 / (fio2 / 100)
}

export function interpPF(v: number): { t: string; c: string } | null {
  if (v >= 400) return { t: 'Normal', c: '#4ade80' }
  if (v >= 300) return { t: 'Preservado', c: '#4ade80' }
  if (v >= 200) return { t: 'SDRA Leve', c: '#facc15' }
  if (v >= 100) return { t: 'SDRA Moderada', c: '#fb923c' }
  return { t: 'SDRA Grave', c: '#f87171' }
}

export function calcDP(plato: number, peep: number): number | null {
  if (plato == null || peep == null) return null
  return plato - peep
}

export function calcCest(vt: number, dp: number): number | null {
  if (!dp || dp === 0) return null
  return vt / dp
}

/** Compliance dinâmica: Vt / (Ppico - PEEP) */
export function calcCdyn(vt: number, ppico: number, peep: number): number | null {
  const denom = ppico - peep
  if (!vt || !ppico || denom <= 0) return null
  return vt / denom
}

/** Mechanical Power (J/min) ≈ 0.098 × FR × Vt(L) × (Ppico − PEEP/2) */
export function calcMechanicalPower(fr: number, vtMl: number, ppico: number, peep: number): number | null {
  if (!fr || !vtMl || !ppico) return null
  return 0.098 * fr * (vtMl / 1000) * (ppico - peep / 2)
}

export function calcGlasgow(
  o: number,
  v: number | string,
  m: number,
): { total: number | string; interp: string; cor: string; detail: string } | null {
  if (v === 'T' || v === 't') {
    const om = (o || 0) + (m || 0)
    let interp = 'Intubado'
    let cor = '#60a5fa'
    let detail = 'Verbal nao testavel (tubo). '
    if (om >= 10) { interp = 'Intubado — resposta preservada'; cor = '#4ade80'; detail += 'Abertura ocular e resposta motora preservadas. Bom prognostico neurologico se sem sedacao.' }
    else if (om >= 7) { interp = 'Intubado — disfuncao moderada'; cor = '#facc15'; detail += 'Resposta motora presente mas reduzida. Avaliar sedacao residual vs lesao neurologica.' }
    else if (om >= 5) { interp = 'Intubado — disfuncao grave'; cor = '#fb923c'; detail += 'Resposta pobre. Descartar sedacao residual, BNM, disturbio metabolico. Se persistente, considerar neuroimagem.' }
    else { interp = 'Intubado — coma profundo'; cor = '#f87171'; detail += 'Ausencia de resposta significativa. Avaliar reflexos de tronco, pupilas, e indicacao de EEG/TC.' }
    return { total: `${om}T`, interp, cor, detail }
  }

  const t = (o || 0) + Number(v) + (m || 0)
  if (t === 15) return { total: 15, interp: 'Consciente e orientado', cor: '#4ade80', detail: 'Glasgow maximo. Paciente lucido e responsivo.' }
  if (t >= 13) return { total: t, interp: 'Disfuncao leve', cor: '#facc15', detail: `Glasgow ${t}: confusao leve ou desorientacao. Avaliar delirium (CAM-ICU), dor, disturbio metabolico (Na+, glicemia, ureia). Monitorar evolucao.` }
  if (t >= 9) return { total: t, interp: 'Disfuncao moderada', cor: '#fb923c', detail: `Glasgow ${t}: rebaixamento moderado. Resposta a estimulos presente mas inadequada. Investigar: sedacao residual, hiponatremia, hipoglicemia, lesao intracraniana. Considerar TC de cranio se nao justificado por sedacao.` }
  if (t >= 6) return { total: t, interp: 'Coma leve', cor: '#f87171', detail: `Glasgow ${t}: coma. Apenas respostas reflexas. Avaliar pupilas, reflexos de tronco (corneopalpebral, oculocefalico). Indicacao de neuroimagem e EEG se sem causa metabolica clara.` }
  return { total: t, interp: 'Coma profundo', cor: '#f87171', detail: `Glasgow ${t}: coma profundo (3-5). Prognostico reservado. Avaliar reflexos de tronco encefalico, pupilas fixas/midriaticas, indicacao de protocolo de morte encefalica se aplicavel. Descartar hipotermia e intoxicacao.` }
}

export function calcRSBI(fr: number, vc: number): number | null {
  if (!vc || vc === 0) return null
  return fr / (vc / 1000)
}

export function interpRSBI(v: number): { t: string; c: string } | null {
  if (v < 80) return { t: 'Favoravel ao desmame', c: '#4ade80' }
  if (v <= 105) return { t: 'Risco moderado', c: '#facc15' }
  return { t: 'Alto risco de falha', c: '#f87171' }
}

export function analisarGaso(params: {
  gasoPH: number
  gasoPaCO2: number
  gasoHCO3: number
  gasoLactato?: number
  gasoBE?: number
  // Contexto clínico para cruzamento profundo
  creat?: number
  hb?: number
  bhAcumulado?: number
  rass?: number
  temSedativoAtivo?: boolean
  temBNMAtivo?: boolean
}): { tipo: string; origem: string; comp: string; cor: string; wintersDetail: string; full: string; insights: string[] } | null {
  const pH = Number(params.gasoPH)
  const co2 = Number(params.gasoPaCO2)
  const hco3 = Number(params.gasoHCO3)
  const lactato = params.gasoLactato || 0
  const be = params.gasoBE || 0

  if (!pH || !co2 || !hco3 || [pH, co2, hco3].some((v) => Number.isNaN(v))) return null
  if (pH < 6.5 || pH > 8.0 || co2 < 5 || co2 > 150 || hco3 < 1 || hco3 > 60) return null

  let tipo = 'Normal'
  let origem = ''
  let comp = ''

  // ══════════════════════════════════════════════════
  // PASSO 1: pH normal com distúrbio compensado oculto
  // ══════════════════════════════════════════════════
  if (pH >= 7.35 && pH <= 7.45) {
    if (hco3 < 20 && co2 < 38) {
      tipo = 'Acidose'
      origem = 'Metabolica'
      comp = 'Compensada (pH normal)'
    } else if (hco3 > 28 && co2 > 42) {
      tipo = 'Alcalose'
      origem = 'Metabolica'
      comp = 'Compensada (pH normal)'
    } else if (co2 > 48 && hco3 > 26) {
      tipo = 'Acidose'
      origem = 'Respiratoria'
      comp = 'Cronica compensada (pH normal)'
    } else if (co2 < 32 && hco3 < 22) {
      tipo = 'Alcalose'
      origem = 'Respiratoria'
      comp = 'Cronica compensada (pH normal)'
    }
  }

  // ══════════════════════════════════════════════════
  // PASSO 2: ACIDEMIA (pH < 7.35)
  // ══════════════════════════════════════════════════
  if (tipo === 'Normal' && pH < 7.35) {
    tipo = 'Acidose'
    const hasRespComp = co2 > 45
    const hasMetComp = hco3 < 22
    if (hasRespComp && hasMetComp) {
      origem = 'Mista (Resp + Met)'
      comp = 'Sem compensacao — ambos os sistemas comprometidos'
    } else if (hasRespComp) {
      origem = 'Respiratoria'
      const delta = co2 - 40
      const expAcute = 24 + delta * 0.1
      const expChronic = 24 + delta * 0.35
      if (hco3 >= expChronic - 2) comp = 'Cronica compensada (rim retendo HCO3)'
      else if (hco3 >= expAcute) comp = 'Aguda sobre cronica'
      else comp = 'Aguda nao compensada'
    } else if (hasMetComp) {
      origem = 'Metabolica'
      // Winters: PaCO2 esperado = 1.5 × HCO3 + 8 (±2)
      const expCO2 = 1.5 * hco3 + 8
      if (co2 >= expCO2 - 2 && co2 <= expCO2 + 2) comp = `Compensada (Winters: CO2 esp ${(expCO2 - 2).toFixed(0)}-${(expCO2 + 2).toFixed(0)}, medido ${co2})`
      else if (co2 < expCO2 - 2) comp = `Hipercompensada — alcalose respiratoria sobreposta (CO2 ${co2} < esperado ${(expCO2 - 2).toFixed(0)})`
      else if (co2 > expCO2 + 2) comp = `Acidose mista — acidose respiratoria sobreposta (CO2 ${co2} > esperado ${(expCO2 + 2).toFixed(0)})`
      else comp = 'Nao compensada'
    }
  }

  // ══════════════════════════════════════════════════
  // PASSO 3: ALCALEMIA (pH > 7.45)
  // ══════════════════════════════════════════════════
  if (tipo === 'Normal' && pH > 7.45) {
    tipo = 'Alcalose'
    const hasRespComp = co2 < 35
    const hasMetComp = hco3 > 26
    if (hasRespComp && hasMetComp) {
      origem = 'Mista (Resp + Met)'
      comp = 'Sem compensacao'
    } else if (hasRespComp) {
      origem = 'Respiratoria'
      const delta = 40 - co2
      const expAcute = 24 - delta * 0.2
      const expChronic = 24 - delta * 0.5
      if (hco3 <= expChronic + 2) comp = 'Cronica (rim excretando HCO3)'
      else if (hco3 <= expAcute + 2) comp = 'Aguda'
      else comp = 'Alcalose mista — alcalose metabolica associada'
    } else if (hasMetComp) {
      origem = 'Metabolica'
      const expCO2 = 40 + 0.7 * (hco3 - 24)
      if (co2 >= expCO2 - 3 && co2 <= expCO2 + 3) comp = `Compensada (CO2 esp ${(expCO2 - 3).toFixed(0)}-${(expCO2 + 3).toFixed(0)}, medido ${co2})`
      else if (co2 > expCO2 + 3) comp = `Hipoventilacao excessiva — acidose respiratoria sobreposta (CO2 ${co2} > esperado ${(expCO2 + 3).toFixed(0)})`
      else if (co2 < 35) comp = 'Alcalose mista — alcalose respiratoria associada'
      else comp = 'Nao compensada'
    }
  }

  // ══════════════════════════════════════════════════
  // CORES por gravidade
  // ══════════════════════════════════════════════════
  let cor = '#4ade80'
  if (tipo !== 'Normal') cor = '#facc15'
  if (origem.includes('Mista') || comp.includes('Nao compensada') || comp.includes('sobreposta')) cor = '#fb923c'
  if (pH < 7.10 || pH > 7.60) cor = '#f87171'
  if (pH < 7.20 || pH > 7.55) cor = cor === '#4ade80' ? '#fb923c' : cor === '#facc15' ? '#fb923c' : cor
  if (lactato > 4) cor = '#f87171'

  // Winters detail (mantido para display separado)
  let wintersDetail = ''
  if (tipo === 'Acidose' && origem === 'Metabolica') {
    const expCO2 = 1.5 * hco3 + 8
    wintersDetail = `Winters: CO2 esperado ${(expCO2 - 2).toFixed(0)}-${(expCO2 + 2).toFixed(0)}, medido ${co2}`
  } else if (tipo === 'Alcalose' && origem === 'Metabolica') {
    const expCO2 = 40 + 0.7 * (hco3 - 24)
    wintersDetail = `CO2 esperado ${(expCO2 - 3).toFixed(0)}-${(expCO2 + 3).toFixed(0)}, medido ${co2}`
  }

  // ══════════════════════════════════════════════════
  // CRUZAMENTO PROFUNDO — Insights clínicos
  // ══════════════════════════════════════════════════
  const insights: string[] = []

  // 1. Gaso + Rim: Acidose metabólica + IRA
  if (hco3 < 22 && params.creat && params.creat >= 2) {
    insights.push(`Acidose Metabolica de provavel origem RENAL. Creatinina ${params.creat} indica que o rim nao esta excretando acidos fixos (retencao de escorias nitrogenadas). ${params.creat >= 4 ? 'Avaliar indicacao de dialise IMEDIATA para correcao acido-base.' : 'Monitorar funcao renal e avaliar necessidade de dialise.'}`)
  }

  // 2. Gaso + BH: Alcalose metabólica + BH negativo (contrativa)
  if (hco3 > 26 && params.bhAcumulado !== undefined && params.bhAcumulado < -1500) {
    insights.push(`Alcalose Metabolica CONTRATIVA detectada. BH acumulado negativo (${params.bhAcumulado}mL) + HCO3 elevado (${hco3}) = perda excessiva de volume e cloro (comum com diureticos). Conduta: repor volume com SF 0.9% (rico em cloro), reavaliar diuretico.`)
  }

  // 3. Gaso + BH: Acidose + sobrecarga hídrica
  if (pH < 7.35 && params.bhAcumulado !== undefined && params.bhAcumulado > 3000) {
    insights.push(`Acidose em paciente com sobrecarga hidrica (+${params.bhAcumulado}mL). O excesso de volume pode estar diluindo o bicarbonato (acidose diluicional) e piorando troca gasosa. Considerar restricao hidrica agressiva e diuretico.`)
  }

  // 4. Gaso + Lactato + HB: Hipóxia anêmica
  if (lactato > 2 && params.hb !== undefined && params.hb < 7.5) {
    insights.push(`Hipoxia citopática/anemica: Lactato ${lactato} + HB ${params.hb}. O lactato sobe porque nao ha hemoglobina suficiente para transportar O2 aos tecidos, MESMO que SpO2 esteja normal. Avaliar transfusao para aumentar oferta de O2 (DO2).`)
  }

  // 5. Gaso + Lactato isolado (sem anemia)
  if (lactato > 4 && (!params.hb || params.hb >= 7.5)) {
    insights.push(`Acidose lactica GRAVE (Lactato ${lactato}). Marcador de choque/hipoperfusao. Se em uso de adrenalina: diferenciar lactato por beta-2 (metabolico) vs hipoperfusao real usando perfusao clinica e ScvO2.`)
  } else if (lactato > 2 && lactato <= 4 && (!params.hb || params.hb >= 7.5)) {
    insights.push(`Hiperlactatemia (Lactato ${lactato}). Sugere hipoperfusao tecidual. Monitorar clearance de lactato: queda >20% em 2h e sinal de melhora. Se subindo: reavaliar volemia e suporte vasoativo.`)
  }

  // 6. Gaso + Neuro: Acidose resp + sedação/BNM
  if (co2 > 45 && (params.temSedativoAtivo || params.temBNMAtivo)) {
    const causa = params.temBNMAtivo ? 'BNM ativo (paralisia muscular)' : 'sedacao profunda'
    insights.push(`Hipercapnia (CO2 ${co2}) com ${causa}. Hipoventilacao por causa farmacologica — o paciente nao tem drive respiratorio para lavar o CO2. Conduta: ajustar parametros da VM (aumentar FR ou VC), avaliar reducao de sedacao/BNM.`)
  }

  // 7. Gaso + Neuro: Alcalose resp + agitação
  if (co2 < 30 && params.rass !== undefined && params.rass > 0) {
    insights.push(`Hipocapnia (CO2 ${co2}) com agitacao (RASS +${params.rass}). Hiperventilacao por dor, ansiedade ou drive elevado. Avaliar: dor (escala CPOT/BPS), assincronia ventilatoria, desconforto. Tratar causa antes de sedar.`)
  }

  // 8. BE (Base Excess) interpretação
  if (be !== 0) {
    if (be < -5) insights.push(`BE ${be}: deficit de base importante. Consumo de tampao — acidose metabolica ativa. Quanto mais negativo, maior a gravidade.`)
    else if (be < -2) insights.push(`BE ${be}: deficit de base leve. Sugere componente metabolico acido.`)
    else if (be > 5) insights.push(`BE +${be}: excesso de base. Alcalose metabolica ou compensacao renal cronica.`)
  }

  // 9. pH crítico
  if (pH < 7.10) {
    insights.push(`⚠ pH CRITICO (${pH.toFixed(2)}): acidemia grave. Risco de arritmia, depressao miocardica e colapso cardiovascular. Tratamento imediato da causa. Se pH < 7.0: considerar bicarbonato IV (controverso, mas pode ser necessario em parada iminente).`)
  } else if (pH > 7.60) {
    insights.push(`⚠ pH CRITICO (${pH.toFixed(2)}): alcalemia grave. Risco de arritmia, tetania e convulsoes. Investigar e tratar causa imediatamente.`)
  }

  return {
    tipo,
    origem,
    comp,
    cor,
    wintersDetail,
    insights,
    full: `${tipo}${origem ? ` ${origem}` : ''}${comp ? ` — ${comp}` : ''}`,
  }
}

export function interpP01(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value >= 1.5 && value <= 3.5) return { t: 'Drive normal (1.5-3.5)', c: '#4ade80' }
  if (value < 1.0) return { t: 'Drive hipo (<1.0)', c: '#f87171' }
  if (value < 1.5) return { t: 'Drive baixo-normal', c: '#facc15' }
  if (value <= 4.0) return { t: 'Drive levemente elevado', c: '#facc15' }
  return { t: 'Drive hiper (>4.0)', c: '#f87171' }
}

export function interpPocc(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value >= 5 && value <= 10) return { t: 'Normal (5-10)', c: '#4ade80' }
  if (value < 5) return { t: 'Baixo (<5)', c: '#facc15' }
  return { t: 'Elevado (>10)', c: '#fb923c' }
}

export function calcPmusc(pocc: number): number | null {
  const value = Number(pocc)
  if (Number.isNaN(value)) return null
  return Math.abs(0.75 * value)
}

export function interpPmusc(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value < 5) return { t: 'Superassistencia (<5)', c: '#60a5fa' }
  if (value <= 10) return { t: 'Protecao diafragmatica (5-10)', c: '#4ade80' }
  if (value <= 13) return { t: 'Esforco moderado (10-13)', c: '#facc15' }
  return { t: 'Esforco excessivo (>13)', c: '#f87171' }
}

export type PatientData = {
  id?: string
  leito: string
  nome: string
  idade: string
  sexo: string
  altura: string
  peso: string
  pesoIdeal: string
  pesoAtual: string
  statusClinico: string
  balanco24h: string
  balancoAcumulado: string
  historia: string
  diagnostico: string
  examesLabList: LabExamEntry[]
  examesImagemList: ImageExamEntry[]
  glasgowO: string
  glasgowV: string
  glasgowM: string
  rass: string
  neurologico: string
  metaRASS: string
  metaTOF: string
  ultimoTOF: string
  // Neuro — pupilas
  pupilaDTam: string
  pupilaDReag: string
  pupilaETam: string
  pupilaEReag: string
  // Neuro — CAM-ICU (delirium)
  camIcuRassOk: string      // RASS >= -3? (sim/nao) — step 1
  camIcuAltConsc: string    // Alteração aguda consciência? (sim/nao) — feature 1
  camIcuInatencao: string   // Inatenção? (sim/nao) — feature 2
  camIcuPensamento: string  // Pensamento desorganizado? (sim/nao) — feature 3
  camIcuNivelConsc: string  // Nível consciência alterado (RASS != 0)? — feature 4
  // Neuro — Dor
  dorEscala: string         // CPOT (0-8) ou BPS (3-12) ou NRS (0-10)
  dorTipo: string           // 'cpot' | 'bps' | 'nrs'
  dorLocal: string
  // Neuro — Convulsões
  convulsao: string         // sim/nao
  convulsaoObs: string
  sedativos: SedativeEntry[]
  bnmList: BNMEntry[]
  cardiovascular: string
  cardiovascularMudanca: string
  pas: string
  pad: string
  pam: string
  fc: string
  lactatoCardio: string
  dvaList: DVAEntry[]
  pulmonar: string
  secrecao: string
  secCor: string[]
  secConsist: string[]
  secQtd: string[]
  secEvo: string[]
  fluxoO2: string
  tempHFNC: string
  tipoVia: string
  dataTOT: string
  horaTOT: string
  dataTQT: string
  horaTQT: string
  dataExtubacao: string
  horaExtubacao: string
  dataReIOT: string
  horaReIOT: string
  dataDecanulacao: string
  horaDecanulacao: string
  dataDescVM: string
  horaDescVM: string
  modoVM: string
  vt: string
  vc: string
  ve: string
  fr: string
  peep: string
  fio2: string
  fluxo: string
  trigger: string
  ti: string
  ie: string
  ppico: string
  pplato: string
  pmean: string
  ps: string
  ciclagem: string
  p1: string
  p2: string
  si: string
  rampa: string
  p01: string
  pocc: string
  pmusc: string
  ipap: string
  epap: string
  interfaceVNI: string
  gasoData: string
  gasoHora: string
  gasoPH: string
  gasoPaCO2: string
  gasoPaO2: string
  gasoHCO3: string
  gasoBE: string
  gasoSaO2: string
  gasoLactato: string
  gasoFiO2: string
  gasoObs: string
  sfSpO2: string
  sfFiO2: string
  gasometrias: GasometryHistoryEntry[]
  vmHist: VMHistoryEntry[]
  peepOpt: PeepOptEntry[]
  curvaPxT: string[]
  curvaFxT: string[]
  curvaVxT: string[]
  loopPV: string[]
  loopFV: string[]
  assincronia: string[]
  protocoloVM: string[]
  dPimax: string
  dPemax: string
  dVcDesm: string
  dFrDesm: string
  dCv: string
  weanTRETipo: string
  weanTREResult: string
  weanObs: string
  weanCausaReversivel: string
  weanNeuroOk: string
  weanTosse: string
  weanPeakFlow: string
  weanCuffLeak: string
  weanCuffLeakDiff: string
  weanTipoDesm: string
  pronaAtiva: string
  pronaTempo: string
  pronaData: string
  pronaHora: string
  recVolInsp: string
  recVolExp: string
  treOK: string
  treDt: string
  treTm: string
  extOK: string
  extResult: string
  descVMOK: string
  descResult: string
  desmHist: DesmHistEntry[]
  desmEtapasHist: DesmEtapaEntry[]
  mraTab: MraRow[]
  titTab: TitRow[]
  pronaHist: PronaHistEntry[]
  hfovHz: string
  hfovBiasFlow: string
  wob: string
  vmObs: string
  motora: string
  mrcOmbroD: string
  mrcOmbroE: string
  mrcCotoveloD: string
  mrcCotoveloE: string
  mrcPunhoD: string
  mrcPunhoE: string
  mrcQuadrilD: string
  mrcQuadrilE: string
  mrcJoelhoD: string
  mrcJoelhoE: string
  mrcTornozeloD: string
  mrcTornozeloE: string
  permeEstado: string
  permeBarreira: string
  permeForcaMS: string
  permeForcaMI: string
  permeLeito: string
  permeTransf: string
  permeMarcha: string
  imsScore: string
  mrcHist: MrcHistEntry[]
  permeHist: PermeHistEntry[]
  imsHist: ImsHistEntry[]
  percepcao: string
  pendencias: string
  condutas: string
  [key: string]: unknown
}

export function emptyPatient(): PatientData {
  return {
    leito: '',
    nome: '',
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    pesoIdeal: '',
    pesoAtual: '',
    statusClinico: '',
    balanco24h: '',
    balancoAcumulado: '',
    historia: '',
    diagnostico: '',
    examesLabList: [],
    examesImagemList: [],
    glasgowO: '',
    glasgowV: '',
    glasgowM: '',
    rass: '',
    neurologico: '',
    metaRASS: '',
    metaTOF: '',
    ultimoTOF: '',
    pupilaDTam: '',
    pupilaDReag: '',
    pupilaETam: '',
    pupilaEReag: '',
    camIcuRassOk: '',
    camIcuAltConsc: '',
    camIcuInatencao: '',
    camIcuPensamento: '',
    camIcuNivelConsc: '',
    dorEscala: '',
    dorTipo: 'cpot',
    dorLocal: '',
    convulsao: '',
    convulsaoObs: '',
    sedativos: [],
    bnmList: [],
    cardiovascular: '',
    cardiovascularMudanca: '',
    pas: '',
    pad: '',
    pam: '',
    fc: '',
    lactatoCardio: '',
    dvaList: [],
    pulmonar: '',
    secrecao: '',
    secCor: [],
    secConsist: [],
    secQtd: [],
    secEvo: [],
    fluxoO2: '',
    tempHFNC: '',
    tipoVia: '',
    dataTOT: '',
    horaTOT: '',
    dataTQT: '',
    horaTQT: '',
    dataExtubacao: '',
    horaExtubacao: '',
    dataReIOT: '',
    horaReIOT: '',
    dataDecanulacao: '',
    horaDecanulacao: '',
    dataDescVM: '',
    horaDescVM: '',
    modoVM: '',
    vt: '',
    vc: '',
    ve: '',
    fr: '',
    peep: '',
    fio2: '',
    fluxo: '',
    trigger: '',
    ti: '',
    ie: '',
    ppico: '',
    pplato: '',
    pmean: '',
    ps: '',
    ciclagem: '',
    p1: '',
    p2: '',
    si: '',
    rampa: '',
    p01: '',
    pocc: '',
    pmusc: '',
    ipap: '',
    epap: '',
    interfaceVNI: 'facial',
    gasoData: '',
    gasoHora: '',
    gasoPH: '',
    gasoPaCO2: '',
    gasoPaO2: '',
    gasoHCO3: '',
    gasoBE: '',
    gasoSaO2: '',
    gasoLactato: '',
    gasoFiO2: '',
    gasoObs: '',
    sfSpO2: '',
    sfFiO2: '',
    gasometrias: [],
    vmHist: [],
    peepOpt: [
      { peep: '', plato: '', si: '' },
      { peep: '', plato: '', si: '' },
      { peep: '', plato: '', si: '' },
    ],
    curvaPxT: [],
    curvaFxT: [],
    curvaVxT: [],
    loopPV: [],
    loopFV: [],
    assincronia: [],
    protocoloVM: [],
    dPimax: '',
    dPemax: '',
    dVcDesm: '',
    dFrDesm: '',
    dCv: '',
    weanTRETipo: '',
    weanTREResult: '',
    weanObs: '',
    weanCausaReversivel: '',
    weanNeuroOk: '',
    weanTosse: '',
    weanPeakFlow: '',
    weanCuffLeak: '',
    weanCuffLeakDiff: '',
    weanTipoDesm: '',
    pronaAtiva: '',
    pronaTempo: '16h',
    pronaData: '',
    pronaHora: '',
    recVolInsp: '',
    recVolExp: '',
    treOK: '',
    treDt: '',
    treTm: '',
    extOK: '',
    extResult: '',
    descVMOK: '',
    descResult: '',
    desmHist: [],
    desmEtapasHist: [],
    mraTab: [],
    titTab: [],
    pronaHist: [],
    hfovHz: '',
    hfovBiasFlow: '',
    wob: '',
    vmObs: '',
    motora: '',
    mrcOmbroD: '',
    mrcOmbroE: '',
    mrcCotoveloD: '',
    mrcCotoveloE: '',
    mrcPunhoD: '',
    mrcPunhoE: '',
    mrcQuadrilD: '',
    mrcQuadrilE: '',
    mrcJoelhoD: '',
    mrcJoelhoE: '',
    mrcTornozeloD: '',
    mrcTornozeloE: '',
    permeEstado: '',
    permeBarreira: '',
    permeForcaMS: '',
    permeForcaMI: '',
    permeLeito: '',
    permeTransf: '',
    permeMarcha: '',
    imsScore: '',
    mrcHist: [],
    permeHist: [],
    imsHist: [],
    percepcao: '',
    pendencias: '',
    condutas: '',
  }
}
