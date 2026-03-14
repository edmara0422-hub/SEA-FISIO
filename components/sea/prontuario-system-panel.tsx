'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Archive,
  ArrowLeft,
  BookOpen,
  Brain,
  Eye,
  FileText,
  HeartPulse,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Wind,
  Zap,
} from 'lucide-react'
import { ICUSystemPanel } from '@/components/sea/icu-system-panel'
import {
  analisarGaso,
  calcCest,
  calcDP,
  calcGlasgow,
  calcPesoIdeal,
  calcPF,
  calcPmusc,
  calcRSBI,
  emptyPatient,
  interpP01,
  interpPF,
  interpPmusc,
  interpPocc,
  interpRSBI,
  type BNMEntry,
  type DVAEntry,
  type GasometryHistoryEntry,
  type ImageExamEntry,
  type LabExamEntry,
  type PeepOptEntry,
  type PatientData,
  type SedativeEntry,
  type VMHistoryEntry,
} from '@/lib/icu-calcs'

type PanelView = 'records' | 'reference' | 'archive'
type FormTab = 'dados' | 'neuro' | 'cardio' | 'resp' | 'motora' | 'percepcao'
type ListFieldKey = 'sedativos' | 'bnmList' | 'dvaList' | 'examesLabList' | 'examesImagemList'

