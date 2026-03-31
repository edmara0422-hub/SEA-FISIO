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
): { total: number | string; interp: string; cor: string } | null {
  if (v === 'T' || v === 't') {
    return {
      total: `${(o || 0) + (m || 0)}T`,
      interp: 'Intubado',
      cor: '#60a5fa',
    }
  }

  const t = (o || 0) + Number(v) + (m || 0)
  if (t >= 15) return { total: 15, interp: 'Consciente e orientado', cor: '#4ade80' }
  if (t >= 13) return { total: t, interp: 'Disfuncao leve', cor: '#facc15' }
  if (t >= 9) return { total: t, interp: 'Disfuncao moderada', cor: '#fb923c' }
  return { total: t, interp: 'Coma / VA definitiva', cor: '#f87171' }
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
}): { tipo: string; origem: string; comp: string; cor: string; wintersDetail: string; full: string } | null {
  const pH = Number(params.gasoPH)
  const co2 = Number(params.gasoPaCO2)
  const hco3 = Number(params.gasoHCO3)

  if (!pH || !co2 || !hco3 || [pH, co2, hco3].some((v) => Number.isNaN(v))) return null
  if (pH < 6.5 || pH > 8.0 || co2 < 5 || co2 > 150 || hco3 < 1 || hco3 > 60) return null

  let tipo = 'Normal'
  let origem = ''
  let comp = ''

  if (pH < 7.35) {
    tipo = 'Acidose'
    const hasRespComp = co2 > 45
    const hasMetComp = hco3 < 22
    if (hasRespComp && hasMetComp) {
      origem = 'Mista'
      comp = 'Nao compensada'
    } else if (hasRespComp) {
      origem = 'Respiratoria'
      // Compensacao renal: aguda +1 mEq/L por 10 mmHg; cronica +3.5 mEq/L por 10 mmHg
      const delta = co2 - 40
      const expAcute = 24 + delta * 0.1
      const expChronic = 24 + delta * 0.35
      if (hco3 >= expChronic - 2) comp = 'Cronica compensada'
      else if (hco3 >= expAcute) comp = 'Aguda sobre cronica'
      else comp = 'Aguda nao compensada'
    } else if (hasMetComp) {
      origem = 'Metabolica'
      // Winters: PaCO2 esperado = 1.5 × HCO3 + 8 (±2)
      const expCO2 = 1.5 * hco3 + 8
      if (co2 >= expCO2 - 2 && co2 <= expCO2 + 2) comp = 'Compensada'
      else if (co2 < expCO2 - 2) comp = 'Hipercompensada (+alcalose resp.)'
      else if (co2 > 45) comp = '+Acidose resp. sobreposta'
      else comp = 'Nao compensada'
    }
  } else if (pH > 7.45) {
    tipo = 'Alcalose'
    const hasRespComp = co2 < 35
    const hasMetComp = hco3 > 26
    if (hasRespComp && hasMetComp) {
      origem = 'Mista'
      comp = 'Nao compensada'
    } else if (hasRespComp) {
      origem = 'Respiratoria'
      // Aguda: HCO3 cai 2 por 10 mmHg; cronica: cai 5 por 10 mmHg
      const delta = 40 - co2
      const expAcute = 24 - delta * 0.2
      const expChronic = 24 - delta * 0.5
      if (hco3 <= expChronic + 2) comp = 'Cronica'
      else if (hco3 <= expAcute + 2) comp = 'Aguda'
      else comp = '+Alcalose met. associada'
    } else if (hasMetComp) {
      origem = 'Metabolica'
      // PaCO2 esperado = 40 + 0.7 × (HCO3 - 24)
      const expCO2 = 40 + 0.7 * (hco3 - 24)
      if (co2 >= expCO2 - 3 && co2 <= expCO2 + 3) comp = 'Compensada'
      else if (co2 < expCO2 - 3) comp = '+Acidose resp. associada'
      else comp = 'Nao compensada'
    }
  }

  let cor = '#4ade80'
  if (tipo !== 'Normal') cor = '#facc15'
  if (origem === 'Mista' || comp.includes('Nao compensada') || comp.startsWith('+')) cor = '#fb923c'
  if (pH < 7.2 || pH > 7.6) cor = '#f87171'

  // Winters detail for metabolic acidosis
  let wintersDetail = ''
  if (tipo === 'Acidose' && origem === 'Metabolica') {
    const expCO2 = 1.5 * hco3 + 8
    wintersDetail = `Winters: CO₂ esperado ${(expCO2 - 2).toFixed(0)}-${(expCO2 + 2).toFixed(0)}, medido ${co2}`
  }

  return {
    tipo,
    origem,
    comp,
    cor,
    wintersDetail,
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