type ICURecord = PatientData & {
  id: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEYS = {
  records: 'sea-icu-records',
  archive: 'sea-icu-archive',
}

const INPUT_CLASS =
  'w-full rounded-[1rem] border border-white/10 bg-black/22 px-3 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/24 focus:border-white/18'

const INPUT_CLASS_SM =
  'w-full rounded-[0.7rem] border border-white/10 bg-black/22 px-2 py-1.5 text-xs text-white outline-none transition-all placeholder:text-white/24 focus:border-white/18'
const INPUT_FLEX =
  'rounded-[0.7rem] border border-white/10 bg-black/22 px-2 py-1.5 text-xs text-white outline-none transition-all placeholder:text-white/24 focus:border-white/18'

const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[5.5rem] resize-none`
const AUTO_TEXTAREA_CLASS =
  'w-full rounded-[1rem] border border-white/10 bg-black/18 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-white/24 focus:border-white/18 resize-none overflow-hidden min-h-[2.75rem]'

const STATUS_OPTIONS = [
  ['', '--'],
  ['estavel', 'Estavel'],
  ['grave', 'Grave'],
  ['critico', 'Critico'],
  ['instavel', 'Instavel'],
  ['watcher', 'Watcher'],
] as const

const STATUS_STYLES: Record<string, { label: string; border: string; background: string; color: string }> = {
  estavel: {
    label: 'Estavel',
    border: 'rgba(74,222,128,0.28)',
    background: 'rgba(74,222,128,0.10)',
    color: '#86efac',
  },
  grave: {
    label: 'Grave',
    border: 'rgba(251,191,36,0.28)',
    background: 'rgba(251,191,36,0.10)',
    color: '#fde68a',
  },
  critico: {
    label: 'Critico',
    border: 'rgba(248,113,113,0.28)',
    background: 'rgba(248,113,113,0.10)',
    color: '#fca5a5',
  },
  instavel: {
    label: 'Instavel',
    border: 'rgba(96,165,250,0.28)',
    background: 'rgba(96,165,250,0.10)',
    color: '#93c5fd',
  },
  watcher: {
    label: 'Watcher',
    border: 'rgba(168,85,247,0.28)',
    background: 'rgba(168,85,247,0.10)',
    color: '#c084fc',
  },
}

const VIA_OPTIONS = [
  ['', 'Selecionar'],
  ['RE-AA', 'RE - Ar Ambiente'],
  ['RE-O2', 'RE - O2 Cateter'],
  ['RE-MFS', 'RE - Masc. Facial Simples'],
  ['RE-MFR', 'RE - Masc. c/ Reservatorio'],
  ['RE-MFV', 'RE - Masc. Venturi'],
  ['VNI', 'VNI'],
  ['HFNC', 'HFNC (Cateter Alto Fluxo)'],
  ['RPPI', 'RPPI'],
  ['TOT', 'TOT (Tubo Orotraqueal)'],
  ['TNT', 'TNT (Tubo Nasotraqueal)'],
  ['ML', 'ML (Mascara Laringea)'],
  ['TQT-AA', 'TQT - Ar Ambiente'],
  ['TQT-O2', 'TQT - com O2'],
  ['TQT-VM', 'TQT - em VM'],
  ['TQT-P', 'TQT - Prolong. / Desmame'],
] as const

const VIA_BADGE_STYLES: Record<string, { label: string; border: string; background: string; color: string }> = {
  TOT: { label: 'TOT', border: 'rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.12)', color: '#f87171' },
  'TQT-AA': { label: 'TQT-AA', border: 'rgba(192,132,252,0.30)', background: 'rgba(192,132,252,0.12)', color: '#c084fc' },
  'TQT-O2': { label: 'TQT-O2', border: 'rgba(147,197,253,0.30)', background: 'rgba(147,197,253,0.12)', color: '#93c5fd' },
  'TQT-VM': { label: 'TQT-VM', border: 'rgba(192,132,252,0.40)', background: 'rgba(192,132,252,0.18)', color: '#c084fc' },
  'TQT-P': { label: 'TQT-P', border: 'rgba(251,191,36,0.30)', background: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  'RE-AA': { label: 'RE-AA', border: 'rgba(74,222,128,0.30)', background: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  'RE-O2': { label: 'RE-O2', border: 'rgba(96,165,250,0.30)', background: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  'RE-MFS': { label: 'MFS', border: 'rgba(74,222,128,0.30)', background: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  'RE-MFR': { label: 'MFR', border: 'rgba(74,222,128,0.30)', background: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  'RE-MFV': { label: 'Venturi', border: 'rgba(96,165,250,0.30)', background: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  VNI: { label: 'VNI', border: 'rgba(250,204,21,0.30)', background: 'rgba(250,204,21,0.12)', color: '#facc15' },
  HFNC: { label: 'HFNC', border: 'rgba(34,211,238,0.30)', background: 'rgba(34,211,238,0.12)', color: '#22d3ee' },
  RPPI: { label: 'RPPI', border: 'rgba(251,146,60,0.30)', background: 'rgba(251,146,60,0.12)', color: '#fb923c' },
}

const LAB_FIELDS = [
  { key: 'hb', label: 'HB', unit: 'g/dL', ref: '12-17' },
  { key: 'ht', label: 'HT', unit: '%', ref: '36-50' },
  { key: 'leuco', label: 'Leuco', unit: '/mm3', ref: '4k-11k' },
  { key: 'plaq', label: 'Plaq', unit: 'x10³', ref: '150-400' },
  { key: 'creat', label: 'Creat', unit: 'mg/dL', ref: '0.6-1.2' },
  { key: 'ureia', label: 'Ureia', unit: 'mg/dL', ref: '15-40' },
  { key: 'k', label: 'K+', unit: 'mEq/L', ref: '3.5-5.0' },
  { key: 'na', label: 'Na+', unit: 'mEq/L', ref: '135-145' },
  { key: 'lac', label: 'Lac', unit: 'mmol/L', ref: '<2.0' },
  { key: 'pcr', label: 'PCR', unit: 'mg/L', ref: '<5' },
  { key: 'bt', label: 'BT', unit: 'mg/dL', ref: '<1.2' },
  { key: 'alb', label: 'Alb', unit: 'g/dL', ref: '3.5-5.0' },
  { key: 'tgo', label: 'TGO', unit: 'U/L', ref: '<40' },
  { key: 'tgp', label: 'TGP', unit: 'U/L', ref: '<41' },
  { key: 'inr', label: 'INR', unit: '', ref: '0.8-1.2' },
] as const

const IMAGE_TYPE_OPTIONS = [
  ['', 'Selecionar'],
  ['RX Torax', 'RX Tórax'],
  ['RX Abdome', 'RX Abdome'],
  ['TC Cranio', 'TC Crânio'],
  ['TC Torax', 'TC Tórax'],
  ['TC Abdome', 'TC Abdome'],
  ['RM Cranio', 'RM Crânio'],
  ['RM Coluna', 'RM Coluna'],
  ['USG Abdome', 'USG Abdome'],
  ['USG Venosa', 'USG Venosa'],
  ['ECO', 'Eco'],
  ['Ecodoppler', 'Ecodoppler'],
  ['Cintilografia', 'Cintilografia'],
  ['AngioTC', 'AngioTC'],
  ['Outro', 'Outro'],
] as const

const IMAGE_FINDING_OPTIONS = [
  'Sem alteracoes agudas',
  'Consolidacao',
  'Infiltrado bilateral',
  'Atelectasia',
  'Edema pulmonar',
  'Derrame pleural',
  'Pneumotorax',
  'Broncograma aereo',
  'Cardiomegalia',
  'Congestao vascular',
  'Desvio de linha media',
  'Hemorragia',
  'Fratura',
  'Trombo / TEP',
] as const

const VM_OPTIONS = [
  { value: '', label: 'Selecionar', disabled: false },
  { value: '---', label: '-- BASICO CONTROLADO --', disabled: true },
  { value: 'VCV', label: 'VCV (Vol. Controlado)', disabled: false },
  { value: 'PCV', label: 'PCV (Pressao Controlada)', disabled: false },
  { value: '---2', label: '-- BASICO ESPONTANEO --', disabled: true },
  { value: 'PSV', label: 'PSV (Pressao Suporte)', disabled: false },
  { value: 'TuboT', label: 'Tubo-T', disabled: false },
  { value: '---3', label: '-- BASICO VNI --', disabled: true },
  { value: 'CPAP', label: 'CPAP', disabled: false },
  { value: 'BIPAP', label: 'BiPAP / Bilevel', disabled: false },
  { value: '---4', label: '-- AVANCADO CONTROLADO --', disabled: true },
  { value: 'PRVC', label: 'PRVC (VC+)', disabled: false },
  { value: 'HFOV', label: 'HFOV (Alta Frequencia)', disabled: false },
  { value: 'MMV', label: 'MMV (Vol. Minuto Mandatorio)', disabled: false },
  { value: '---5', label: '-- AVANCADO ESPONTANEO --', disabled: true },
  { value: 'APRV', label: 'APRV', disabled: false },
  { value: 'VS', label: 'VS (Vol. Suporte)', disabled: false },
  { value: 'ASV', label: 'ASV (Hamilton)', disabled: false },
  { value: 'IntelliVENT', label: 'IntelliVENT-ASV', disabled: false },
  { value: 'SmartCare', label: 'SmartCare/PS (Drager)', disabled: false },
  { value: '---6', label: '-- ASSIST. PROPORCIONAL --', disabled: true },
  { value: 'PAV', label: 'PAV+ (Proporcional)', disabled: false },
  { value: 'NAVA', label: 'NAVA (Edi)', disabled: false },
  { value: 'ATC', label: 'ATC (Compensacao Tubo)', disabled: false },
] as const

const VM_MODE_GROUPS = {
  volume: ['VCV', 'PRVC', 'HFOV', 'MMV'],
  pressure: ['PCV'],
  spontaneous: ['PSV', 'TuboT', 'CPAP', 'BIPAP', 'VS', 'ASV', 'IntelliVENT', 'SmartCare', 'APRV', 'PAV', 'NAVA', 'ATC'],
} as const

const CURVE_PXT_OPTIONS = [
  'Normal - Sincronico Controlado',
  'Normal - Sincronico A/C',
  'Normal - Sincronico Espontaneo',
  'Pico elevado (resistencia aumentada)',
  'Plato elevado (complacencia reduzida)',
  'Pico e Plato elevados',
  'Auto-PEEP (pressao expiratoria final elevada)',
  'Curva concava (obstrutiva)',
  'Pressao negativa excessiva (esforco aumentado)',
  'Overshoot (excesso de pressao inicial)',
  'Undershoot (pressao insuficiente)',
  'Duplo disparo',
  'Esforco ineficaz (trigger nao detectado)',
  'Ciclagem precoce',
  'Ciclagem tardia',
] as const

const CURVE_FXT_OPTIONS = [
  'Normal - Sincronico Controlado',
  'Normal - Sincronico A/C',
  'Normal - Sincronico Espontaneo',
  'Fluxo desacelerado (PCV normal)',
  'Fluxo quadrado (VCV normal)',
  'Fluxo expiratorio nao retorna a zero (auto-PEEP)',
  'Pico de fluxo expiratorio reduzido (obstrucao)',
  'Fluxo inspiratorio insuficiente (assincronia de fluxo)',
  'Duplo pico inspiratorio',
  'Fluxo reverso (ciclagem tardia)',
  'Esforco ineficaz visivel no fluxo',
] as const

const CURVE_VXT_OPTIONS = [
  'Normal - Sincronico Controlado',
  'Normal - Sincronico A/C',
  'Normal - Sincronico Espontaneo',
  'Volume nao retorna a zero (vazamento)',
  'Volume reduzido (obstrucao ou restricao)',
  'Volume excessivo (auto-trigger)',
  'Curva em degrau (duplo disparo)',
  'Volume instavel ciclo a ciclo',
] as const

const LOOP_PV_OPTIONS = [
  'Normal - Padrao sigmoide',
  'Histerese aumentada (recrutamento)',
  'Histerese reduzida (pulmao rigido)',
  'Ponto de inflexao inferior evidente',
  'Ponto de inflexao superior evidente (hiperdistensao)',
  'Beak sign (hiperdistensao)',
  'Deslocamento para direita (reducao complacencia)',
  'Deslocamento para esquerda (melhora complacencia)',
] as const

const LOOP_FV_OPTIONS = [
  'Normal - Formato sigmoide',
  'Loop achatado (restricao)',
  'Concavidade expiratoria (obstrucao)',
  'Volume reduzido (restricao grave)',
  'Fluxo expiratorio limitado',
  'Loop irregular (assincronia)',
  'Alargamento do loop (resistencia aumentada)',
] as const

const ASSINCRONIA_OPTIONS = [
  'Sem assincronias',
  'Esforco ineficaz (Ineffective Effort)',
  'Duplo disparo (Double Triggering)',
  'Auto-trigger',
  'Assincronia de fluxo (Flow Starvation)',
  'Ciclagem precoce (Premature Cycling)',
  'Ciclagem tardia (Delayed Cycling)',
  'Disparo reverso (Reverse Triggering)',
  'Breath Stacking',
  'Assincronia de PEEP (PEEP insuficiente)',
] as const

const PROTOCOL_OPTIONS = [
  { id: 'sdra', label: 'SDRA (ARDSnet)', color: '#f87171' },
  { id: 'pav', label: 'PAV (Pneumonia VM)', color: '#fb923c' },
  { id: 'asma', label: 'Asma / Broncoespasmo', color: '#facc15' },
  { id: 'dpoc', label: 'DPOC Exacerbado', color: '#4ade80' },
  { id: 'covid', label: 'COVID-19 (SDRA Viral)', color: '#f87171' },
  { id: 'neuro', label: 'Neuroprotecao (TCE / AVC)', color: '#a78bfa' },
  { id: 'trauma', label: 'Trauma Toracico', color: '#fb923c' },
  { id: 'intraop', label: 'Intra-Operatorio', color: '#60a5fa' },
  { id: 'cardio', label: 'Cardiopatas (ICC / IAM)', color: '#f87171' },
  { id: 'tep', label: 'TEP', color: '#a78bfa' },
  { id: 'obeso', label: 'Obeso (IMC > 30)', color: '#facc15' },
  { id: 'me', label: 'Morte Encefalica (Doador)', color: '#94a3b8' },
] as const

const TRE_TYPE_OPTIONS = [
  ['', 'Selecionar'],
  ['simples', 'Simples'],
  ['dificil', 'Dificil'],
  ['prolongado', 'Prolongado'],
] as const

const TRE_RESULT_OPTIONS = [
  ['', 'Selecionar'],
  ['sucesso', 'Sucesso'],
  ['falha', 'Falha'],
] as const

const PRONA_TIME_OPTIONS = ['16h', '18h', '20h', '24h'] as const

const SEDATIVE_OPTIONS = [
  '',
  'Midazolam',
  'Propofol',
  'Dexmedetomidina',
  'Fentanil',
  'Ketamina',
  'Remifentanil',
  'Sufentanil',
  'Morfina',
]

const BNM_OPTIONS = ['', 'Cisatracurio', 'Rocuronio', 'Pancuronio', 'Atracurio', 'Vecuronio']

type DrugTrend = 'manteve' | 'reduziu' | 'aumentou'

function calcDrugTrend(inicio: string, atual: string): DrugTrend | null {
  const i = parseFloat(inicio)
  const a = parseFloat(atual)
  if (isNaN(i) || isNaN(a)) return null
  if (a < i) return 'reduziu'
  if (a > i) return 'aumentou'
  return 'manteve'
}

type DrugAnalysis = {
  trend: DrugTrend
  label: string
  color: string
  indica: string
  evolucao: string
}

function analiseSedativo(inicio: string, atual: string): DrugAnalysis | null {
  const trend = calcDrugTrend(inicio, atual)
  if (!trend) return null
  const map: Record<DrugTrend, Omit<DrugAnalysis, 'trend'>> = {
    manteve: {
      label: 'Dose mantida',
      color: '#60a5fa',
      indica: 'Sedacao estavel. Paciente controlado, sem progressao de desmame. Avaliar abertura de janela de sedacao e RASS-alvo.',
      evolucao: 'Melhora: reducao gradual → janela diaria → suspensao. Piora: aumento de dose, risco de delirium de abstinencia ou tolerancia.',
    },
    reduziu: {
      label: 'Desmame em curso',
      color: '#4ade80',
      indica: 'Reducao de sedativo. Paciente mais reativo, monitorar RASS. Risco de agitacao, dor nao tratada e delirium hiperativo.',
      evolucao: 'Melhora: suspensao progressiva, extubacao ou desmame VM. Piora: retitulacao por agitacao, delirium ou instabilidade.',
    },
    aumentou: {
      label: 'Dose aumentada',
      color: '#f87171',
      indica: 'Escalonamento de sedacao. Indicar agitacao, dor inadequadamente tratada, delirium hiperativo ou desconforto ventilatório.',
      evolucao: 'Melhora: identificar e tratar causa (dor, delirium, assincronia) para permitir reducao. Piora: sedacao profunda, imobilidade, piora da funcao pulmonar.',
    },
  }
  return { trend, ...map[trend] }
}

function analiseBNM(inicio: string, atual: string): DrugAnalysis | null {
  const trend = calcDrugTrend(inicio, atual)
  if (!trend) return null
  const map: Record<DrugTrend, Omit<DrugAnalysis, 'trend'>> = {
    manteve: {
      label: 'BNM mantido',
      color: '#60a5fa',
      indica: 'Bloqueio neuromuscular estavel. Monitorar TOF (meta 0-2/4). Risco de fraqueza adquirida na UTI (ICUAW) e atrofia muscular.',
      evolucao: 'Melhora: reducao progressiva com TOF 2-3/4, retorno de drive (P0.1/Pocc), desmame. Piora: manutencao prolongada → fraqueza grave, dificuldade de desmame.',
    },
    reduziu: {
      label: 'Desmame BNM',
      color: '#4ade80',
      indica: 'Reducao de BNM. Retorno de esforco muscular. Monitorar P0.1, Pocc, drive respiratorio e assincronia. TOF pode estar 2-3/4.',
      evolucao: 'Melhora: suspensao do BNM, transicao para modo assistido, desmame VM. Piora: assincronia grave, SDRA nao controlada → retitulacao.',
    },
    aumentou: {
      label: 'BNM aumentado',
      color: '#f87171',
      indica: 'Escalonamento de BNM. Avaliar: assincronia grave, SDRA grave (P/F <150), hipertensao intracraniana ou instabilidade hemodinamica.',
      evolucao: 'Melhora: controle da causa base, reduzir para menor dose efetiva. Piora: bloqueio profundo prolongado → ICUAW, desmame prolongado.',
    },
  }
  return { trend, ...map[trend] }
}

const DVA_OPTIONS = ['', 'Noradrenalina', 'Adrenalina', 'Dobutamina', 'Vasopressina', 'Milrinona']

const MRC_GROUPS = [
  { label: 'Abducao de Ombro', right: 'mrcOmbroD', left: 'mrcOmbroE' },
  { label: 'Flexao de Cotovelo', right: 'mrcCotoveloD', left: 'mrcCotoveloE' },
  { label: 'Extensao de Punho', right: 'mrcPunhoD', left: 'mrcPunhoE' },
  { label: 'Flexao de Quadril', right: 'mrcQuadrilD', left: 'mrcQuadrilE' },
  { label: 'Extensao de Joelho', right: 'mrcJoelhoD', left: 'mrcJoelhoE' },
  { label: 'Dorsiflexao de Tornozelo', right: 'mrcTornozeloD', left: 'mrcTornozeloE' },
] as const

const PERME_ITEMS = [
  {
    key: 'permeEstado',
    label: 'Estado mental',
    options: [
      ['', '--'],
      ['0', 'Nao responde'],
      ['1', 'Responsivo a dor'],
      ['2', 'Responsivo a voz'],
      ['3', 'Alerta e orientado'],
    ],
  },
  {
    key: 'permeBarreira',
    label: 'Barreiras',
    options: [
      ['', '--'],
      ['0', '2 ou mais'],
      ['1', '1 barreira'],
      ['2', 'Nenhuma'],
    ],
  },
  {
    key: 'permeForcaMS',
    label: 'Forca MMSS',
    options: [
      ['', '--'],
      ['0', 'Sem mov.'],
      ['1', 'Sem gravidade'],
      ['2', 'Vence gravidade'],
      ['3', 'Resistencia'],
    ],
  },
  {
    key: 'permeForcaMI',
    label: 'Forca MMII',
    options: [
      ['', '--'],
      ['0', 'Sem mov.'],
      ['1', 'Sem gravidade'],
      ['2', 'Vence gravidade'],
      ['3', 'Resistencia'],
    ],
  },
  {
    key: 'permeLeito',
    label: 'Mobilidade no leito',
    options: [
      ['', '--'],
      ['0', 'Nao realiza'],
      ['1', 'Assist. total'],
      ['2', 'Assist. parcial'],
      ['3', 'Independente'],
    ],
  },
  {
    key: 'permeTransf',
    label: 'Transferencia',
    options: [
      ['', '--'],
      ['0', 'Nao realiza'],
      ['1', 'Assist. total'],
      ['2', 'Assist. parcial'],
      ['3', 'Independente'],
    ],
  },
  {
    key: 'permeMarcha',
    label: 'Marcha',
    options: [
      ['', '--'],
      ['0', 'Nao deambula'],
      ['1', 'Assist. total'],
      ['2', 'Assist. parcial'],
      ['3', 'Independente'],
    ],
  },
] as const

const IMS_OPTIONS = [
  ['', '--'],
  ['0', '0 - Imobilidade'],
  ['1', '1 - Exercicios no leito'],
  ['2', '2 - Cadeira passiva'],
  ['3', '3 - Sentado beira-leito'],
  ['4', '4 - Ortostatismo'],
  ['5', '5 - Transferencia'],
  ['6', '6 - Marcha estacionaria'],
  ['7', '7 - Marcha c/ 2+ pessoas'],
  ['8', '8 - Marcha c/ 1 pessoa'],
  ['9', '9 - Marcha c/ dispositivo'],
  ['10', '10 - Marcha independente'],
] as const

const TAB_ITEMS: Array<{ id: FormTab; label: string; icon: LucideIcon }> = [
  { id: 'dados', label: 'Dados', icon: FileText },
  { id: 'neuro', label: 'Neuro', icon: Brain },
  { id: 'cardio', label: 'Cardio', icon: HeartPulse },
  { id: 'resp', label: 'Resp', icon: Wind },
  { id: 'motora', label: 'Motora', icon: Zap },
  { id: 'percepcao', label: 'Pend.', icon: Activity },
]

function nowIso() {
  return new Date().toISOString()
}

function createRecord(): ICURecord {
  const timestamp = nowIso()
  return {
    ...emptyPatient(),
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

function normalizeRecord(raw: Partial<ICURecord> | null | undefined): ICURecord {
  const timestamp = nowIso()
  const base = emptyPatient()

  return {
    ...base,
    ...(raw ?? {}),
    id: raw?.id || globalThis.crypto?.randomUUID?.() || `icu-${Date.now()}`,
    createdAt: raw?.createdAt || timestamp,
    updatedAt: raw?.updatedAt || raw?.createdAt || timestamp,
    examesLabList: Array.isArray(raw?.examesLabList)
      ? raw.examesLabList.map((exam) => ({
        hb: '',
        ht: '',
        leuco: '',
        plaq: '',
        creat: '',
        ureia: '',
        k: '',
        na: '',
        lac: '',
        pcr: '',
        bt: '',
        alb: '',
        tgo: '',
        tgp: '',
        inr: '',
        ...(exam ?? {}),
      }))
      : [],
    examesImagemList: Array.isArray(raw?.examesImagemList)
      ? raw.examesImagemList.map((exam) => ({
        data: '',
        tipo: '',
        laudo: '',
        achados: Array.isArray(exam?.achados) ? exam.achados : [],
        ...(exam ?? {}),
      }))
      : [],
    sedativos: Array.isArray(raw?.sedativos) ? raw.sedativos : [],
    bnmList: Array.isArray(raw?.bnmList) ? raw.bnmList : [],
    dvaList: Array.isArray(raw?.dvaList) ? raw.dvaList : [],
    gasometrias: Array.isArray(raw?.gasometrias) ? raw.gasometrias : [],
    vmHist: Array.isArray(raw?.vmHist) ? raw.vmHist : [],
    peepOpt: ensurePeepOptRows(raw?.peepOpt as PeepOptEntry[] | undefined),
    curvaPxT: Array.isArray(raw?.curvaPxT) ? raw.curvaPxT : [],
    curvaFxT: Array.isArray(raw?.curvaFxT) ? raw.curvaFxT : [],
    curvaVxT: Array.isArray(raw?.curvaVxT) ? raw.curvaVxT : [],
    loopPV: Array.isArray(raw?.loopPV) ? raw.loopPV : [],
    loopFV: Array.isArray(raw?.loopFV) ? raw.loopFV : [],
    assincronia: Array.isArray(raw?.assincronia) ? raw.assincronia : [],
    protocoloVM: Array.isArray(raw?.protocoloVM) ? raw.protocoloVM : [],
  }
}

function parseNumber(value: unknown): number {
  const parsed = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDateTime(value: string) {
  if (!value) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function recordTitle(record: ICURecord) {
  return record.nome?.trim() || 'Paciente sem nome'
}

function recordSubtitle(record: ICURecord) {
  return record.diagnostico || 'Sem diagnostico informado'
}

function compactTone(text?: string | null) {
  if (!text) return 'text-white/54'
  return 'text-white/82'
}

function summarizeBalance(record: ICURecord) {
  const bal24 = parseNumber(record.balanco24h)
  const balAcc = parseNumber(record.balancoAcumulado)
  if (!record.balanco24h && !record.balancoAcumulado) return null

  if (bal24 > 2000 || balAcc > 5000) {
    return { text: 'Balanco muito positivo', color: '#f87171' }
  }
  if (bal24 > 500 || balAcc > 3000) {
    return { text: 'Retencao hidrica em vigilancia', color: '#facc15' }
  }
  if (bal24 < -1000 || balAcc < -2000) {
    return { text: 'Balanco negativo importante', color: '#fb923c' }
  }
  return { text: 'Balanco sob monitorizacao', color: '#4ade80' }
}

function summarizeBalanceDetailed(record: ICURecord) {
  const bal24 = parseNumber(record.balanco24h)
  const balAcc = parseNumber(record.balancoAcumulado)
  if (!record.balanco24h && !record.balancoAcumulado) return null
  if (bal24 > 2000 || balAcc > 5000) return 'Balanco fortemente positivo — risco de sobrecarga hidrica, edema pulmonar e comprometimento ventilatório. Revisar aporte, estimular diurese e considerar restricao de fluidos.'
  if (bal24 > 500 || balAcc > 3000) return 'Balanco moderadamente positivo — monitorar sinais de congestao pulmonar, resposta renal e saturacao. Avaliar necessidade de restricao hidrica e diuretico.'
  if (bal24 < -1000 || balAcc < -2000) return 'Balanco negativo significativo — avaliar perfusao tecidual, pressao arterial, diurese e necessidade de reposicao volemica. Correlacionar com status hemodinamico.'
  return 'Balanco em faixa monitorada — manter correlacao clinica com hemodinamica, perfusao periferica e diurese.'
}

function analyzeLabExam(exam: LabExamEntry) {
  const items: Array<{ label: string; interp: string; color: string }> = []
  const alerts: Array<{ text: string; color: string }> = []
  const pushItem = (label: string, interp: string, color: string) => items.push({ label, interp, color })

  const hb = parseNumber(exam.hb)
  if (exam.hb) pushItem('HB', hb < 7 ? 'Anemia grave' : hb < 10 ? 'Anemia' : 'Faixa aceitavel', hb < 7 ? '#f87171' : hb < 10 ? '#facc15' : '#4ade80')
  const leuco = parseNumber(exam.leuco)
  if (exam.leuco) pushItem('Leuco', leuco > 11000 ? 'Leucocitose' : leuco < 4000 ? 'Leucopenia' : 'Faixa esperada', leuco > 11000 || leuco < 4000 ? '#fb923c' : '#4ade80')
  const plaq = parseNumber(exam.plaq)
  if (exam.plaq) pushItem('Plaq', plaq < 50000 ? 'Plaquetopenia grave' : plaq < 150000 ? 'Plaquetopenia' : 'Faixa esperada', plaq < 50000 ? '#f87171' : plaq < 150000 ? '#facc15' : '#4ade80')
  const creat = parseNumber(exam.creat)
  if (exam.creat) pushItem('Creat', creat > 2 ? 'Lesao renal importante' : creat > 1.2 ? 'Creat elevada' : 'Faixa esperada', creat > 2 ? '#f87171' : creat > 1.2 ? '#facc15' : '#4ade80')
  const ureia = parseNumber(exam.ureia)
  if (exam.ureia) pushItem('Ureia', ureia > 80 ? 'Elevada' : 'Faixa esperada', ureia > 80 ? '#fb923c' : '#4ade80')
  const potassium = parseNumber(exam.k)
  if (exam.k) pushItem('K+', potassium > 5.5 ? 'Hipercalemia' : potassium < 3.5 ? 'Hipocalemia' : 'Faixa esperada', potassium > 5.5 || potassium < 3.5 ? '#f87171' : '#4ade80')
  const sodium = parseNumber(exam.na)
  if (exam.na) pushItem('Na+', sodium > 145 ? 'Hipernatremia' : sodium < 135 ? 'Hiponatremia' : 'Faixa esperada', sodium > 145 || sodium < 135 ? '#fb923c' : '#4ade80')
  const lactate = parseNumber(exam.lac)
  if (exam.lac) pushItem('Lactato', lactate >= 4 ? 'Hipoperfusao importante' : lactate >= 2 ? 'Elevado' : 'Faixa esperada', lactate >= 4 ? '#f87171' : lactate >= 2 ? '#facc15' : '#4ade80')
  const pcr = parseNumber(exam.pcr)
  if (exam.pcr) pushItem('PCR', pcr > 100 ? 'Inflamacao intensa' : pcr > 5 ? 'Inflamacao ativa' : 'Faixa esperada', pcr > 100 ? '#f87171' : pcr > 5 ? '#facc15' : '#4ade80')
  const inr = parseNumber(exam.inr)
  if (exam.inr) pushItem('INR', inr > 1.5 ? 'Coagulopatia' : 'Faixa esperada', inr > 1.5 ? '#fb923c' : '#4ade80')

  if (hb && hb < 7) alerts.push({ text: 'Considerar estrategia transfusional conforme contexto clinico', color: '#f87171' })
  if (lactate && lactate >= 4) alerts.push({ text: 'Lactato elevado, correlacionar com perfusao e choque', color: '#fb923c' })
  if (potassium && (potassium > 5.5 || potassium < 3.0)) alerts.push({ text: 'Potassio critico, revisar ECG e correcao imediata', color: '#f87171' })

  return { items, alerts }
}

function summarizeMrc(record: ICURecord) {
  const scores = MRC_GROUPS.flatMap((group) => [record[group.right], record[group.left]])
  if (scores.some((score) => score === '')) return null

  const total = scores.reduce((sum, score) => sum + parseNumber(score), 0)
  if (total >= 48) return { total, text: 'Normal (>=48)', color: '#4ade80' }
  if (total >= 36) return { total, text: 'Fraqueza leve', color: '#facc15' }
  if (total >= 24) return { total, text: 'Fraqueza moderada', color: '#fb923c' }
  return { total, text: 'ICU-AW grave', color: '#f87171' }
}

function summarizePerme(record: ICURecord) {
  const values = PERME_ITEMS.map((item) => record[item.key])
  if (values.some((value) => value === '')) return null

  const total = values.reduce((sum, value) => sum + parseNumber(value), 0)
  if (total >= 16) return { total, text: 'Alta (16-21)', color: '#4ade80' }
  if (total >= 8) return { total, text: 'Moderada (8-15)', color: '#facc15' }
  return { total, text: 'Baixa (0-7)', color: '#f87171' }
}

function summarizeIms(score: string) {
  if (!score) return null
  const value = parseNumber(score)
  if (value >= 7) return { value, text: 'Alta', color: '#4ade80' }
  if (value >= 4) return { value, text: 'Moderada', color: '#facc15' }
  if (value >= 1) return { value, text: 'Baixa', color: '#fb923c' }
  return { value, text: 'Imobilidade', color: '#f87171' }
}

function calcDays(value: string) {
  if (!value) return null
  const start = new Date(value)
  if (Number.isNaN(start.getTime())) return null
  const diff = Date.now() - start.getTime()
  return Math.max(1, Math.floor(diff / 86400000) + 1)
}

function calcSF(spo2: string, fio2: string) {
  const sat = parseNumber(spo2)
  const fi = parseNumber(fio2)
  if (!sat || !fi) return null
  return sat / (fi / 100)
}

function calcResist(pico: string, plato: string, fluxo: string) {
  const pi = parseNumber(pico)
  const pl = parseNumber(plato)
  const fl = parseNumber(fluxo)
  if (!pi || !pl) return null
  if (fl > 0) return (pi - pl) / (fl / 60)
  return pi - pl
}

function getModeType(mode: string) {
  if (VM_MODE_GROUPS.volume.includes(mode as (typeof VM_MODE_GROUPS.volume)[number])) return 'volume'
  if (VM_MODE_GROUPS.pressure.includes(mode as (typeof VM_MODE_GROUPS.pressure)[number])) return 'pressure'
  if (VM_MODE_GROUPS.spontaneous.includes(mode as (typeof VM_MODE_GROUPS.spontaneous)[number])) return 'spontaneous'
  return 'other'
}

function ensurePeepOptRows(rows: PeepOptEntry[] | null | undefined): PeepOptEntry[] {
  const base = Array.isArray(rows) ? rows.slice(0, 3) : []
  while (base.length < 3) {
    base.push({ peep: '', plato: '', si: '' })
  }
  return base.map((row) => ({
    peep: row?.peep ?? '',
    plato: row?.plato ?? '',
    si: row?.si ?? '',
  }))
}

function parseStressIndexInput(value: string) {
  const normalized = String(value || '').trim().replace(',', '.')
  if (!normalized) return null
  if (normalized.includes('=')) return 1
  if (normalized.includes('<')) return 0.85
  if (normalized.includes('>')) return 1.15
  const numeric = Number.parseFloat(normalized)
  return Number.isFinite(numeric) ? numeric : null
}

function ActionButton({
  icon: Icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-[0.8rem] border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all ${active
          ? 'border-white/18 bg-white/12 text-white'
          : 'border-white/10 bg-black/18 text-white/62 hover:border-white/16 hover:text-white'
        }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
      {typeof badge === 'number' && badge > 0 ? (
        <span className="rounded-full border border-white/12 px-1.5 py-0.5 text-[9px] text-white/74">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function FieldShell({
  label,
  children,
  span = '',
}: {
  label: string
  children: ReactNode
  span?: string
}) {
  return (
    <div className={`space-y-2 ${span}`}>
      <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">{label}</p>
      {children}
    </div>
  )
}

function MetricChip({
  label,
  value,
  hint,
  color,
}: {
  label: string
  value: string
  hint?: string | null
  color?: string
}) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-[0.18em] text-white/38">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white/92" style={color ? { color } : undefined}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-[10px] leading-relaxed text-white/48">{hint}</p> : null}
    </div>
  )
}

function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      rows={1}
      className={AUTO_TEXTAREA_CLASS}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onInput={(event) => {
        const target = event.currentTarget
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }}
      placeholder={placeholder}
    />
  )
}

function StatusChoice({
  value,
  active,
  onClick,
}: {
  value: keyof typeof STATUS_STYLES
  active: boolean
  onClick: () => void
}) {
  const meta = STATUS_STYLES[value]
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all"
      style={{
        borderColor: active ? meta.border : 'rgba(255,255,255,0.12)',
        background: active ? meta.background : 'rgba(255,255,255,0.03)',
        color: active ? meta.color : 'rgba(255,255,255,0.62)',
      }}
    >
      {meta.label}
    </button>
  )
}

export function ProntuarioSystemPanel() {
  const [view, setView] = useState<PanelView>('records')
  const [records, setRecords] = useState<ICURecord[]>([])
  const [archive, setArchive] = useState<ICURecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FormTab>('dados')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem(STORAGE_KEYS.records)
      const storedArchive = localStorage.getItem(STORAGE_KEYS.archive)

      if (storedRecords) {
        setRecords((JSON.parse(storedRecords) as Array<Partial<ICURecord>>).map((record) => normalizeRecord(record)))
      }
      if (storedArchive) {
        setArchive((JSON.parse(storedArchive) as Array<Partial<ICURecord>>).map((record) => normalizeRecord(record)))
      }
    } catch {
      setRecords([])
      setArchive([])
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records))
    localStorage.setItem(STORAGE_KEYS.archive, JSON.stringify(archive))
  }, [archive, hydrated, records])

  useEffect(() => {
    if (selectedId && !records.some((record) => record.id === selectedId)) {
      setSelectedId(null)
    }
  }, [records, selectedId])

  useEffect(() => {
    if (!selectedId) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab, selectedId])

  const currentRecord = records.find((record) => record.id === selectedId) ?? null

  const recordBadges = useMemo(() => {
    const viaCounts = {
      TOT: 0,
      'TQT-AA': 0,
      'TQT-O2': 0,
      'TQT-VM': 0,
      'TQT-P': 0,
      'RE-AA': 0,
      'RE-O2': 0,
      'RE-MFS': 0,
      'RE-MFR': 0,
      'RE-MFV': 0,
      VNI: 0,
      HFNC: 0,
      RPPI: 0,
    } as Record<string, number>
    const statusCounts = {
      estavel: 0,
      grave: 0,
      critico: 0,
      instavel: 0,
    } as Record<string, number>

    records.forEach((record) => {
      const via = record.tipoVia
      if (via === 'TOT' || via === 'TNT' || via === 'ML') viaCounts.TOT += 1
      else if (via in viaCounts) viaCounts[via] += 1

      if (record.statusClinico && record.statusClinico in statusCounts) {
        statusCounts[record.statusClinico] += 1
      }
    })

    return { viaCounts, statusCounts }
  }, [records])

  const calculations = useMemo(() => {
    if (!currentRecord) return null

    const modeType = getModeType(currentRecord.modoVM)
    const pesoIdeal = currentRecord.altura
      ? calcPesoIdeal(parseNumber(currentRecord.altura), currentRecord.sexo || 'M')
      : 0
    const pf = calcPF(parseNumber(currentRecord.gasoPaO2), parseNumber(currentRecord.gasoFiO2) || parseNumber(currentRecord.fio2))
    const pfInterp = pf ? interpPF(pf) : null
    const dp = calcDP(parseNumber(currentRecord.pplato), parseNumber(currentRecord.peep))
    const cest = calcCest(parseNumber(currentRecord.vt), dp || 0)
    const glasgow = calcGlasgow(
      parseNumber(currentRecord.glasgowO),
      currentRecord.glasgowV || '',
      parseNumber(currentRecord.glasgowM),
    )
    const rsbi = calcRSBI(parseNumber(currentRecord.fr), parseNumber(currentRecord.vc))
    const rsbiInterp = rsbi ? interpRSBI(rsbi) : null
    const raw = calcResist(currentRecord.ppico, currentRecord.pplato, currentRecord.fluxo)
    const gaso = analisarGaso({
      gasoPH: parseNumber(currentRecord.gasoPH),
      gasoPaCO2: parseNumber(currentRecord.gasoPaCO2),
      gasoHCO3: parseNumber(currentRecord.gasoHCO3),
    })
    const p01Interp = currentRecord.p01 ? interpP01(parseNumber(currentRecord.p01)) : null
    const poccInterp = currentRecord.pocc ? interpPocc(parseNumber(currentRecord.pocc)) : null
    const pmusc = currentRecord.pocc ? calcPmusc(parseNumber(currentRecord.pocc)) : null
    const pmuscInterp = pmusc ? interpPmusc(pmusc) : null
    const pamAuto =
      currentRecord.pas && currentRecord.pad
        ? Math.round((parseNumber(currentRecord.pad) * 2 + parseNumber(currentRecord.pas)) / 3)
        : null
    const balance = summarizeBalance(currentRecord)
    const balanceDetailed = summarizeBalanceDetailed(currentRecord)
    const mrc = summarizeMrc(currentRecord)
    const perme = summarizePerme(currentRecord)
    const ims = summarizeIms(currentRecord.imsScore)
    const daysTOT = calcDays(currentRecord.dataTOT)
    const daysTQT = calcDays(currentRecord.dataTQT)
    const vtTargets = pesoIdeal
      ? [4, 5, 6, 7, 8].map((multiplier) => ({
        multiplier,
        value: Math.round(pesoIdeal * multiplier),
      }))
      : []
    const sf = calcSF(currentRecord.sfSpO2, currentRecord.sfFiO2)
    const minuteVentilation =
      parseNumber(currentRecord.ve) || (parseNumber(currentRecord.fr) && (parseNumber(currentRecord.vc) || parseNumber(currentRecord.vt))
        ? (parseNumber(currentRecord.fr) * (parseNumber(currentRecord.vc) || parseNumber(currentRecord.vt))) / 1000
        : null)

    const weanMinuteVentilation =
      parseNumber(currentRecord.dFrDesm) && parseNumber(currentRecord.dVcDesm)
        ? (parseNumber(currentRecord.dFrDesm) * parseNumber(currentRecord.dVcDesm)) / 1000
        : null
    const weanRsbi = calcRSBI(parseNumber(currentRecord.dFrDesm), parseNumber(currentRecord.dVcDesm))
    const pimaxAdequate = currentRecord.dPimax ? parseNumber(currentRecord.dPimax) <= -30 : false
    const pemaxAdequate = currentRecord.dPemax ? parseNumber(currentRecord.dPemax) >= 60 : false
    const cvAdequate = currentRecord.dCv ? parseNumber(currentRecord.dCv) >= 15 : false
    const rsbiAdequate = typeof weanRsbi === 'number' ? weanRsbi < 80 : false
    const weanCriteriaMet = [pimaxAdequate, pemaxAdequate, cvAdequate, rsbiAdequate].filter(Boolean).length
    const weanSummary =
      weanCriteriaMet === 4
        ? { text: 'Favoravel ao desmame', color: '#4ade80' }
        : weanCriteriaMet >= 2
          ? { text: 'Zona intermediaria', color: '#facc15' }
          : { text: 'Alta vigilancia', color: '#f87171' }

    const peepOptRows = ensurePeepOptRows(currentRecord.peepOpt)
    const peepOptCandidates = peepOptRows
      .map((row, index) => {
        const peep = parseNumber(row.peep)
        const plato = parseNumber(row.plato)
        const stressIndex = parseStressIndexInput(row.si)
        if (!peep || !plato || stressIndex === null) return null
        const dpRow = plato - peep
        const dpScore = dpRow < 12 ? 3 : dpRow <= 15 ? 2 : 0
        const siDelta = Math.abs(stressIndex - 1)
        const siScore = siDelta <= 0.1 ? 4 : siDelta <= 0.2 ? 2 : 0
        return {
          index,
          peep,
          plato,
          stressIndex,
          dp: dpRow,
          score: dpScore + siScore,
        }
      })
      .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
      .sort((a, b) => b.score - a.score || Math.abs(a.stressIndex - 1) - Math.abs(b.stressIndex - 1) || a.dp - b.dp)
    const peepOptBest = peepOptCandidates[0] ?? null

    const recruitDiff =
      parseNumber(currentRecord.recVolInsp) && parseNumber(currentRecord.recVolExp)
        ? parseNumber(currentRecord.recVolInsp) - parseNumber(currentRecord.recVolExp)
        : null
    const recruitSummary =
      recruitDiff === null
        ? null
        : recruitDiff > 500
          ? { text: 'Pulmao recrutavel', color: '#4ade80' }
          : { text: 'Pouco recrutavel', color: '#f87171' }

    const pronaAtiva = currentRecord.pronaAtiva === '1'
    const proneSupineAt =
      pronaAtiva && currentRecord.pronaData && currentRecord.pronaHora && currentRecord.pronaTempo
        ? (() => {
          const start = new Date(`${currentRecord.pronaData}T${currentRecord.pronaHora}`)
          const hours = Number.parseInt(currentRecord.pronaTempo.replace('h', ''), 10)
          if (Number.isNaN(start.getTime()) || Number.isNaN(hours)) return null
          return new Date(start.getTime() + hours * 3600000)
        })()
        : null

    return {
      modeType,
      pesoIdeal,
      pf,
      pfInterp,
      dp,
      cest,
      glasgow,
      rsbi,
      rsbiInterp,
      raw,
      gaso,
      p01Interp,
      poccInterp,
      pmusc,
      pmuscInterp,
      pamAuto,
      balance,
      balanceDetailed,
      mrc,
      perme,
      ims,
      daysTOT,
      daysTQT,
      vtTargets,
      sf,
      minuteVentilation,
      weanMinuteVentilation,
      weanRsbi,
      weanSummary,
      pimaxAdequate,
      pemaxAdequate,
      cvAdequate,
      rsbiAdequate,
      peepOptRows,
      peepOptBest,
      recruitDiff,
      recruitSummary,
      proneSupineAt,
      pronaAtiva,
    }
  }, [currentRecord])

  const updateCurrentRecord = (updater: (record: ICURecord) => ICURecord) => {
    if (!selectedId) return

    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== selectedId) return record
        return updater({
          ...record,
          updatedAt: nowIso(),
        })
      }),
    )
  }

  const setField = (field: keyof PatientData, value: string) => {
    updateCurrentRecord((record) => ({
      ...record,
      [field]: value,
    }))
  }

  const toggleStringArrayField = (
    field: 'curvaPxT' | 'curvaFxT' | 'curvaVxT' | 'loopPV' | 'loopFV' | 'assincronia' | 'protocoloVM',
    value: string,
  ) => {
    if (!value) return

    updateCurrentRecord((record) => {
      const current = Array.isArray(record[field]) ? [...record[field]] : []
      return {
        ...record,
        [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      }
    })
  }

  const removeStringArrayItem = (
    field: 'curvaPxT' | 'curvaFxT' | 'curvaVxT' | 'loopPV' | 'loopFV' | 'assincronia' | 'protocoloVM',
    value: string,
  ) => {
    updateCurrentRecord((record) => ({
      ...record,
      [field]: (Array.isArray(record[field]) ? record[field] : []).filter((item) => item !== value),
    }))
  }

  const setPeepOptField = (index: number, field: keyof PeepOptEntry, value: string) => {
    updateCurrentRecord((record) => {
      const next = ensurePeepOptRows(record.peepOpt)
      next[index] = { ...next[index], [field]: value }
      return {
        ...record,
        peepOpt: next,
      }
    })
  }

  const renderRespSelectionField = (
    label: string,
    field: 'curvaPxT' | 'curvaFxT' | 'curvaVxT' | 'loopPV' | 'loopFV' | 'assincronia',
    options: readonly string[],
    icon: string,
  ) => (
    <div className="rounded-[1.2rem] border border-white/10 bg-black/16 p-4">
      <FieldShell label={`${icon} ${label}`}>
        <select
          className={INPUT_CLASS}
          defaultValue=""
          onChange={(event) => {
            toggleStringArrayField(field, event.target.value)
            event.target.selectedIndex = 0
          }}
        >
          <option value="">Selecione alteracoes...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>

      {(currentRecord?.[field] as string[])?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(currentRecord?.[field] as string[]).map((item) => {
            const ok = item.startsWith('Normal') || item === 'Sem assincronias'
            return (
              <div
                key={`${field}-${item}`}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px]"
                style={{
                  borderColor: ok ? 'rgba(74,222,128,0.28)' : 'rgba(251,146,60,0.28)',
                  background: ok ? 'rgba(74,222,128,0.08)' : 'rgba(251,146,60,0.08)',
                  color: ok ? '#86efac' : '#fdba74',
                }}
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeStringArrayItem(field, item)}
                  className="text-[12px] leading-none text-[#fca5a5]"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )

  const addListItem = (key: ListFieldKey) => {
    updateCurrentRecord((record) => {
      const next = [...(record[key] as Array<Record<string, string>>)]

      if (key === 'sedativos') {
        next.push({ droga: '', inicio: '', atual: '', unidade: 'ml/h' } satisfies SedativeEntry)
      } else if (key === 'bnmList') {
        next.push({ droga: '', inicio: '', atual: '', unidade: 'ml/h' } satisfies BNMEntry)
      } else if (key === 'dvaList') {
        next.push({ droga: '', dose: '', unidade: 'mcg/kg/min' } satisfies DVAEntry)
      } else if (key === 'examesLabList') {
        next.push({
          data: '',
          hb: '',
          ht: '',
          leuco: '',
          plaq: '',
          creat: '',
          ureia: '',
          k: '',
          na: '',
          lac: '',
          pcr: '',
          bt: '',
          alb: '',
          tgo: '',
          tgp: '',
          inr: '',
        } satisfies LabExamEntry)
      } else if (key === 'examesImagemList') {
        next.push({ data: '', tipo: '', laudo: '', achados: [] } satisfies ImageExamEntry)
      }

      return {
        ...record,
        [key]: next,
      }
    })
  }

  const updateListItem = (key: ListFieldKey, index: number, field: string, value: string) => {
    updateCurrentRecord((record) => {
      const next = [...(record[key] as Array<Record<string, string>>)]
      next[index] = { ...next[index], [field]: value }

      return {
        ...record,
        [key]: next,
      }
    })
  }

  const removeListItem = (key: ListFieldKey, index: number) => {
    updateCurrentRecord((record) => ({
      ...record,
      [key]: (record[key] as Array<Record<string, string>>).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const toggleImageFinding = (index: number, value: string) => {
    if (!value) return
    updateCurrentRecord((record) => {
      const next = [...record.examesImagemList]
      const current = Array.isArray(next[index]?.achados) ? next[index].achados : []
      next[index] = {
        ...next[index],
        achados: current.includes(value) ? current : [...current, value],
      }
      return {
        ...record,
        examesImagemList: next,
      }
    })
  }

  const removeImageFinding = (index: number, value: string) => {
    updateCurrentRecord((record) => {
      const next = [...record.examesImagemList]
      next[index] = {
        ...next[index],
        achados: (next[index]?.achados || []).filter((item) => item !== value),
      }
      return {
        ...record,
        examesImagemList: next,
      }
    })
  }

  const clearRespFields = () => {
    updateCurrentRecord((record) => ({
      ...record,
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
      p01: '',
      pocc: '',
      pmusc: '',
      ipap: '',
      epap: '',
      interfaceVNI: 'facial',
      peepOpt: ensurePeepOptRows([]),
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
    }))
  }

  const clearGaso = () => {
    updateCurrentRecord((record) => ({
      ...record,
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
    }))
  }

  const saveGaso = () => {
    if (!currentRecord) return

    const entry: GasometryHistoryEntry = {
      ts: nowIso(),
      data: currentRecord.gasoData,
      hora: currentRecord.gasoHora,
      pH: currentRecord.gasoPH,
      paCO2: currentRecord.gasoPaCO2,
      paO2: currentRecord.gasoPaO2,
      hco3: currentRecord.gasoHCO3,
      be: currentRecord.gasoBE,
      sao2: currentRecord.gasoSaO2,
      lactato: currentRecord.gasoLactato,
      fio2: currentRecord.gasoFiO2,
      sf: calculations?.sf ? calculations.sf.toFixed(0) : '',
      pf: calculations?.pf ? calculations.pf.toFixed(0) : '',
      analise: calculations?.gaso?.full || '',
      obs: currentRecord.gasoObs,
    }

    if (!entry.pH && !entry.paCO2 && !entry.paO2) return

    updateCurrentRecord((record) => ({
      ...record,
      gasometrias: [entry, ...record.gasometrias],
    }))
  }

  const deleteGaso = (index: number) => {
    updateCurrentRecord((record) => ({
      ...record,
      gasometrias: record.gasometrias.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const saveVM = () => {
    if (!currentRecord) return

    const entry: VMHistoryEntry = {
      ts: nowIso(),
      modo: currentRecord.modoVM,
      vt: currentRecord.vt,
      vc: currentRecord.vc,
      ve: currentRecord.ve || (calculations?.minuteVentilation ? calculations.minuteVentilation.toFixed(1) : ''),
      fr: currentRecord.fr,
      peep: currentRecord.peep,
      fio2: currentRecord.fio2,
      fluxo: currentRecord.fluxo,
      trigger: currentRecord.trigger,
      ti: currentRecord.ti,
      ie: currentRecord.ie,
      ppico: currentRecord.ppico,
      pplato: currentRecord.pplato,
      pmean: currentRecord.pmean,
      ps: currentRecord.ps,
      ipap: currentRecord.ipap,
      epap: currentRecord.epap,
      p01: currentRecord.p01,
      pocc: currentRecord.pocc,
      pmusc: calculations?.pmusc ? calculations.pmusc.toFixed(1) : currentRecord.pmusc,
      dp: calculations?.dp ? calculations.dp.toFixed(1) : '',
      cest: calculations?.cest ? calculations.cest.toFixed(1) : '',
      raw: calculations?.raw ? calculations.raw.toFixed(1) : '',
    }

    if (!entry.modo && !entry.vt && !entry.ps) return

    updateCurrentRecord((record) => ({
      ...record,
      pmusc: entry.pmusc,
      vmHist: [entry, ...record.vmHist],
    }))
  }

  const deleteVM = (index: number) => {
    updateCurrentRecord((record) => ({
      ...record,
      vmHist: record.vmHist.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const addRecord = () => {
    const record = createRecord()
    setRecords((prev) => [record, ...prev])
    setSelectedId(record.id)
    setActiveTab('dados')
    setView('records')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openRecord = (id: string) => {
    setSelectedId(id)
    setActiveTab('dados')
    setView('records')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const archiveRecord = (id: string) => {
    setRecords((prev) => {
      const target = prev.find((record) => record.id === id)
      if (!target) return prev
      setArchive((current) => [{ ...target, updatedAt: nowIso() }, ...current])
      return prev.filter((record) => record.id !== id)
    })

    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  const restoreRecord = (id: string) => {
    setArchive((prev) => {
      const target = prev.find((record) => record.id === id)
      if (!target) return prev
      setRecords((current) => [{ ...target, updatedAt: nowIso() }, ...current])
      return prev.filter((record) => record.id !== id)
    })
    setView('records')
  }

  const deletePermanently = (id: string) => {
    setArchive((prev) => prev.filter((record) => record.id !== id))
  }

  const deleteActiveRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  const moveRecord = (id: string, direction: 'up' | 'down') => {
    setRecords((prev) => {
      const index = prev.findIndex((r) => r.id === id)
      if (index === -1) return prev
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev
      const next = [...prev]
      const swap = direction === 'up' ? index - 1 : index + 1
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  const saveAndClose = () => {
    if (!currentRecord) return
    updateCurrentRecord((record) => record)
    setSelectedId(null)
  }

  const tabIndex = TAB_ITEMS.findIndex((tab) => tab.id === activeTab)
  const respModeType = calculations?.modeType ?? 'other'
  const peepRows = calculations?.peepOptRows ?? ensurePeepOptRows([])
  const proneActive = calculations?.pronaAtiva ?? false

  return (
    <div className="space-y-5">
      <div className="chrome-board rounded-[1.8rem] p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="chrome-subtle flex h-14 w-14 items-center justify-center rounded-[1.2rem]">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
                  Prontuario ICU
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
                  {records.length} ativos
                </span>
              </div>
              <h3 className="text-[1.45rem] font-semibold text-white/92">Pacientes e referencia clinica</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(recordBadges.viaCounts).map(([key, count]) =>
                  count > 0 ? (
                    <span
                      key={key}
                      className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        borderColor: VIA_BADGE_STYLES[key]?.border ?? 'rgba(255,255,255,0.12)',
                        background: VIA_BADGE_STYLES[key]?.background ?? 'rgba(255,255,255,0.05)',
                        color: VIA_BADGE_STYLES[key]?.color ?? 'rgba(255,255,255,0.72)',
                      }}
                    >
                      {VIA_BADGE_STYLES[key]?.label ?? key}: {count}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              icon={Archive}
              label="Arquivo"
              badge={archive.length}
              active={view === 'archive'}
              onClick={() => setView('archive')}
            />
            <ActionButton
              icon={BookOpen}
              label="Referencia Clinica"
              active={view === 'reference'}
              onClick={() => setView('reference')}
            />
            <ActionButton icon={Plus} label="Adicionar" onClick={addRecord} />
          </div>
        </div>

        {view === 'reference' ? (
          <ICUSystemPanel />
        ) : view === 'archive' ? (
          <div className="space-y-4">
            {archive.length ? (
              archive.map((record) => (
                <div
                  key={record.id}
                  className="chrome-panel flex flex-col gap-4 rounded-[1.35rem] p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="chrome-subtle flex h-12 w-12 items-center justify-center rounded-[1rem]">
                      <Archive className="h-5 w-5 text-white/72" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white/88">{recordTitle(record)}</p>
                      <p className="mt-1 text-sm text-white/58">{recordSubtitle(record)}</p>
                      <p className="mt-2 text-xs text-white/38">Arquivado em {formatDateTime(record.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => restoreRecord(record.id)}
                      className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restaurar
                    </button>
                    <button
                      onClick={() => deletePermanently(record.id)}
                      className="inline-flex items-center gap-2 rounded-[1rem] border border-[#f8717130] bg-[#f8717110] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fca5a5]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Apagar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="chrome-panel rounded-[1.45rem] p-8 text-center">
                <p className="text-sm text-white/56">Arquivo vazio.</p>
              </div>
            )}
          </div>
        ) : currentRecord ? (
          <div className="space-y-5">
            <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]"
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </button>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Leito {currentRecord.leito || '--'}</p>
                    <h4 className="text-lg font-semibold text-white/92">{recordTitle(currentRecord)}</h4>
                    <p className={`mt-1 text-sm ${compactTone(recordSubtitle(currentRecord))}`}>{recordSubtitle(currentRecord)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={saveAndClose}
                    className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </button>
                  <button
                    onClick={() => archiveRecord(currentRecord.id)}
                    className="inline-flex items-center gap-2 rounded-[1rem] border border-[#facc1530] bg-[#facc150d] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fde68a]"
                  >
                    <Archive className="h-4 w-4" />
                    Arquivar
                  </button>
                  <button
                    onClick={() => deleteActiveRecord(currentRecord.id)}
                    className="inline-flex items-center gap-2 rounded-[1rem] border border-[#f8717130] bg-[#f8717110] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fca5a5]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Apagar
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {TAB_ITEMS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex min-w-fit items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/48 hover:text-white/76'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {activeTab === 'dados' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Identificacao / Antropometria
                    </p>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/46">
                      Atualizado {formatDateTime(currentRecord.updatedAt)}
                    </span>
                  </div>

                  {/* Nome — linha própria */}
                  <div className="mb-3">
                    <FieldShell label="Nome">
                      <input
                        className={INPUT_CLASS}
                        value={currentRecord.nome}
                        onChange={(event) => setField('nome', event.target.value)}
                        placeholder="Nome do paciente"
                      />
                    </FieldShell>
                  </div>

                  {/* Linha única compacta */}
                  <div className="grid grid-cols-10 gap-2">
                    <FieldShell label="Lt">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.leito}
                        onChange={(event) => setField('leito', event.target.value)}
                        placeholder="01"
                      />
                    </FieldShell>
                    <FieldShell label="Clin">
                      <select
                        className={INPUT_CLASS_SM}
                        value={currentRecord.statusClinico}
                        onChange={(event) => setField('statusClinico', event.target.value)}
                        style={currentRecord.statusClinico && STATUS_STYLES[currentRecord.statusClinico] ? {
                          borderColor: STATUS_STYLES[currentRecord.statusClinico].border,
                          color: STATUS_STYLES[currentRecord.statusClinico].color,
                        } : undefined}
                      >
                        {STATUS_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FieldShell>
                    <FieldShell label="Id">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.idade}
                        onChange={(event) => setField('idade', event.target.value)}
                        placeholder="45"
                        type="number"
                      />
                    </FieldShell>
                    <FieldShell label="Sexo">
                      <select
                        className={INPUT_CLASS_SM}
                        value={currentRecord.sexo}
                        onChange={(event) => setField('sexo', event.target.value)}
                      >
                        <option value="">--</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </FieldShell>
                    <FieldShell label="Peso">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.peso}
                        onChange={(event) => setField('peso', event.target.value)}
                        placeholder="70"
                        type="number"
                      />
                    </FieldShell>
                    <FieldShell label="Alt">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.altura}
                        onChange={(event) => setField('altura', event.target.value)}
                        placeholder="170"
                        type="number"
                      />
                    </FieldShell>
                    <FieldShell label="PsAt">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.pesoAtual}
                        onChange={(event) => setField('pesoAtual', event.target.value)}
                        placeholder="68"
                        type="number"
                      />
                    </FieldShell>
                    <FieldShell label="PBW">
                      <div className="w-full rounded-[0.7rem] border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white/88">
                        {calculations?.pesoIdeal ? `${calculations.pesoIdeal.toFixed(1)} kg` : '--'}
                      </div>
                    </FieldShell>
                    <FieldShell label="Bl24">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.balanco24h}
                        onChange={(event) => setField('balanco24h', event.target.value)}
                        placeholder="+500"
                        type="number"
                      />
                    </FieldShell>
                    <FieldShell label="BlAc">
                      <input
                        className={INPUT_CLASS_SM}
                        value={currentRecord.balancoAcumulado}
                        onChange={(event) => setField('balancoAcumulado', event.target.value)}
                        placeholder="+2500"
                        type="number"
                      />
                    </FieldShell>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5">
                      <div className="flex flex-wrap justify-center items-center gap-1.5">
                        {calculations?.vtTargets?.length ? (
                          calculations.vtTargets.map((target) => (
                            <span
                              key={target.multiplier}
                              className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
                              style={target.multiplier === 6 ? {
                                borderColor: 'rgba(34,211,238,0.40)',
                                background: 'rgba(34,211,238,0.14)',
                                color: '#22d3ee',
                              } : {
                                borderColor: 'rgba(255,255,255,0.10)',
                                background: 'rgba(0,0,0,0.16)',
                                color: 'rgba(255,255,255,0.62)',
                              }}
                            >
                              {target.multiplier === 6 ? '★ ' : ''}VC {target.multiplier} mL/kg: {target.value} mL
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-white/46">Informe sexo e altura para calcular PBW e VC alvo.</span>
                        )}
                      </div>
                    </div>

                    {calculations?.balance ? (
                      <div
                        className="rounded-[1rem] border px-3 py-3"
                        style={{
                          borderColor: `${calculations.balance.color}30`,
                          background: `${calculations.balance.color}10`,
                        }}
                      >
                        <p
                          className="text-sm font-semibold"
                          style={{ color: calculations.balance.color }}
                        >
                          {calculations.balance.text}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/62">
                          {calculations.balanceDetailed}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-5">
                    <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                      <div className="space-y-4">
                        <FieldShell label="Historia clinica">
                          <AutoGrowTextarea
                            value={currentRecord.historia}
                            onChange={(value) => setField('historia', value)}
                            placeholder="Resumo clinico..."
                          />
                        </FieldShell>
                        <FieldShell label="Diagnostico">
                          <AutoGrowTextarea
                            value={currentRecord.diagnostico}
                            onChange={(value) => setField('diagnostico', value)}
                            placeholder="Diagnostico e foco atual..."
                          />
                        </FieldShell>
                      </div>
                    </div>

                    <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">Laboratorio</p>
                        <button
                          onClick={() => addListItem('examesLabList')}
                          className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                        >
                          <Plus className="h-4 w-4" />
                          Exame
                        </button>
                      </div>

                      <div className="space-y-2">
                        {currentRecord.examesLabList?.length ? (
                          currentRecord.examesLabList.map((exam, index) => (
                            <div key={`lab-${index}`} className="rounded-[1rem] border border-white/10 bg-black/18 p-3">
                              <div className="mb-2 flex items-center gap-2">
                                <input
                                  className={`${INPUT_CLASS_SM} w-36`}
                                  type="date"
                                  value={exam.data}
                                  onChange={(event) => updateListItem('examesLabList', index, 'data', event.target.value)}
                                />
                                <button
                                  onClick={() => removeListItem('examesLabList', index)}
                                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-8 gap-1.5">
                                {LAB_FIELDS.map((field) => (
                                  <FieldShell key={field.key} label={field.label}>
                                    <div className="relative">
                                      <input
                                        className={`${INPUT_CLASS_SM} pr-8`}
                                        value={String(exam[field.key] ?? '')}
                                        onChange={(event) => updateListItem('examesLabList', index, field.key, event.target.value)}
                                        placeholder={field.ref}
                                      />
                                      {field.unit ? (
                                        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-white/30">
                                          {field.unit}
                                        </span>
                                      ) : null}
                                    </div>
                                  </FieldShell>
                                ))}
                              </div>
                              {(() => {
                                const labAnalysis = analyzeLabExam(exam)
                                return labAnalysis.items.length ? (
                                  <div className="mt-4 rounded-[1rem] border border-white/10 bg-white/[0.04] p-3">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                      Analise automatica
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {labAnalysis.items.map((item) => (
                                        <span
                                          key={`${index}-${item.label}`}
                                          className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                                          style={{
                                            borderColor: `${item.color}30`,
                                            background: `${item.color}10`,
                                            color: item.color,
                                          }}
                                        >
                                          {item.label}: {item.interp}
                                        </span>
                                      ))}
                                    </div>
                                    {labAnalysis.alerts.length ? (
                                      <div className="mt-3 space-y-1">
                                        {labAnalysis.alerts.map((alert) => (
                                          <p key={alert.text} className="text-[11px] font-medium" style={{ color: alert.color }}>
                                            {alert.text}
                                          </p>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null
                              })()}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                            Nenhum exame laboratorial registrado.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">Exames de imagem</p>
                        <button
                          onClick={() => addListItem('examesImagemList')}
                          className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                        >
                          <Plus className="h-4 w-4" />
                          Imagem
                        </button>
                      </div>

                      <div className="space-y-3">
                        {currentRecord.examesImagemList?.length ? (
                          currentRecord.examesImagemList.map((exam, index) => (
                            <div key={`img-${index}`} className="space-y-2 rounded-[1rem] border border-white/10 bg-black/18 p-3">
                              {/* linha 1: data · tipo · apagar */}
                              <div className="flex items-center gap-2">
                                <input
                                  className={`${INPUT_FLEX} w-[7rem] shrink-0`}
                                  type="date"
                                  value={exam.data}
                                  onChange={(e) => updateListItem('examesImagemList', index, 'data', e.target.value)}
                                />
                                <select
                                  className={`${INPUT_FLEX} min-w-0 flex-1`}
                                  value={exam.tipo}
                                  onChange={(e) => updateListItem('examesImagemList', index, 'tipo', e.target.value)}
                                >
                                  {IMAGE_TYPE_OPTIONS.map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => removeListItem('examesImagemList', index)}
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                              {/* linha 2: achados */}
                              <select
                                className={INPUT_CLASS_SM}
                                defaultValue=""
                                onChange={(e) => {
                                  toggleImageFinding(index, e.target.value)
                                  e.currentTarget.selectedIndex = 0
                                }}
                              >
                                <option value="">+ Achado...</option>
                                {IMAGE_FINDING_OPTIONS.map((o) => (
                                  <option key={o} value={o}>{o}</option>
                                ))}
                              </select>
                              {exam.achados?.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {exam.achados.map((item) => (
                                    <button
                                      key={`${index}-${item}`}
                                      type="button"
                                      onClick={() => removeImageFinding(index, item)}
                                      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/72"
                                    >
                                      {item} ×
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                              {/* linha 3: laudo */}
                              <AutoGrowTextarea
                                value={exam.laudo}
                                onChange={(value) => updateListItem('examesImagemList', index, 'laudo', value)}
                                placeholder="Laudo / observacoes..."
                              />
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                            Nenhum exame de imagem registrado.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'neuro' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Avaliacao neurologica
                  </p>
                  <div className="grid gap-2 grid-cols-7">
                    <FieldShell label="O">
                      <select className={INPUT_CLASS_SM} value={currentRecord.glasgowO} onChange={(e) => setField('glasgowO', e.target.value)}>
                        <option value="">--</option>
                        {['4','3','2','1'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="V">
                      <select className={INPUT_CLASS_SM} value={currentRecord.glasgowV} onChange={(e) => setField('glasgowV', e.target.value)}>
                        <option value="">--</option>
                        {['5','4','3','2','1','T'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="M">
                      <select className={INPUT_CLASS_SM} value={currentRecord.glasgowM} onChange={(e) => setField('glasgowM', e.target.value)}>
                        <option value="">--</option>
                        {['6','5','4','3','2','1'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="RASS">
                      <select className={INPUT_CLASS_SM} value={currentRecord.rass} onChange={(e) => setField('rass', e.target.value)}>
                        <option value="">--</option>
                        {['+4','+3','+2','+1','0','-1','-2','-3','-4','-5'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="Meta RASS">
                      <select className={INPUT_CLASS_SM} value={currentRecord.metaRASS} onChange={(e) => setField('metaRASS', e.target.value)}>
                        <option value="">--</option>
                        {['0','-1','-2','-3','-4','-5'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="Meta TOF">
                      <select className={INPUT_CLASS_SM} value={currentRecord.metaTOF} onChange={(e) => setField('metaTOF', e.target.value)}>
                        <option value="">--</option>
                        {['0/4','1/4','2/4','3/4','4/4'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                    <FieldShell label="Ult. TOF">
                      <select className={INPUT_CLASS_SM} value={currentRecord.ultimoTOF} onChange={(e) => setField('ultimoTOF', e.target.value)}>
                        <option value="">--</option>
                        {['0/4','1/4','2/4','3/4','4/4'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </FieldShell>
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-3">
                    <MetricChip
                      label="Glasgow"
                      value={calculations?.glasgow ? String(calculations.glasgow.total) : '--'}
                      hint={calculations?.glasgow?.interp}
                      color={calculations?.glasgow?.cor}
                    />
                    <MetricChip label="Meta RASS" value={currentRecord.metaRASS || '--'} hint={currentRecord.rass ? `Atual ${currentRecord.rass}` : null} />
                    <MetricChip label="TOF" value={currentRecord.ultimoTOF || '--'} hint={currentRecord.metaTOF ? `Meta ${currentRecord.metaTOF}` : null} />
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">Sedativos</p>
                      <button
                        onClick={() => addListItem('sedativos')}
                        className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                      >
                        <Plus className="h-4 w-4" />
                        Medicamento
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentRecord.sedativos?.length ? (
                        currentRecord.sedativos.map((item, index) => {
                          const analise = analiseSedativo(item.inicio, item.atual)
                          return (
                          <div key={`sed-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-3">
                            <div className="grid gap-2 grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                              <FieldShell label="Droga">
                                <select className={INPUT_CLASS_SM} value={item.droga} onChange={(event) => updateListItem('sedativos', index, 'droga', event.target.value)}>
                                  {SEDATIVE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option || 'Selecionar'}</option>
                                  ))}
                                </select>
                              </FieldShell>
                              <FieldShell label="Inicio">
                                <input className={INPUT_CLASS_SM} value={item.inicio} onChange={(event) => updateListItem('sedativos', index, 'inicio', event.target.value)} placeholder="ml/h" />
                              </FieldShell>
                              <FieldShell label="Atual">
                                <input className={INPUT_CLASS_SM} value={item.atual} onChange={(event) => updateListItem('sedativos', index, 'atual', event.target.value)} placeholder="ml/h" />
                              </FieldShell>
                              <FieldShell label="Unidade">
                                <input className={INPUT_CLASS_SM} value={item.unidade} onChange={(event) => updateListItem('sedativos', index, 'unidade', event.target.value)} />
                              </FieldShell>
                              <div className="flex items-end pb-1">
                                <button
                                  onClick={() => removeListItem('sedativos', index)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            {analise ? (
                              <div className="mt-3 rounded-[0.8rem] border p-3 text-[11px] leading-relaxed" style={{ borderColor: `${analise.color}30`, background: `${analise.color}08` }}>
                                <p className="mb-1.5 font-semibold uppercase tracking-[0.16em]" style={{ color: analise.color }}>{analise.label}</p>
                                <p className="mb-1 text-white/72"><span className="font-semibold text-white/50">Indica: </span>{analise.indica}</p>
                                <p className="text-white/60"><span className="font-semibold text-white/50">Evolucao: </span>{analise.evolucao}</p>
                              </div>
                            ) : null}
                          </div>
                          )
                        })
                      ) : (
                        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                          Nenhum sedativo em uso.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">BNM</p>
                      <button
                        onClick={() => addListItem('bnmList')}
                        className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                      >
                        <Plus className="h-4 w-4" />
                        BNM
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentRecord.bnmList?.length ? (
                        currentRecord.bnmList.map((item, index) => {
                          const analise = analiseBNM(item.inicio, item.atual)
                          return (
                          <div key={`bnm-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-3">
                            <div className="grid gap-2 grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                              <FieldShell label="Droga">
                                <select className={INPUT_CLASS_SM} value={item.droga} onChange={(event) => updateListItem('bnmList', index, 'droga', event.target.value)}>
                                  {BNM_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option || 'Selecionar'}</option>
                                  ))}
                                </select>
                              </FieldShell>
                              <FieldShell label="Inicio">
                                <input className={INPUT_CLASS_SM} value={item.inicio} onChange={(event) => updateListItem('bnmList', index, 'inicio', event.target.value)} placeholder="ml/h" />
                              </FieldShell>
                              <FieldShell label="Atual">
                                <input className={INPUT_CLASS_SM} value={item.atual} onChange={(event) => updateListItem('bnmList', index, 'atual', event.target.value)} placeholder="ml/h" />
                              </FieldShell>
                              <FieldShell label="Unidade">
                                <input className={INPUT_CLASS_SM} value={item.unidade} onChange={(event) => updateListItem('bnmList', index, 'unidade', event.target.value)} />
                              </FieldShell>
                              <div className="flex items-end pb-1">
                                <button
                                  onClick={() => removeListItem('bnmList', index)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            {analise ? (
                              <div className="mt-3 rounded-[0.8rem] border p-3 text-[11px] leading-relaxed" style={{ borderColor: `${analise.color}30`, background: `${analise.color}08` }}>
                                <p className="mb-1.5 font-semibold uppercase tracking-[0.16em]" style={{ color: analise.color }}>{analise.label}</p>
                                <p className="mb-1 text-white/72"><span className="font-semibold text-white/50">Indica: </span>{analise.indica}</p>
                                <p className="text-white/60"><span className="font-semibold text-white/50">Evolucao: </span>{analise.evolucao}</p>
                              </div>
                            ) : null}
                          </div>
                          )
                        })
                      ) : (
                        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                          Nenhum BNM em uso.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <FieldShell label="Observacoes neurologicas">
                    <AutoGrowTextarea
                      value={currentRecord.neurologico}
                      onChange={(value) => setField('neurologico', value)}
                      placeholder="Leitura neuro, sedacao, delirium, BNM..."
                    />
                  </FieldShell>
                </div>
              </div>
            ) : null}

            {activeTab === 'cardio' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Hemodinamica / DVA
                  </p>
                  <div className="grid gap-3 grid-cols-4 md:grid-cols-7">
                    <FieldShell label="PAS">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.pas} onChange={(event) => setField('pas', event.target.value)} placeholder="120" />
                    </FieldShell>
                    <FieldShell label="PAD">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.pad} onChange={(event) => setField('pad', event.target.value)} placeholder="80" />
                    </FieldShell>
                    <FieldShell label="PAM">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.pam} onChange={(event) => setField('pam', event.target.value)} placeholder="85" />
                    </FieldShell>
                    <FieldShell label="FC">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.fc} onChange={(event) => setField('fc', event.target.value)} placeholder="88" />
                    </FieldShell>
                    <FieldShell label="Lactato">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.lactatoCardio} onChange={(event) => setField('lactatoCardio', event.target.value)} placeholder="1.2" />
                    </FieldShell>
                    <FieldShell label="Mudanca hemodinamica" span="col-span-2">
                      <select className={INPUT_CLASS} value={currentRecord.cardiovascularMudanca} onChange={(event) => setField('cardiovascularMudanca', event.target.value)}>
                        <option value="">--</option>
                        <option value="estavel">Estavel</option>
                        <option value="reducao_dva">Reducao DVA</option>
                        <option value="inicio_dva">Inicio DVA</option>
                        <option value="piora">Piora</option>
                      </select>
                    </FieldShell>
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-3">
                    <MetricChip
                      label="PAM calculada"
                      value={calculations?.pamAuto ? `${calculations.pamAuto} mmHg` : '--'}
                      hint={calculations?.pamAuto ? (calculations.pamAuto < 65 ? 'Hipotensao' : calculations.pamAuto > 100 ? 'Elevada' : 'Adequada') : null}
                      color={calculations?.pamAuto ? (calculations.pamAuto < 65 ? '#f87171' : calculations.pamAuto > 100 ? '#facc15' : '#4ade80') : undefined}
                    />
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">Drogas vasoativas</p>
                    <button
                      onClick={() => addListItem('dvaList')}
                      className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                    >
                      <Plus className="h-4 w-4" />
                      DVA
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentRecord.dvaList?.length ? (
                      currentRecord.dvaList.map((item, index) => (
                        <div key={`dva-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-4">
                          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto]">
                            <FieldShell label="Droga">
                              <select className={INPUT_CLASS} value={item.droga} onChange={(event) => updateListItem('dvaList', index, 'droga', event.target.value)}>
                                {DVA_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option || 'Selecionar'}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>
                            <FieldShell label="Dose">
                              <input className={INPUT_CLASS} value={item.dose} onChange={(event) => updateListItem('dvaList', index, 'dose', event.target.value)} placeholder="0.12" />
                            </FieldShell>
                            <FieldShell label="Unidade">
                              <input className={INPUT_CLASS} value={item.unidade} onChange={(event) => updateListItem('dvaList', index, 'unidade', event.target.value)} />
                            </FieldShell>
                            <div className="flex items-end">
                              <button
                                onClick={() => removeListItem('dvaList', index)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                        Nenhuma DVA registrada.
                      </div>
                    )}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <FieldShell label="Avaliacao cardiovascular">
                    <textarea
                      className={TEXTAREA_CLASS}
                      value={currentRecord.cardiovascular}
                      onChange={(event) => setField('cardiovascular', event.target.value)}
                      placeholder="Perfusao, edema, resposta vasoativa, ritmos, metas..."
                    />
                  </FieldShell>
                </div>
              </div>
            ) : null}

            {activeTab === 'resp' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Via aerea / avaliacao pulmonar / secrecao
                  </p>
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    <FieldShell label="Via aerea atual">
                      <select className={INPUT_CLASS} value={currentRecord.tipoVia} onChange={(event) => setField('tipoVia', event.target.value)}>
                        {VIA_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                    <FieldShell label="Avaliacao pulmonar" span="xl:col-span-2">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.pulmonar}
                        onChange={(event) => setField('pulmonar', event.target.value)}
                        placeholder="Ausculta, complacencia, infiltrado, expansao..."
                      />
                    </FieldShell>
                    <FieldShell label="Secrecao">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.secrecao}
                        onChange={(event) => setField('secrecao', event.target.value)}
                        placeholder="Volume, aspecto, necessidade de aspiracao..."
                      />
                    </FieldShell>
                    <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">Badge via aerea</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentRecord.tipoVia ? (
                          <span
                            className="rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                            style={{
                              borderColor:
                                VIA_BADGE_STYLES[currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML' ? 'TOT' : currentRecord.tipoVia]?.border ??
                                'rgba(255,255,255,0.12)',
                              background:
                                VIA_BADGE_STYLES[currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML' ? 'TOT' : currentRecord.tipoVia]?.background ??
                                'rgba(255,255,255,0.04)',
                              color:
                                VIA_BADGE_STYLES[currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML' ? 'TOT' : currentRecord.tipoVia]?.color ??
                                'rgba(255,255,255,0.72)',
                            }}
                          >
                            {VIA_BADGE_STYLES[currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML' ? 'TOT' : currentRecord.tipoVia]?.label ?? currentRecord.tipoVia}
                          </span>
                        ) : (
                          <span className="text-[11px] text-white/46">Selecionar via aerea</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Eventos de via aerea
                  </p>
                  <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                    {(currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT') && (
                      <>
                        <FieldShell label="Data e hora IOT" span="xl:col-span-2">
                          <input
                            className={INPUT_CLASS}
                            type="datetime-local"
                            value={currentRecord.dataTOT}
                            onChange={(event) => setField('dataTOT', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Extubacao">
                          <input
                            className={INPUT_CLASS}
                            type="date"
                            value={currentRecord.dataExtubacao}
                            onChange={(event) => setField('dataExtubacao', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Hora extubacao">
                          <input
                            className={INPUT_CLASS}
                            type="time"
                            value={currentRecord.horaExtubacao}
                            onChange={(event) => setField('horaExtubacao', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Re-IOT">
                          <input
                            className={INPUT_CLASS}
                            type="date"
                            value={currentRecord.dataReIOT}
                            onChange={(event) => setField('dataReIOT', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Hora Re-IOT">
                          <input
                            className={INPUT_CLASS}
                            type="time"
                            value={currentRecord.horaReIOT}
                            onChange={(event) => setField('horaReIOT', event.target.value)}
                          />
                        </FieldShell>
                      </>
                    )}

                    {currentRecord.tipoVia.startsWith('TQT') && (
                      <>
                        <FieldShell label="Data e hora TQT" span="xl:col-span-2">
                          <input
                            className={INPUT_CLASS}
                            type="datetime-local"
                            value={currentRecord.dataTQT}
                            onChange={(event) => setField('dataTQT', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Decanulacao">
                          <input
                            className={INPUT_CLASS}
                            type="date"
                            value={currentRecord.dataDecanulacao}
                            onChange={(event) => setField('dataDecanulacao', event.target.value)}
                          />
                        </FieldShell>
                        <FieldShell label="Hora decanulacao">
                          <input
                            className={INPUT_CLASS}
                            type="time"
                            value={currentRecord.horaDecanulacao}
                            onChange={(event) => setField('horaDecanulacao', event.target.value)}
                          />
                        </FieldShell>
                        {currentRecord.tipoVia === 'TQT-VM' ? (
                          <>
                            <FieldShell label="Desconexao VM">
                              <input
                                className={INPUT_CLASS}
                                type="date"
                                value={currentRecord.dataDescVM}
                                onChange={(event) => setField('dataDescVM', event.target.value)}
                              />
                            </FieldShell>
                            <FieldShell label="Hora desc. VM">
                              <input
                                className={INPUT_CLASS}
                                type="time"
                                value={currentRecord.horaDescVM}
                                onChange={(event) => setField('horaDescVM', event.target.value)}
                              />
                            </FieldShell>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>

                  {(currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia.startsWith('TQT')) && (
                    <div className="mt-4 grid gap-3 grid-cols-3">
                      {(currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT' || (currentRecord.tipoVia.startsWith('TQT') && currentRecord.dataTOT)) && (
                        <MetricChip
                          label="Dias TOT"
                          value={calculations?.daysTOT !== null && calculations?.daysTOT !== undefined ? `D${calculations.daysTOT}` : '--'}
                          hint={calculations?.daysTOT && calculations.daysTOT >= 7 ? 'Tempo prolongado' : 'Contagem automatica'}
                          color={calculations?.daysTOT && calculations.daysTOT >= 7 ? '#f87171' : '#60a5fa'}
                        />
                      )}
                      {currentRecord.tipoVia.startsWith('TQT') && (
                        <MetricChip
                          label="Dias TQT"
                          value={calculations?.daysTQT !== null && calculations?.daysTQT !== undefined ? `D${calculations.daysTQT}` : '--'}
                          hint="Contagem automatica"
                          color="#fb923c"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Gasometria
                  </p>
                  <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                    <FieldShell label="Data">
                      <input className={INPUT_CLASS} type="date" value={currentRecord.gasoData} onChange={(event) => setField('gasoData', event.target.value)} />
                    </FieldShell>
                    <FieldShell label="Hora">
                      <input className={INPUT_CLASS} type="time" value={currentRecord.gasoHora} onChange={(event) => setField('gasoHora', event.target.value)} />
                    </FieldShell>
                    <FieldShell label="SpO2 / S-F">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.sfSpO2} onChange={(event) => setField('sfSpO2', event.target.value)} placeholder="96" />
                    </FieldShell>
                    <FieldShell label="FiO2 / S-F">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.sfFiO2} onChange={(event) => setField('sfFiO2', event.target.value)} placeholder="40" />
                    </FieldShell>
                    <FieldShell label="pH">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoPH} onChange={(event) => setField('gasoPH', event.target.value)} placeholder="7.36" />
                    </FieldShell>
                    <FieldShell label="PaCO2">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoPaCO2} onChange={(event) => setField('gasoPaCO2', event.target.value)} placeholder="45" />
                    </FieldShell>
                    <FieldShell label="PaO2">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoPaO2} onChange={(event) => setField('gasoPaO2', event.target.value)} placeholder="80" />
                    </FieldShell>
                    <FieldShell label="HCO3">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoHCO3} onChange={(event) => setField('gasoHCO3', event.target.value)} placeholder="24" />
                    </FieldShell>
                    <FieldShell label="BE">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoBE} onChange={(event) => setField('gasoBE', event.target.value)} placeholder="0" />
                    </FieldShell>
                    <FieldShell label="SaO2">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoSaO2} onChange={(event) => setField('gasoSaO2', event.target.value)} placeholder="96" />
                    </FieldShell>
                    <FieldShell label="Lactato">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoLactato} onChange={(event) => setField('gasoLactato', event.target.value)} placeholder="1.5" />
                    </FieldShell>
                    <FieldShell label="FiO2 gaso">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.gasoFiO2} onChange={(event) => setField('gasoFiO2', event.target.value)} placeholder="40" />
                    </FieldShell>
                  </div>

                  <div className="mt-4">
                    <FieldShell label="Obs. gasometricas">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.gasoObs}
                        onChange={(event) => setField('gasoObs', event.target.value)}
                        placeholder="Interpretacao clinica, correlacao com leito, coleta..."
                      />
                    </FieldShell>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={saveGaso}
                      className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                    >
                      <Save className="h-4 w-4" />
                      Salvar gaso
                    </button>
                    <button
                      onClick={clearGaso}
                      className="inline-flex items-center gap-2 rounded-[1rem] border border-[#f8717130] bg-[#f8717110] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fca5a5]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpar gaso
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                  <MetricChip
                    label="P/F"
                    value={calculations?.pf ? calculations.pf.toFixed(0) : '--'}
                    hint={calculations?.pfInterp?.t}
                    color={calculations?.pfInterp?.c}
                  />
                  <MetricChip
                    label="S/F"
                    value={calculations?.sf ? calculations.sf.toFixed(0) : '--'}
                    hint="Oxigenacao nao invasiva"
                  />
                  <MetricChip
                    label="Gasometria"
                    value={calculations?.gaso?.tipo || '--'}
                    hint={calculations?.gaso?.full}
                    color={calculations?.gaso?.cor}
                  />
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Historico de gasometria
                  </p>
                  <div className="space-y-3">
                    {currentRecord.gasometrias?.length ? (
                      currentRecord.gasometrias.map((entry, index) => (
                        <div key={`${entry.ts}-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-white/86">
                                {entry.data || '--'} {entry.hora || ''} • {entry.analise || 'Gasometria'}
                              </p>
                              <p className="mt-1 text-xs text-white/46">
                                pH {entry.pH || '--'} • PaCO2 {entry.paCO2 || '--'} • PaO2 {entry.paO2 || '--'} • HCO3 {entry.hco3 || '--'}
                              </p>
                              <p className="mt-1 text-xs text-white/46">
                                P/F {entry.pf || '--'} • S/F {entry.sf || '--'} • FiO2 {entry.fio2 || '--'} • Lactato {entry.lactato || '--'}
                              </p>
                              {entry.obs ? <p className="mt-2 text-xs leading-relaxed text-white/54">{entry.obs}</p> : null}
                            </div>
                            <button
                              onClick={() => deleteGaso(index)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                        Nenhuma gasometria salva.
                      </div>
                    )}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Ventilacao mecanica
                  </p>
                  <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                    <FieldShell label="Modo ventilatorio" span="xl:col-span-2">
                      <select className={INPUT_CLASS} value={currentRecord.modoVM} onChange={(event) => setField('modoVM', event.target.value)}>
                        {VM_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                  </div>

                  {respModeType === 'volume' ? (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="VT (mL)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.vt} onChange={(event) => setField('vt', event.target.value)} placeholder="450" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7.2" />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="10" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Fluxo (L/min)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.fluxo} onChange={(event) => setField('fluxo', event.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS} value={currentRecord.trigger} onChange={(event) => setField('trigger', event.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS} value={currentRecord.ti} onChange={(event) => setField('ti', event.target.value)} placeholder="1.0" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS} value={currentRecord.ie} onChange={(event) => setField('ie', event.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="P. pico">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.ppico} onChange={(event) => setField('ppico', event.target.value)} placeholder="28" />
                        </FieldShell>
                        <FieldShell label="P. plato">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.pplato} onChange={(event) => setField('pplato', event.target.value)} placeholder="25" />
                        </FieldShell>
                      </div>
                    </div>
                  ) : respModeType === 'pressure' ? (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PC (cmH2O)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.ppico} onChange={(event) => setField('ppico', event.target.value)} placeholder="27" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7.2" />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="10" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS} value={currentRecord.trigger} onChange={(event) => setField('trigger', event.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS} value={currentRecord.ti} onChange={(event) => setField('ti', event.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS} value={currentRecord.ie} onChange={(event) => setField('ie', event.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="P. plato">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.pplato} onChange={(event) => setField('pplato', event.target.value)} placeholder="22" />
                        </FieldShell>
                        <FieldShell label="Pmean">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.pmean} onChange={(event) => setField('pmean', event.target.value)} placeholder="12" />
                        </FieldShell>
                      </div>
                    </div>
                  ) : respModeType === 'spontaneous' ? (
                    <div className="mt-4 space-y-4">
                      {currentRecord.modoVM === 'BIPAP' ? (
                        <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                          <FieldShell label="IPAP">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ipap} onChange={(event) => setField('ipap', event.target.value)} placeholder="15" />
                          </FieldShell>
                          <FieldShell label="EPAP">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.epap} onChange={(event) => setField('epap', event.target.value)} placeholder="8" />
                          </FieldShell>
                          <FieldShell label="VC (mL)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                          </FieldShell>
                          <FieldShell label="VE (L/min)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7" />
                          </FieldShell>
                          <FieldShell label="FR">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                          </FieldShell>
                          <FieldShell label="Interface">
                            <select className={INPUT_CLASS} value={currentRecord.interfaceVNI} onChange={(event) => setField('interfaceVNI', event.target.value)}>
                              <option value="facial">Facial</option>
                              <option value="oronasal">Oronasal</option>
                              <option value="nasal">Nasal</option>
                              <option value="helmet">Helmet</option>
                            </select>
                          </FieldShell>
                        </div>
                      ) : currentRecord.modoVM === 'CPAP' ? (
                        <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                          <FieldShell label="CPAP / PEEP">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="8" />
                          </FieldShell>
                          <FieldShell label="VC (mL)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                          </FieldShell>
                          <FieldShell label="VE (L/min)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7" />
                          </FieldShell>
                          <FieldShell label="FR">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                          </FieldShell>
                          <FieldShell label="FiO2">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                          </FieldShell>
                          <FieldShell label="Interface">
                            <select className={INPUT_CLASS} value={currentRecord.interfaceVNI} onChange={(event) => setField('interfaceVNI', event.target.value)}>
                              <option value="facial">Facial</option>
                              <option value="oronasal">Oronasal</option>
                              <option value="nasal">Nasal</option>
                              <option value="helmet">Helmet</option>
                            </select>
                          </FieldShell>
                        </div>
                      ) : currentRecord.modoVM === 'APRV' ? (
                        <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                          <FieldShell label="P-Alta">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ppico} onChange={(event) => setField('ppico', event.target.value)} placeholder="28" />
                          </FieldShell>
                          <FieldShell label="P-Baixa">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="0" />
                          </FieldShell>
                          <FieldShell label="T-Alta (s)">
                            <input className={INPUT_CLASS} value={currentRecord.ti} onChange={(event) => setField('ti', event.target.value)} placeholder="4.5" />
                          </FieldShell>
                          <FieldShell label="T-Baixa (s)">
                            <input className={INPUT_CLASS} value={currentRecord.trigger} onChange={(event) => setField('trigger', event.target.value)} placeholder="0.5" />
                          </FieldShell>
                          <FieldShell label="FiO2">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="60" />
                          </FieldShell>
                          <FieldShell label="VC (mL)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                          </FieldShell>
                        </div>
                      ) : currentRecord.modoVM === 'PAV' || currentRecord.modoVM === 'NAVA' ? (
                        <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                          <FieldShell label="% Assist">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ps} onChange={(event) => setField('ps', event.target.value)} placeholder="70" />
                          </FieldShell>
                          <FieldShell label="VC (mL)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                          </FieldShell>
                          <FieldShell label="VE (L/min)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7" />
                          </FieldShell>
                          <FieldShell label="FR">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                          </FieldShell>
                          <FieldShell label="PEEP">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="8" />
                          </FieldShell>
                          <FieldShell label="FiO2">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                          </FieldShell>
                        </div>
                      ) : (
                        <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                          <FieldShell label="PS (cmH2O)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ps} onChange={(event) => setField('ps', event.target.value)} placeholder="10" />
                          </FieldShell>
                          <FieldShell label="VC (mL)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.vc} onChange={(event) => setField('vc', event.target.value)} placeholder="420" />
                          </FieldShell>
                          <FieldShell label="VE (L/min)">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.ve} onChange={(event) => setField('ve', event.target.value)} placeholder="7" />
                          </FieldShell>
                          <FieldShell label="FR">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fr} onChange={(event) => setField('fr', event.target.value)} placeholder="18" />
                          </FieldShell>
                          <FieldShell label="PEEP">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="8" />
                          </FieldShell>
                          <FieldShell label="FiO2">
                            <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                          </FieldShell>
                        </div>
                      )}

                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS} value={currentRecord.trigger} onChange={(event) => setField('trigger', event.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS} value={currentRecord.ti} onChange={(event) => setField('ti', event.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS} value={currentRecord.ie} onChange={(event) => setField('ie', event.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="Pmean">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.pmean} onChange={(event) => setField('pmean', event.target.value)} placeholder="12" />
                        </FieldShell>
                        <FieldShell label="P0.1">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.p01} onChange={(event) => setField('p01', event.target.value)} placeholder="2.2" />
                        </FieldShell>
                        <FieldShell label="Pocc">
                          <input className={INPUT_CLASS} type="number" value={currentRecord.pocc} onChange={(event) => setField('pocc', event.target.value)} placeholder="8" />
                        </FieldShell>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3 grid-cols-2 xl:grid-cols-4">
                      <FieldShell label="PEEP">
                        <input className={INPUT_CLASS} type="number" value={currentRecord.peep} onChange={(event) => setField('peep', event.target.value)} placeholder="8" />
                      </FieldShell>
                      <FieldShell label="FiO2">
                        <input className={INPUT_CLASS} type="number" value={currentRecord.fio2} onChange={(event) => setField('fio2', event.target.value)} placeholder="40" />
                      </FieldShell>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={saveVM}
                      className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                    >
                      <Save className="h-4 w-4" />
                      Salvar parametros
                    </button>
                    <button
                      onClick={clearRespFields}
                      className="inline-flex items-center gap-2 rounded-[1rem] border border-[#f8717130] bg-[#f8717110] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fca5a5]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpar VM
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-2 xl:grid-cols-6">
                  <MetricChip
                    label="Driving pressure"
                    value={calculations?.dp ? `${calculations.dp.toFixed(1)} cmH2O` : '--'}
                    hint={calculations?.cest ? `Cest ${calculations.cest.toFixed(1)} mL/cmH2O` : null}
                  />
                  <MetricChip
                    label="Raw"
                    value={calculations?.raw ? calculations.raw.toFixed(1) : '--'}
                    hint={currentRecord.fluxo ? 'Resistencia de VA' : 'Informe fluxo'}
                  />
                  <MetricChip
                    label="VE"
                    value={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} L/min` : '--'}
                    hint="Volume minuto"
                  />
                  <MetricChip
                    label="RSBI"
                    value={calculations?.rsbi ? calculations.rsbi.toFixed(1) : '--'}
                    hint={calculations?.rsbiInterp?.t}
                    color={calculations?.rsbiInterp?.c}
                  />
                  <MetricChip
                    label="P0.1 / Pocc"
                    value={`${currentRecord.p01 || '--'} / ${currentRecord.pocc || '--'}`}
                    hint={calculations?.p01Interp?.t || calculations?.poccInterp?.t}
                    color={calculations?.p01Interp?.c || calculations?.poccInterp?.c}
                  />
                  <MetricChip
                    label="Pmusc"
                    value={calculations?.pmusc ? calculations.pmusc.toFixed(1) : '--'}
                    hint={calculations?.pmuscInterp?.t}
                    color={calculations?.pmuscInterp?.c}
                  />
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Historico de parametros VM
                  </p>
                  <div className="space-y-3">
                    {currentRecord.vmHist?.length ? (
                      currentRecord.vmHist.map((entry, index) => (
                        <div key={`${entry.ts}-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-white/86">
                                {entry.modo || 'Sem modo'} • {formatDateTime(entry.ts)}
                              </p>
                              <p className="mt-1 text-xs text-white/46">
                                VT {entry.vt || '--'} • FR {entry.fr || '--'} • PEEP {entry.peep || '--'} • FiO2 {entry.fio2 || '--'}
                              </p>
                              <p className="mt-1 text-xs text-white/46">
                                DP {entry.dp || '--'} • Cest {entry.cest || '--'} • Raw {entry.raw || '--'} • Pmusc {entry.pmusc || '--'}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteVM(index)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-black/16 px-4 py-6 text-center text-sm text-white/46">
                        Nenhum parametro salvo.
                      </div>
                    )}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Otimizacao de PEEP / stress index
                  </p>
                  <div className="grid gap-3 xl:grid-cols-3">
                    {peepRows.map((row, index) => (
                      <div key={`peep-row-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-4">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">Nivel {index + 1}</p>
                        <div className="grid gap-3 grid-cols-3">
                          <FieldShell label="PEEP">
                            <input
                              className={INPUT_CLASS}
                              type="number"
                              value={row.peep}
                              onChange={(event) => setPeepOptField(index, 'peep', event.target.value)}
                              placeholder="10"
                            />
                          </FieldShell>
                          <FieldShell label="Plato">
                            <input
                              className={INPUT_CLASS}
                              type="number"
                              value={row.plato}
                              onChange={(event) => setPeepOptField(index, 'plato', event.target.value)}
                              placeholder="22"
                            />
                          </FieldShell>
                          <FieldShell label="Stress index">
                            <input
                              className={INPUT_CLASS}
                              value={row.si}
                              onChange={(event) => setPeepOptField(index, 'si', event.target.value)}
                              placeholder="=1"
                            />
                          </FieldShell>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-2">
                    <MetricChip
                      label="Melhor combinacao"
                      value={calculations?.peepOptBest ? `Nivel ${calculations.peepOptBest.index + 1}` : '--'}
                      hint={
                        calculations?.peepOptBest
                          ? `PEEP ${calculations.peepOptBest.peep} • ΔP ${calculations.peepOptBest.dp.toFixed(1)} • SI ${calculations.peepOptBest.stressIndex.toFixed(2)}`
                          : 'Preencha ao menos um nivel completo'
                      }
                      color={calculations?.peepOptBest ? '#60a5fa' : undefined}
                    />
                    <MetricChip
                      label="Leitura"
                      value={calculations?.peepOptBest ? 'Configuracao sugerida' : '--'}
                      hint="Prioridade: stress index proximo de 1.0 com menor driving pressure"
                    />
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Analise de curvas e loops
                  </p>
                  <div className="grid gap-4 xl:grid-cols-3">
                    {renderRespSelectionField('Pressao x Tempo', 'curvaPxT', CURVE_PXT_OPTIONS, 'PXT')}
                    {renderRespSelectionField('Fluxo x Tempo', 'curvaFxT', CURVE_FXT_OPTIONS, 'FXT')}
                    {renderRespSelectionField('Volume x Tempo', 'curvaVxT', CURVE_VXT_OPTIONS, 'VXT')}
                    {renderRespSelectionField('Loop P-V', 'loopPV', LOOP_PV_OPTIONS, 'LPV')}
                    {renderRespSelectionField('Loop F-V', 'loopFV', LOOP_FV_OPTIONS, 'LFV')}
                    {renderRespSelectionField('Assincronias', 'assincronia', ASSINCRONIA_OPTIONS, 'ASY')}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Calculadora de desmame
                  </p>
                  <div className="grid gap-3 grid-cols-3 xl:grid-cols-7">
                    <FieldShell label="PImax">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.dPimax} onChange={(event) => setField('dPimax', event.target.value)} placeholder="-40" />
                    </FieldShell>
                    <FieldShell label="PEmax">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.dPemax} onChange={(event) => setField('dPemax', event.target.value)} placeholder="60" />
                    </FieldShell>
                    <FieldShell label="VC (mL)">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.dVcDesm} onChange={(event) => setField('dVcDesm', event.target.value)} placeholder="450" />
                    </FieldShell>
                    <FieldShell label="FR">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.dFrDesm} onChange={(event) => setField('dFrDesm', event.target.value)} placeholder="18" />
                    </FieldShell>
                    <FieldShell label="CV (mL/kg)">
                      <input className={INPUT_CLASS} type="number" value={currentRecord.dCv} onChange={(event) => setField('dCv', event.target.value)} placeholder="15" />
                    </FieldShell>
                    <FieldShell label="TRE">
                      <select className={INPUT_CLASS} value={currentRecord.weanTRETipo} onChange={(event) => setField('weanTRETipo', event.target.value)}>
                        {TRE_TYPE_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                    <FieldShell label="Resultado TRE">
                      <select className={INPUT_CLASS} value={currentRecord.weanTREResult} onChange={(event) => setField('weanTREResult', event.target.value)}>
                        {TRE_RESULT_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                  </div>

                  <div className="mt-4">
                    <FieldShell label="Obs. desmame">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.weanObs}
                        onChange={(event) => setField('weanObs', event.target.value)}
                        placeholder="TRE, tolerancia, fadiga, tosse, secrecao..."
                      />
                    </FieldShell>
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-2 xl:grid-cols-6">
                    <MetricChip
                      label="VM"
                      value={calculations?.weanMinuteVentilation ? `${calculations.weanMinuteVentilation.toFixed(1)} L/min` : '--'}
                      hint="VC x FR"
                    />
                    <MetricChip
                      label="RSBI"
                      value={calculations?.weanRsbi ? calculations.weanRsbi.toFixed(1) : '--'}
                      hint={calculations?.weanSummary?.text}
                      color={calculations?.weanSummary?.color}
                    />
                    <MetricChip
                      label="PImax"
                      value={currentRecord.dPimax || '--'}
                      hint={calculations?.pimaxAdequate ? 'Adequado (<= -30)' : 'Vigiar forca inspiratoria'}
                      color={calculations?.pimaxAdequate ? '#4ade80' : '#facc15'}
                    />
                    <MetricChip
                      label="PEmax"
                      value={currentRecord.dPemax || '--'}
                      hint={calculations?.pemaxAdequate ? 'Adequado (>= 60)' : 'Tosse pode ser limitada'}
                      color={calculations?.pemaxAdequate ? '#4ade80' : '#facc15'}
                    />
                    <MetricChip
                      label="CV"
                      value={currentRecord.dCv || '--'}
                      hint={calculations?.cvAdequate ? 'Reserva ventilatoria adequada' : 'Reserva ventilatoria em vigilancia'}
                      color={calculations?.cvAdequate ? '#4ade80' : '#facc15'}
                    />
                    <MetricChip
                      label="Leitura"
                      value={calculations?.weanSummary?.text || '--'}
                      hint="PImax, PEmax, CV e RSBI"
                      color={calculations?.weanSummary?.color}
                    />
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Protocolo VM especifico
                  </p>
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-3">
                    {PROTOCOL_OPTIONS.map((protocol) => {
                      const selected = currentRecord.protocoloVM.includes(protocol.id)
                      return (
                        <button
                          key={protocol.id}
                          type="button"
                          onClick={() => toggleStringArrayField('protocoloVM', protocol.id)}
                          className="flex items-center gap-3 rounded-[1rem] border px-4 py-3 text-left transition-all"
                          style={{
                            borderColor: selected ? `${protocol.color}55` : 'rgba(255,255,255,0.08)',
                            background: selected ? `${protocol.color}12` : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <div
                            className="flex h-4 w-4 items-center justify-center rounded-[0.3rem] border"
                            style={{ borderColor: selected ? protocol.color : 'rgba(255,255,255,0.18)' }}
                          >
                            {selected ? <div className="h-2 w-2 rounded-[0.15rem]" style={{ background: protocol.color }} /> : null}
                          </div>
                          <span className="text-sm font-medium text-white/76">{protocol.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Prona / recrutabilidade
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setField('pronaAtiva', proneActive ? '' : '1')}
                      className="rounded-[1rem] border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        borderColor: proneActive ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.12)',
                        background: proneActive ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                        color: proneActive ? '#86efac' : 'rgba(255,255,255,0.72)',
                      }}
                    >
                      {proneActive ? 'Prona ativa' : 'Iniciar prona'}
                    </button>
                  </div>

                  {proneActive ? (
                    <div className="mt-4 grid gap-3 grid-cols-3">
                      <FieldShell label="Tempo prona">
                        <select className={INPUT_CLASS} value={currentRecord.pronaTempo} onChange={(event) => setField('pronaTempo', event.target.value)}>
                          {PRONA_TIME_OPTIONS.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </FieldShell>
                      <FieldShell label="Data inicio">
                        <input className={INPUT_CLASS} type="date" value={currentRecord.pronaData} onChange={(event) => setField('pronaData', event.target.value)} />
                      </FieldShell>
                      <FieldShell label="Hora inicio">
                        <input className={INPUT_CLASS} type="time" value={currentRecord.pronaHora} onChange={(event) => setField('pronaHora', event.target.value)} />
                      </FieldShell>
                    </div>
                  ) : null}

                  {calculations?.proneSupineAt ? (
                    <div className="mt-4">
                      <MetricChip
                        label="Supinar em"
                        value={formatDateTime(calculations.proneSupineAt.toISOString())}
                        hint="Previsao automatica da prona"
                        color="#a78bfa"
                      />
                    </div>
                  ) : null}

                  <div className="mt-5 border-t border-white/8 pt-5">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Recrutabilidade pulmonar
                    </p>
                    <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                      <FieldShell label="Volume insp. (mL)">
                        <input className={INPUT_CLASS} type="number" value={currentRecord.recVolInsp} onChange={(event) => setField('recVolInsp', event.target.value)} placeholder="1200" />
                      </FieldShell>
                      <FieldShell label="Volume exp. (mL)">
                        <input className={INPUT_CLASS} type="number" value={currentRecord.recVolExp} onChange={(event) => setField('recVolExp', event.target.value)} placeholder="600" />
                      </FieldShell>
                      <MetricChip
                        label="Diferenca"
                        value={calculations?.recruitDiff !== null && calculations?.recruitDiff !== undefined ? `${calculations.recruitDiff.toFixed(0)} mL` : '--'}
                        hint="Volume inspiratorio - expiratorio"
                      />
                      <MetricChip
                        label="Leitura"
                        value={calculations?.recruitSummary?.text || '--'}
                        hint="Limiar classico > 500 mL"
                        color={calculations?.recruitSummary?.color}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'motora' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <FieldShell label="Avaliacao motora / funcional">
                    <textarea
                      className={TEXTAREA_CLASS}
                      value={currentRecord.motora}
                      onChange={(event) => setField('motora', event.target.value)}
                      placeholder="Forca, mobilidade, barreiras, evolucao funcional..."
                    />
                  </FieldShell>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">MRC</p>
                  <div className="space-y-3">
                    {MRC_GROUPS.map((group) => (
                      <div key={group.label} className="grid items-end gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
                        <p className="text-sm text-white/74">{group.label}</p>
                        <FieldShell label="D">
                          <select className={INPUT_CLASS} value={currentRecord[group.right]} onChange={(event) => setField(group.right, event.target.value)}>
                            <option value="">--</option>
                            {['0', '1', '2', '3', '4', '5'].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </FieldShell>
                        <FieldShell label="E">
                          <select className={INPUT_CLASS} value={currentRecord[group.left]} onChange={(event) => setField(group.left, event.target.value)}>
                            <option value="">--</option>
                            {['0', '1', '2', '3', '4', '5'].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </FieldShell>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-3">
                    <MetricChip
                      label="MRC"
                      value={calculations?.mrc ? `${calculations.mrc.total}/60` : '--'}
                      hint={calculations?.mrc?.text || 'Preencha os 12 grupos'}
                      color={calculations?.mrc?.color}
                    />
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">PERME</p>
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    {PERME_ITEMS.map((item) => (
                      <FieldShell key={item.key} label={item.label}>
                        <select className={INPUT_CLASS} value={currentRecord[item.key]} onChange={(event) => setField(item.key, event.target.value)}>
                          {item.options.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-3">
                    <MetricChip
                      label="PERME"
                      value={calculations?.perme ? `${calculations.perme.total}/21` : '--'}
                      hint={calculations?.perme?.text || 'Preencha os 7 itens'}
                      color={calculations?.perme?.color}
                    />
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-end">
                    <FieldShell label="IMS">
                      <select className={INPUT_CLASS} value={currentRecord.imsScore} onChange={(event) => setField('imsScore', event.target.value)}>
                        {IMS_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                    <MetricChip
                      label="IMS"
                      value={calculations?.ims ? `${calculations.ims.value}/10` : '--'}
                      hint={calculations?.ims?.text}
                      color={calculations?.ims?.color}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'percepcao' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                  <div className="space-y-4">
                    <FieldShell label="Percepcao do plantao">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.percepcao}
                        onChange={(event) => setField('percepcao', event.target.value)}
                        placeholder="Leitura global do turno..."
                      />
                    </FieldShell>
                    <FieldShell label="Pendencias">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.pendencias}
                        onChange={(event) => setField('pendencias', event.target.value)}
                        placeholder="Pendencias, prioridades, exames..."
                      />
                    </FieldShell>
                    <FieldShell label="Condutas">
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={currentRecord.condutas}
                        onChange={(event) => setField('condutas', event.target.value)}
                        placeholder="Plano e condutas do plantao..."
                      />
                    </FieldShell>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <div>
                {tabIndex > 0 ? (
                  <button
                    onClick={() => setActiveTab(TAB_ITEMS[tabIndex - 1].id)}
                    className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {TAB_ITEMS[tabIndex - 1].label}
                  </button>
                ) : null}
              </div>
              <div>
                {tabIndex < TAB_ITEMS.length - 1 ? (
                  <button
                    onClick={() => setActiveTab(TAB_ITEMS[tabIndex + 1].id)}
                    className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                  >
                    {TAB_ITEMS[tabIndex + 1].label}
                  </button>
                ) : (
                  <button
                    onClick={saveAndClose}
                    className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                  >
                    <Save className="h-4 w-4" />
                    Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {records.length ? (
              records.map((record, idx) => {
                const cardStatus = record.statusClinico && STATUS_STYLES[record.statusClinico]
                  ? STATUS_STYLES[record.statusClinico]
                  : null
                const viaKey = record.tipoVia === 'TNT' || record.tipoVia === 'ML' ? 'TOT' : record.tipoVia
                const cardVia = viaKey && VIA_BADGE_STYLES[viaKey] ? VIA_BADGE_STYLES[viaKey] : null
                const daysTOT = record.dataTOT ? calcDays(record.dataTOT) : null
                const daysTQT = record.dataTQT ? calcDays(record.dataTQT) : null
                const showDays = (record.tipoVia === 'TOT' || record.tipoVia === 'TNT') && daysTOT
                  ? { label: `D${daysTOT} TOT`, color: '#60a5fa' }
                  : record.tipoVia?.startsWith('TQT') && daysTQT
                  ? { label: `D${daysTQT} TQT`, color: '#fb923c' }
                  : null
                return (
                  <div
                    key={record.id}
                    className="chrome-panel flex items-center gap-3 rounded-[1.2rem] px-3 py-2.5"
                  >
                    {/* Ícone leito */}
                    <div className="chrome-subtle flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[0.8rem]">
                      {record.leito ? (
                        <>
                          <span className="text-[7px] uppercase tracking-[0.12em] text-white/38">Lt</span>
                          <span className="text-[11px] font-bold leading-none text-white/82">{record.leito}</span>
                        </>
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-white/52" />
                      )}
                    </div>

                    {/* Nome + diagnóstico */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white/90">{recordTitle(record)}</p>
                      <p className="truncate text-[11px] text-white/48">{recordSubtitle(record)}</p>
                    </div>

                    {/* Badges afastados do nome */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      {cardStatus ? (
                        <span
                          className="rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]"
                          style={{ borderColor: cardStatus.border, background: cardStatus.background, color: cardStatus.color }}
                        >
                          {cardStatus.label}
                        </span>
                      ) : null}
                      {cardVia ? (
                        <span
                          className="rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]"
                          style={{ borderColor: cardVia.border, background: cardVia.background, color: cardVia.color }}
                        >
                          {cardVia.label}
                        </span>
                      ) : null}
                      {showDays ? (
                        <span
                          className="rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]"
                          style={{ borderColor: `${showDays.color}40`, background: `${showDays.color}14`, color: showDays.color }}
                        >
                          {showDays.label}
                        </span>
                      ) : null}
                    </div>

                    {/* 3 botões com espaço entre eles */}
                    <div className="flex shrink-0 items-center gap-2.5">
                      <button
                        onClick={() => openRecord(record.id)}
                        className="chrome-subtle flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-white/12 text-white/62 hover:text-white"
                        title="Visualizar"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openRecord(record.id)}
                        className="chrome-subtle flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-white/12 text-white/62 hover:text-white"
                        title="Editar"
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => archiveRecord(record.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-[#facc1530] bg-[#facc150d] text-[#fde68a] hover:bg-[#facc1520]"
                        title="Arquivo"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Setas separadas dos botões */}
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        onClick={() => moveRecord(record.id, 'up')}
                        disabled={idx === 0}
                        className="flex h-5 w-7 items-center justify-center rounded-[0.4rem] border border-white/10 bg-black/18 text-white/42 disabled:opacity-20 hover:text-white/70"
                      >
                        <span className="text-[11px] leading-none">↑</span>
                      </button>
                      <button
                        onClick={() => moveRecord(record.id, 'down')}
                        disabled={idx === records.length - 1}
                        className="flex h-5 w-7 items-center justify-center rounded-[0.4rem] border border-white/10 bg-black/18 text-white/42 disabled:opacity-20 hover:text-white/70"
                      >
                        <span className="text-[11px] leading-none">↓</span>
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="chrome-panel rounded-[1.5rem] p-8 text-center">
                <p className="text-sm text-white/58">Nenhum paciente ativo.</p>
                <p className="mt-2 text-xs text-white/38">
                  Use <span className="text-white/68">Adicionar</span> para abrir um novo prontuario ICU.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
