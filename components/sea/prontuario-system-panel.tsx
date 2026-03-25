'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Archive,
  ArrowLeft,
  BookOpen,
  Brain,
  Copy,
  Eye,
  CheckCircle2,
  Cloud,
  FileText,
  HeartPulse,
  Link2,
  Loader2,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  WifiOff,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { ICUSystemPanel } from '@/components/sea/icu-system-panel'
import { supabase } from '@/lib/supabase'
import {
  analisarGaso,
  calcCdyn,
  calcCest,
  calcDP,
  calcGlasgow,
  calcMechanicalPower,
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
  type DesmEtapaEntry,
  type DesmHistEntry,
  type DVAEntry,
  type GasometryHistoryEntry,
  type ImageExamEntry,
  type ImsHistEntry,
  type LabExamEntry,
  type MraRow,
  type MrcHistEntry,
  type PatientData,
  type PeepOptEntry,
  type PermeHistEntry,
  type PronaHistEntry,
  type SedativeEntry,
  type TitRow,
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

const INPUT_CLASS_LAB =
  'w-full rounded-[0.5rem] border border-white/10 bg-black/22 px-1 py-1 text-[11px] text-white outline-none transition-all placeholder:text-[7px] placeholder:text-white/30 focus:border-white/18'
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
  { key: 'leuco', label: 'Leuco', unit: '/mm³', ref: '4k-11k' },
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
] as const

const VM_MODE_GROUPS = {
  volume: ['VCV', 'PRVC', 'HFOV', 'MMV'],
  pressure: ['PCV'],
  spontaneous: ['PSV', 'TuboT', 'CPAP', 'BIPAP', 'VS', 'ASV', 'IntelliVENT', 'SmartCare', 'APRV', 'PAV', 'NAVA'],
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

function analiseDVA(inicio: string, atual: string): DrugAnalysis | null {
  const trend = calcDrugTrend(inicio, atual)
  if (!trend) return null
  const map: Record<DrugTrend, Omit<DrugAnalysis, 'trend'>> = {
    manteve: {
      label: 'DVA mantida',
      color: '#60a5fa',
      indica: 'Suporte vasoativo estavel. Paciente com resposta pressórica mantida. Avaliar tolerancia a reducao e metas de PAM (65-70 mmHg). Monitorar perfusao periferica e lactato.',
      evolucao: 'Melhora: reducao progressiva guiada por PAM e lactato → desmame → suspensao. Piora: escalonamento de dose, adicao de segunda DVA ou refratariedade vasoativa.',
    },
    reduziu: {
      label: 'Desmame DVA',
      color: '#4ade80',
      indica: 'Reducao de vasoativo. Melhora hemodinamica, menor dependencia vasopressora. Monitorar PAM, FC, lactato e sinais de hipoperfusao durante reducao.',
      evolucao: 'Melhora: suspensao da DVA com PAM estavel, normalizacao do lactato, boa perfusao. Piora: hipotensao com reducao → retitulacao ou troca de agente.',
    },
    aumentou: {
      label: 'DVA aumentada',
      color: '#f87171',
      indica: 'Escalonamento vasoativo. Indica instabilidade hemodinamica progressiva. Investigar: hipovolemia, sepse nao controlada, disfuncao miocardica, TEP ou tamponamento.',
      evolucao: 'Melhora: identificar e tratar causa, estabilizar PAM, considerar corticoide em choque refratario. Piora: choque refratario, disfuncao multiorganica, necessidade de suporte mecanico circulatorio.',
    },
  }
  return { trend, ...map[trend] }
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

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'icu-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

function createRecord(): ICURecord {
  const timestamp = nowIso()
  return {
    ...emptyPatient(),
    id: generateId(),
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
      ? raw.examesLabList.map((exam) => {
        const labDefaults: LabExamEntry = { data: '', hb: '', ht: '', leuco: '', plaq: '', creat: '', ureia: '', k: '', na: '', lac: '', pcr: '', bt: '', alb: '', tgo: '', tgp: '', inr: '' }
        return { ...labDefaults, ...(exam ?? {}) }
      })
      : [],
    examesImagemList: Array.isArray(raw?.examesImagemList)
      ? raw.examesImagemList.map((exam) => {
        const imgDefaults: ImageExamEntry = { data: '', tipo: '', laudo: '', achados: [] }
        return { ...imgDefaults, ...(exam ?? {}), achados: Array.isArray(exam?.achados) ? exam.achados : [] }
      })
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
  let start: Date
  const br = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (br) {
    const year = br[3].length === 2 ? 2000 + parseInt(br[3]) : parseInt(br[3])
    start = new Date(year, parseInt(br[2]) - 1, parseInt(br[1]))
  } else {
    start = new Date(value)
  }
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

function gasoAnaliseColor(analise: string) {
  if (!analise) return '#94a3b8'
  if (analise.includes('Normal')) return '#4ade80'
  if (analise.includes('Mista') || analise.includes('Nao compensada') || analise.includes('associada')) return '#fb923c'
  if (analise.includes('7.2') || analise.includes('grave')) return '#f87171'
  return '#facc15'
}

type TrendInsight = { text: string; color: string }

function numDelta(a: string, b: string) {
  const va = parseFloat(a)
  const vb = parseFloat(b)
  if (!Number.isFinite(va) || !Number.isFinite(vb) || va === 0 || vb === 0) return null
  return { cur: va, prev: vb, delta: va - vb }
}

function analyzeGasoTrend(entries: GasometryHistoryEntry[]): TrendInsight[] {
  if (entries.length < 2) return []
  const cur = entries[0]
  const prev = entries[1]
  const insights: TrendInsight[] = []

  const pf = numDelta(cur.pf, prev.pf)
  if (pf) {
    if (pf.delta > 20) insights.push({ text: `P/F melhorou: ${prev.pf}→${cur.pf} (+${pf.delta.toFixed(0)}) — melhora da oxigenação`, color: '#4ade80' })
    else if (pf.delta < -20) insights.push({ text: `P/F piorou: ${prev.pf}→${cur.pf} (${pf.delta.toFixed(0)}) — investigar hipoxemia`, color: '#f87171' })
    else insights.push({ text: `P/F estável: ${prev.pf}→${cur.pf}`, color: '#94a3b8' })
  }

  const ph = numDelta(cur.pH, prev.pH)
  if (ph) {
    if (ph.delta > 0.05) insights.push({ text: `pH melhorou: ${prev.pH}→${cur.pH} — reversão da acidemia`, color: '#4ade80' })
    else if (ph.delta < -0.05) insights.push({ text: `Acidemia progressiva: pH ${prev.pH}→${cur.pH} — reavaliar causa`, color: '#f87171' })
  }

  const lac = numDelta(cur.lactato, prev.lactato)
  if (lac) {
    if (lac.delta < -0.5) insights.push({ text: `Lactato clareando: ${prev.lactato}→${cur.lactato} — melhora perfusional`, color: '#4ade80' })
    else if (lac.delta > 0.5) insights.push({ text: `Lactato aumentando: ${prev.lactato}→${cur.lactato} — hipoperfusão?`, color: '#f87171' })
  }

  const co2 = numDelta(cur.paCO2, prev.paCO2)
  if (co2) {
    if (co2.delta > 5) insights.push({ text: `Hipercapnia progressiva: PaCO2 ${prev.paCO2}→${cur.paCO2} — ajustar VM`, color: '#fb923c' })
    else if (co2.delta < -5) insights.push({ text: `Melhora ventilatória: PaCO2 ${prev.paCO2}→${cur.paCO2}`, color: '#4ade80' })
  }

  if (entries.length >= 3) {
    const first = entries[entries.length - 1]
    const pfTrend = numDelta(cur.pf, first.pf)
    if (pfTrend && Math.abs(pfTrend.delta) > 30) {
      const dir = pfTrend.delta > 0 ? 'progressão positiva' : 'progressão negativa'
      insights.push({ text: `Tendência geral (${entries.length} gasos): P/F ${first.pf}→${cur.pf} — ${dir}`, color: pfTrend.delta > 0 ? '#60a5fa' : '#fb923c' })
    }
  }

  return insights
}

function analyzeVMTrend(entries: VMHistoryEntry[]): TrendInsight[] {
  if (entries.length < 2) return []
  const cur = entries[0]
  const prev = entries[1]
  const insights: TrendInsight[] = []

  // Modo alterado
  if (cur.modo && prev.modo && cur.modo !== prev.modo) {
    const isProgression = (prev.modo === 'VCV' || prev.modo === 'PCV') && cur.modo === 'PSV'
    const isRegression = prev.modo === 'PSV' && (cur.modo === 'VCV' || cur.modo === 'PCV')
    if (isProgression) insights.push({ text: `${prev.modo} → ${cur.modo} — progressão para modo espontâneo`, color: '#4ade80' })
    else if (isRegression) insights.push({ text: `${prev.modo} → ${cur.modo} — retorno a modo controlado`, color: '#f87171' })
    else insights.push({ text: `Modo alterado: ${prev.modo} → ${cur.modo}`, color: '#60a5fa' })
  }

  // DP
  const dp = numDelta(cur.dp, prev.dp)
  if (dp) {
    if (dp.delta < -2) insights.push({ text: `DP reduziu: ${prev.dp}→${cur.dp} cmH₂O — proteção pulmonar`, color: '#4ade80' })
    else if (dp.delta > 2) insights.push({ text: `DP aumentou: ${prev.dp}→${cur.dp} cmH₂O — risco VILI`, color: '#f87171' })
  }

  // FiO2
  const fio2 = numDelta(cur.fio2, prev.fio2)
  if (fio2) {
    if (fio2.delta < -5) insights.push({ text: `FiO₂ reduzida: ${prev.fio2}→${cur.fio2}% — desmame de O₂`, color: '#4ade80' })
    else if (fio2.delta > 5) insights.push({ text: `FiO₂ aumentada: ${prev.fio2}→${cur.fio2}% — piora oxigenação`, color: '#fb923c' })
  }

  // PEEP
  const peep = numDelta(cur.peep, prev.peep)
  if (peep && Math.abs(peep.delta) >= 1) {
    insights.push({ text: `PEEP ${peep.delta > 0 ? 'aumentada' : 'reduzida'}: ${prev.peep}→${cur.peep} cmH₂O`, color: peep.delta > 0 ? '#facc15' : '#4ade80' })
  }

  // PS (desmame PSV)
  const ps = numDelta(cur.ps, prev.ps)
  if (ps && Math.abs(ps.delta) >= 1) {
    if (ps.delta < 0) insights.push({ text: `PS reduzida: ${prev.ps}→${cur.ps} cmH₂O — desmame em curso`, color: '#4ade80' })
    else insights.push({ text: `PS aumentada: ${prev.ps}→${cur.ps} cmH₂O`, color: '#fb923c' })
  }

  // FR
  const fr = numDelta(cur.fr, prev.fr)
  if (fr && Math.abs(fr.delta) >= 3) {
    if (fr.delta > 5) insights.push({ text: `FR subiu: ${prev.fr}→${cur.fr} — taquipneia, avaliar causa`, color: '#f87171' })
    else if (fr.delta < -3) insights.push({ text: `FR reduziu: ${prev.fr}→${cur.fr} — melhora do padrão`, color: '#4ade80' })
  }

  // VE
  const ve = numDelta(cur.ve, prev.ve)
  if (ve && Math.abs(ve.delta) >= 1) {
    insights.push({ text: `VE ${ve.delta > 0 ? 'aumentou' : 'reduziu'}: ${prev.ve}→${cur.ve} L/min`, color: '#60a5fa' })
  }

  // Tendência geral (>= 3 registros)
  if (entries.length >= 3) {
    const first = entries[entries.length - 1]
    const fio2Trend = numDelta(cur.fio2, first.fio2)
    if (fio2Trend && fio2Trend.delta < -10) {
      insights.push({ text: `Tendência (${entries.length} reg): FiO₂ ${first.fio2}→${cur.fio2}% — desmame O₂ progressivo`, color: '#60a5fa' })
    }
    const psTrend = numDelta(cur.ps, first.ps)
    if (psTrend && psTrend.delta < -3) {
      insights.push({ text: `Tendência (${entries.length} reg): PS ${first.ps}→${cur.ps} — desmame PSV progressivo`, color: '#60a5fa' })
    }
  }

  return insights
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
      title={label}
      className={`relative inline-flex items-center justify-center rounded-[0.6rem] border p-1.5 transition-all ${active
          ? 'border-white/18 bg-white/12 text-white'
          : 'border-white/10 bg-black/18 text-white/62 hover:border-white/16 hover:text-white'
        }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {typeof badge === 'number' && badge > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/20 text-[7px] font-bold text-white">
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
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      className={AUTO_TEXTAREA_CLASS}
      value={value}
      onChange={(event) => onChange(event.target.value)}
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

function ProtoRow({ label, value, obs }: { label: string; value: string; obs?: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-white/6 py-1 text-[10px]">
      <span className="flex-1 text-white/40">{label}</span>
      <span className="flex-1 text-center font-semibold text-white/86">{value}</span>
      {obs ? <span className="flex-1 text-right text-[9px] text-white/30">{obs}</span> : null}
    </div>
  )
}

function ProtoSection({ title, color }: { title: string; color?: string }) {
  return (
    <p className="mb-1.5 mt-3 border-b border-white/8 pb-1 text-[10px] font-bold" style={{ color: color || 'rgba(255,255,255,0.86)' }}>
      {title}
    </p>
  )
}

function ProtoNote({ text }: { text: string }) {
  return <p className="py-0.5 text-[10px] leading-snug text-white/50">{text}</p>
}

function ProtoBox({ text }: { text: string }) {
  return (
    <div className="my-1.5 rounded-[0.6rem] border border-white/8 bg-white/3 px-3 py-2 text-[10px] leading-relaxed text-white/50">
      {text}
    </div>
  )
}

function getProtocolContent(id: string) {
  if (id === 'sdra') return (
    <div>
      <ProtoSection title="SDRA - ARDSnet (Ventilacao Protetora)" color="#f87171" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV ou PCV (A/C)" obs="Sem dif. mortalidade entre modos" />
      <ProtoRow label="Volume Corrente (VC)" value="6 ml/kg peso predito" obs="NUNCA peso real! Grave: 4-6ml/kg" />
      <ProtoRow label="Pressao Plato" value="≤ 30 cmH₂O" obs="Tolerar ate 40 se PEEP>15 e ΔP≤15" />
      <ProtoRow label="PEEP" value="Tabela ARDSNet (FiO₂/PEEP)" obs="Individualizar" />
      <ProtoRow label="Driving Pressure (ΔP)" value="≤ 15 cmH₂O" obs="Pplato-PEEP. Melhor preditor mortalidade" />
      <ProtoRow label="Frequencia Respiratoria" value="< 45 ipm" obs="Iniciar 20-30 ipm (AMIB 2024)" />
      <ProtoRow label="I:E" value="1:1 ate 1:3" obs="Evitar auto-PEEP" />
      <ProtoRow label="FiO₂" value="Menor possivel" obs="SpO₂ 88-95% ou PaO₂ 55-80 mmHg" />
      <ProtoRow label="PaCO₂ Alvo" value="≤ 80 mmHg" obs="Hipercapnia permissiva" />
      <ProtoRow label="pH Alvo" value="7.30-7.45" obs="Aceitar ate 7.15-7.20" />
      <ProtoSection title="Peso Predito:" />
      <ProtoBox text="Homem: 50 + 0,91 × (altura cm - 152,4) | Mulher: 45,5 + 0,91 × (altura cm - 152,4)" />
      <ProtoSection title="CONDUTAS ESPECIFICAS:" />
      <ProtoSection title="Bloqueio Neuromuscular:" />
      <ProtoNote text="• ACURASYS: Favoravel (48h continuo se P/F < 150)" />
      <ProtoNote text="• ROSE: Nao mostrou beneficio (uso liberal)" />
      <ProtoNote text="• Recomendacao: Individualizar conforme assincronia e oxigenacao" />
      <ProtoSection title="Posicao Prona:" />
      <ProtoNote text="• PROSEVA: P/F < 150 → Prona precoce ≥ 16h/dia" />
      <ProtoNote text="• Implementar nas primeiras 48h" />
      <ProtoSection title="Ventilacao Ultraprotetora (SDRA grave):" />
      <ProtoBox text="FiO₂ < 60% | PEEP 10 | PC 10 cmH₂O | VC < 4 ml/kg | FR 10 rpm | Geralmente requer ECMO" />
    </div>
  )
  if (id === 'asma') return (
    <div>
      <ProtoSection title="Asma / Broncoespasmo Grave" color="#facc15" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV" obs="Controlar volume minuto" />
      <ProtoRow label="VC" value="6-8 ml/kg" obs="Minimizar hiperinsuflacao" />
      <ProtoRow label="FR" value="10-14 ipm" obs="Aumentar tempo expiratorio" />
      <ProtoRow label="I:E" value="1:3 a 1:4" obs="Permitir esvaziamento pulmonar" />
      <ProtoRow label="Pplato" value="< 30 cmH₂O" obs="Evitar barotrauma" />
      <ProtoRow label="PEEP" value="0-5 cmH₂O (baixo)" obs="Evitar perpetuar auto-PEEP" />
      <ProtoRow label="Fluxo Inspiratorio" value="80-100 L/min" obs="Encurtar Ti, aumentar Te" />
      <ProtoRow label="PaCO₂" value="Aceitar ate 90 mmHg" obs="pH ≥ 7.20 (hipercapnia permissiva)" />
      <ProtoSection title="Tratamento Farmacologico:" />
      <ProtoNote text="• Broncodilatadores: Salbutamol 2,5-5 mg nebulizado 4/4h" />
      <ProtoNote text="• Corticoides: Metilprednisolona 40-60 mg IV 6/6h" />
      <ProtoNote text="• Sulfato de Magnesio 2g IV em 20min" />
      <ProtoSection title="Monitorizar:" />
      <ProtoNote text="• PaCO₂, pH | Pplato < 30 | Auto-PEEP (pausa expiratoria)" />
    </div>
  )
  if (id === 'covid') return (
    <div>
      <ProtoSection title="COVID-19 / SDRA Viral" color="#f87171" />
      <ProtoBox text="COVID-19 apresenta 2 FENOTIPOS: Fenotipo L (Low) = complacencia normal/alta | Fenotipo H (High) = complacencia baixa" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Parametro" value="Fenotipo L" obs="Fenotipo H" />
      <ProtoRow label="Complacencia" value="Normal/Alta >50" obs="Baixa <40 mL/cmH₂O" />
      <ProtoRow label="Volume Corrente" value="6 mL/kg" obs="4-6 mL/kg (ultraprotecao)" />
      <ProtoRow label="PEEP" value="8-10 cmH₂O" obs="12-16 cmH₂O (alta, titular)" />
      <ProtoRow label="Recrutabilidade" value="Baixa" obs="Alta" />
      <ProtoRow label="Posicao Prona" value="Considerar se P/F<150" obs="Indicada precocemente" />
      <ProtoSection title="Protocolo Prona COVID-19:" />
      <ProtoNote text="• Indicacao: PaO₂/FiO₂ < 150 com FiO₂ ≥ 60% + PEEP ≥ 5" />
      <ProtoNote text="• Duracao: 12-16h/dia em prona (minimo 12h)" />
      <ProtoNote text="• Suspender se P/F > 150 com PEEP ≤ 10 e FiO₂ ≤ 60% por > 4h em supino" />
      <ProtoSection title="Tratamento Farmacologico:" />
      <ProtoNote text="• Dexametasona 6 mg/dia IV por 10 dias: ↓ mortalidade 30%" />
      <ProtoNote text="• Anticoagulacao: Enoxaparina (monitorar D-dimero)" />
    </div>
  )
  if (id === 'dpoc') return (
    <div>
      <ProtoSection title="DPOC Exacerbado" color="#4ade80" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV, PCV ou PSV" />
      <ProtoRow label="VC" value="6-8 ml/kg" />
      <ProtoRow label="FR" value="10-15 ipm (baixa!)" />
      <ProtoRow label="I:E" value="1:3 a 1:5" obs="Aumentar tempo expiratorio" />
      <ProtoRow label="PEEP" value="50-85% da PEEPi" obs="4-8 cmH₂O tipico" />
      <ProtoRow label="FiO₂" value="SpO₂ 88-92%" obs="Evitar hiperoxemia!" />
      <ProtoSection title="Auto-PEEP (PEEPi):" />
      <ProtoNote text="• Causas: Tempo expiratorio insuficiente + Obstrucao ao fluxo" />
      <ProtoNote text="• Consequencias: Hiperinsuflacao, ↑ trabalho resp, hipotensao, barotrauma" />
      <ProtoNote text="• Estrategias: ↓ FR, ↓ Volume Minuto, ↑ I:E, PEEP extrinseca 50-85% da PEEPi" />
      <ProtoSection title="Cuidados Especiais:" />
      <ProtoNote text="• DPOC retém CO₂: Aceitar PaCO₂ 50-65 mmHg (habitual)" />
      <ProtoNote text="• Meta SpO₂: 88-92% (NAO > 96%, risco retencao CO₂)" />
      <ProtoNote text="• Despertar e desmame PRECOCE (VNI assim que possivel)" />
    </div>
  )
  if (id === 'neuro') return (
    <div>
      <ProtoSection title="Neuroprotecao (TCE/AVC)" color="#a78bfa" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV" obs="Melhor controle de PaCO₂" />
      <ProtoRow label="Vt" value="6-8 ml/kg peso predito" />
      <ProtoRow label="FR" value="12-16 ipm" obs="PaCO₂ 35-40 mmHg" />
      <ProtoRow label="PEEP" value="5-8 cmH₂O" obs="Evitar > 10 cmH₂O" />
      <ProtoRow label="FiO₂" value="SpO₂ 94-98%" obs="Evitar hiperoxia e hipoxia" />
      <ProtoRow label="I:E" value="1:2" obs="Evitar inversao" />
      <ProtoSection title="Fisiopatologia:" />
      <ProtoNote text="• Hipercapnia (>45): Vasodilatacao cerebral → ↑ FSC → ↑ PIC" />
      <ProtoNote text="• Hipocapnia (<30): Vasoconstricao excessiva → isquemia cerebral" />
      <ProtoNote text="• PEEP >10: ↑ pressao intratoracica → ↓ retorno venoso → ↑ PIC" />
      <ProtoSection title="Condutas:" />
      <ProtoNote text="• Sedacao profunda RASS -4 a -5 | Cabeceira 30-45° | PAM 80-100 mmHg" />
      <ProtoNote text="• Osmoterapia: Manitol 0,25-1 g/kg IV se PIC > 20 mmHg" />
      <ProtoNote text="• PPC: PAM - PIC (alvo > 60 mmHg)" />
    </div>
  )
  if (id === 'trauma') return (
    <div>
      <ProtoSection title="Trauma Toracico" color="#fb923c" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV ou PCV (A/C)" />
      <ProtoRow label="VC" value="6 ml/kg peso predito" />
      <ProtoRow label="FR" value="16-20 rpm" />
      <ProtoRow label="FiO₂" value="SpO₂ > 92%" />
      <ProtoRow label="PEEP" value="5-10 cmH₂O" />
      <ProtoRow label="Pplato" value="< 30 cmH₂O" />
      <ProtoBox text="PCV em Fistula Pleural: modalidade mais adequada pois o vazamento e compensado. PEEP elevada pode perpetuar trajeto fistuloso." />
      <ProtoSection title="Condutas Especificas:" />
      <ProtoNote text="• Investigar: Pneumotorax, hemotorax, contusao pulmonar" />
      <ProtoNote text="• Drenagem toracica: se pneumo > 2cm ou hemotorax" />
      <ProtoNote text="• RX torax DIARIO | Analgesia RIGOROSA | Fluidoterapia RESTRITIVA" />
    </div>
  )
  if (id === 'intraop') return (
    <div>
      <ProtoSection title="VM Intra-Operatorio (Ventilacao Protetora)" color="#60a5fa" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV ou PCV" />
      <ProtoRow label="Vt" value="6-8 ml/kg peso predito" obs="Ventilacao protetora" />
      <ProtoRow label="PEEP" value="5-8 cmH₂O" obs="Prevenir atelectasia" />
      <ProtoRow label="Driving Pressure" value="≤ 15 cmH₂O" />
      <ProtoRow label="FiO₂" value="30-50%" obs="Evitar 100% prolongada" />
      <ProtoRow label="FR" value="10-14 rpm" obs="EtCO₂ 35-40 mmHg" />
      <ProtoSection title="Tipos de Cirurgia:" />
      <ProtoNote text="• Laparotomia: Vt 6-8ml/kg | PEEP 5-8" />
      <ProtoNote text="• Laparoscopia: PEEP 8-10 | FR aumentar (EtCO₂ sobe)" />
      <ProtoNote text="• Toracica (monopulmonar): Vt 4-6ml/kg | FiO₂ 80-100% inicial" />
      <ProtoNote text="• Cardiaca (pos-CEC): MRA OBRIGATORIA apos CEC" />
    </div>
  )
  if (id === 'cardio') return (
    <div>
      <ProtoSection title="Cardiopatas (ICC, IAM, Valvopatias)" color="#f87171" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="A/C (VCV ou PCV) ou PSV" />
      <ProtoRow label="Vt" value="6-8 ml/kg peso predito" />
      <ProtoRow label="PEEP" value="8-12 (ICC) / 5-8 (valvopatias)" />
      <ProtoRow label="FiO₂" value="SpO₂ 92-96%" obs="Evitar 100%" />
      <ProtoRow label="FR" value="12-20 ipm" obs="PaCO₂ 35-45" />
      <ProtoRow label="Driving Pressure" value="< 15 cmH₂O" />
      <ProtoSection title="PEEP individualizada:" />
      <ProtoNote text="• ICC descompensada: PEEP 8-12 (↓ pos-carga VE)" />
      <ProtoNote text="• Cor pulmonale/TEP: PEEP baixa 5-8 (evitar sobrecarga VD)" />
      <ProtoNote text="• Estenose aortica: PEEP baixa 5-8 (manter pre-carga)" />
      <ProtoSection title="VNI - 1a Linha em Edema Pulmonar Cardiogenico:" />
      <ProtoNote text="• CPAP: 8-12 cmH₂O | BiPAP: IPAP 15-20, EPAP 8-10" />
      <ProtoNote text="• Reduz intubacao 50-60%, mortalidade 40%" />
      <ProtoSection title="Desmame em Cardiopatas:" />
      <ProtoBox text="EPID (Edema Pulmonar Induzido por Desmame): 10-20% durante TRE. VNI pos-extubacao profilatica: CPAP 8 cmH₂O por 24-48h." />
    </div>
  )
  if (id === 'tep') return (
    <div>
      <ProtoSection title="TEP (Tromboembolismo Pulmonar)" color="#a78bfa" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="A/C (VCV ou PCV)" />
      <ProtoRow label="Vt" value="6 ml/kg peso predito" />
      <ProtoRow label="PEEP" value="0-5 cmH₂O" obs="MINIMA possivel!" />
      <ProtoRow label="FiO₂" value="SpO₂ 88-92%" />
      <ProtoRow label="FR" value="PaCO₂ 35-40" obs="Evitar hipercapnia: ↑ RVP" />
      <ProtoRow label="Driving Pressure" value="< 15 cmH₂O" />
      <ProtoBox text="VM DELETERIA: PEEP comprime capilares → ↑ RVP → sobrecarga VD → colapso hemodinamico. VNI NAO indicada no TEP." />
      <ProtoSection title="Tratamento Especifico:" />
      <ProtoNote text="• HNF IV: 80 U/kg bolus → 18 U/kg/h | Enoxaparina 1 mg/kg 12/12h" />
      <ProtoNote text="• Trombolitico (alto risco): rtPA 100 mg IV em 2h OU 50 mg bolus se PCR" />
      <ProtoSection title="Evitar:" />
      <ProtoNote text="• PEEP > 8 | Hipercapnia (PaCO₂ > 50) | Hiperinsuflacao" />
    </div>
  )
  if (id === 'obeso') return (
    <div>
      <ProtoSection title="Obeso (IMC ≥ 30 kg/m²)" color="#facc15" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV ou PCV" />
      <ProtoRow label="Vt" value="6-8 ml/kg PESO PREDITO" obs="NAO peso real!" />
      <ProtoRow label="PEEP (por IMC)" value="30-35: 8-10 | 35-40: 10-12" obs="IMC>40: 12-18 | >50: 15-20" />
      <ProtoRow label="Driving Pressure" value="< 15 cmH₂O" obs="MAIS IMPORTANTE que Pplato!" />
      <ProtoRow label="Posicao" value="Cabeceira 30-45°" obs="OBRIGATORIA!" />
      <ProtoBox text="PBW: Homem: 50 + 0,91 × [altura(cm) - 152,4] | Mulher: 45,5 + 0,91 × [altura(cm) - 152,4]" />
      <ProtoSection title="Desmame e Extubacao:" />
      <ProtoNote text="• VNI profilatica pos-extubacao: BiPAP IPAP 10-12, EPAP 8-10 por 24-48h (↓ reintubacao 50%)" />
      <ProtoNote text="• Posicao 45°, fisioterapia agressiva" />
    </div>
  )
  if (id === 'pav') return (
    <div>
      <ProtoSection title="PAV (Pneumonia Associada a Ventilacao)" color="#fb923c" />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV ou PSV conforme tolerancia" />
      <ProtoRow label="Vt" value="6-8 ml/kg peso predito" obs="Ventilacao protetora" />
      <ProtoRow label="PEEP" value="5-10 cmH₂O" />
      <ProtoRow label="Driving Pressure" value="< 15 cmH₂O" />
      <ProtoSection title="Antibioticoterapia:" />
      <ProtoNote text="• EMPIRICA precoce (1a hora). Colher culturas ANTES de iniciar ATB." />
      <ProtoNote text="• ATB empirico: Pip-Tazo 4,5g IV 6/6h OU Meropenem 1g 8/8h" />
      <ProtoNote text="• MRSA: Vancomicina 15 mg/kg 12/12h (se fatores de risco)" />
      <ProtoNote text="• Duracao: 7-8 dias (se boa resposta clinica)" />
      <ProtoSection title="Bundle de Prevencao:" />
      <ProtoNote text="• Cabeceira 30-45° | Higiene oral clorexidina 0,12% 2x/dia" />
      <ProtoNote text="• Aspiracao subglotica 2-4h | Despertar diario" />
    </div>
  )
  if (id === 'me') return (
    <div>
      <ProtoSection title="Morte Encefalica - Protocolo do Doador" color="#94a3b8" />
      <ProtoBox text="Objetivo: Manter OXIGENACAO e PERFUSAO tecidual para preservar orgaos para doacao, minimizando VILI." />
      <ProtoSection title="PARAMETROS VENTILATORIOS:" />
      <ProtoRow label="Modo" value="VCV" obs="Volume minuto estavel" />
      <ProtoRow label="VC" value="6-8 ml/kg peso predito" obs="NUNCA peso real!" />
      <ProtoRow label="FR" value="12-16 ipm" obs="PaCO₂ 35-45 mmHg" />
      <ProtoRow label="PEEP" value="5-8 cmH₂O" obs="Evitar >10 (hipotensao)" />
      <ProtoRow label="FiO₂" value="≤ 40% (menor possivel)" obs="SpO₂ ≥ 95%" />
      <ProtoRow label="Pplato" value="≤ 30 cmH₂O" />
      <ProtoRow label="Driving Pressure" value="≤ 15 cmH₂O" />
      <ProtoSection title="Pre-requisitos ME (CFM 2.173/2017):" />
      <ProtoNote text="• Causa conhecida e irreversivel | Temp ≥ 35°C | PAS ≥ 100 mmHg" />
      <ProtoNote text="• Ausencia de drogas depressoras SNC | Observacao ≥ 6 horas" />
    </div>
  )
  return null
}

export function ProntuarioSystemPanel() {
  const [view, setView] = useState<PanelView>('records')
  const [records, setRecords] = useState<ICURecord[]>([])
  const [archive, setArchive] = useState<ICURecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FormTab>('dados')
  const [hydrated, setHydrated] = useState(false)
  const [expandedProtocols, setExpandedProtocols] = useState<Set<string>>(new Set())
  const [collapsedPeep, setCollapsedPeep] = useState(true)
  const [collapsedDesmame, setCollapsedDesmame] = useState(true)
  const [collapsedProna, setCollapsedProna] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'offline' | 'error'>('idle')
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [syncCodeInput, setSyncCodeInput] = useState('')
  const [importingSync, setImportingSync] = useState(false)
  const [syncCopied, setSyncCopied] = useState(false)

  // Returns current session_id, creating one if needed
  function getOrCreateSessionId(): string {
    let id = localStorage.getItem('sea-session-id')
    if (!id) { id = generateId(); localStorage.setItem('sea-session-id', id) }
    return id
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load from localStorage first (fast, always available)
        const storedRecords = localStorage.getItem(STORAGE_KEYS.records)
        const storedArchive = localStorage.getItem(STORAGE_KEYS.archive)
        let localRecords: ICURecord[] = storedRecords
          ? (JSON.parse(storedRecords) as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
          : []
        let localArchive: ICURecord[] = storedArchive
          ? (JSON.parse(storedArchive) as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
          : []

        // 2. Try to load from Supabase — picks up data saved on another device with same session_id
        if (supabase) {
          const sessionId = getOrCreateSessionId()
          const { data } = await supabase.from('icu_sessions').select('records,archive').eq('session_id', sessionId).maybeSingle()
          if (data?.records) {
            localRecords = (data.records as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
            localArchive = ((data.archive ?? []) as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
            // Keep localStorage in sync
            localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(localRecords))
            localStorage.setItem(STORAGE_KEYS.archive, JSON.stringify(localArchive))
          }
        }

        setRecords(localRecords)
        setArchive(localArchive)
      } catch {
        setRecords([])
        setArchive([])
      } finally {
        setHydrated(true)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records))
    localStorage.setItem(STORAGE_KEYS.archive, JSON.stringify(archive))
  }, [archive, hydrated, records])

  // Supabase sync — debounced 2 s after any record change
  useEffect(() => {
    if (!hydrated || !supabase) {
      if (hydrated) setSyncStatus('offline')
      return
    }
    setSyncStatus('syncing')
    const timer = setTimeout(async () => {
      try {
        const sessionId = getOrCreateSessionId()
        const { error } = await supabase!.from('icu_sessions').upsert({
          session_id: sessionId,
          records: records,
          archive: archive,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'session_id' })
        setSyncStatus(error ? 'offline' : 'saved')
      } catch {
        setSyncStatus('offline')
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [archive, hydrated, records])

  useEffect(() => {
    if (selectedId && !records.some((record) => record.id === selectedId) && !archive.some((record) => record.id === selectedId)) {
      setSelectedId(null)
    }
  }, [records, archive, selectedId])

  const tabContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedId) return
    tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeTab])

  const currentRecord = records.find((record) => record.id === selectedId)
    ?? archive.find((record) => record.id === selectedId)
    ?? null
  const isViewingArchived = currentRecord ? archive.some((r) => r.id === currentRecord.id) : false

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
    const pplatoVal = currentRecord.pplato ? parseNumber(currentRecord.pplato) : 0
    const peepVal = currentRecord.peep ? parseNumber(currentRecord.peep) : 0
    const vtEfetivo = (currentRecord.vt ? parseNumber(currentRecord.vt) : 0) || (currentRecord.vc ? parseNumber(currentRecord.vc) : 0)
    // DP e Cest: só com Pplat real (pausa inspiratória — VCV/PRVC)
    const dp = pplatoVal && peepVal ? calcDP(pplatoVal, peepVal) : null
    const cest = dp && vtEfetivo ? calcCest(vtEfetivo, dp) : null
    const cdyn = calcCdyn(vtEfetivo, currentRecord.ppico ? parseNumber(currentRecord.ppico) : 0, peepVal)
    const mechanicalPower = calcMechanicalPower(parseNumber(currentRecord.fr), parseNumber(currentRecord.vt), parseNumber(currentRecord.ppico), parseNumber(currentRecord.peep))
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
    const veManual = currentRecord.ve ? parseNumber(currentRecord.ve) : null
    const frVal = currentRecord.fr ? parseNumber(currentRecord.fr) : 0
    const vtOrVc = currentRecord.vt ? parseNumber(currentRecord.vt) : currentRecord.vc ? parseNumber(currentRecord.vc) : 0
    const veCalc = frVal > 0 && vtOrVc > 0 ? (frVal * vtOrVc) / 1000 : null
    const minuteVentilation = veManual ?? veCalc

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
      cdyn,
      mechanicalPower,
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

  // ── SMART ALERTS — cruzamento inteligente de dados ──
  const smartAlerts = useMemo(() => {
    if (!currentRecord || !calculations) return []
    const a: Array<{ text: string; color: string; action?: string }> = []

    // 1. TOT/TNT selecionado mas sem modo VM → sugerir preencher VM
    const isIntubated = currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT'
    const isTQT = currentRecord.tipoVia?.startsWith('TQT')
    const onVM = isIntubated || (isTQT && currentRecord.tipoVia === 'TQT-VM')
    if (onVM && !currentRecord.modoVM) {
      a.push({ text: 'Paciente intubado sem modo VM preenchido', color: '#60a5fa', action: 'Preencher parametros de VM na aba Resp' })
    }

    // 2. Via aérea mudou para RE (ar ambiente/O2) com data TOT → paciente extubou
    const isRE = currentRecord.tipoVia?.startsWith('RE')
    if (isRE && currentRecord.dataTOT && !currentRecord.dataExtubacao) {
      a.push({ text: 'Via aerea em RE mas sem data de extubacao', color: '#facc15', action: 'Preencher data/hora da extubacao nos eventos' })
    }

    // 3. P/F calculado → classificar SDRA
    if (calculations.pf && calculations.pf <= 300) {
      const grau = calculations.pf <= 100 ? 'GRAVE' : calculations.pf <= 200 ? 'MODERADA' : 'LEVE'
      const cor = calculations.pf <= 100 ? '#f87171' : calculations.pf <= 200 ? '#fb923c' : '#facc15'
      a.push({ text: `P/F ${calculations.pf.toFixed(0)} → SDRA ${grau}`, color: cor, action: grau === 'GRAVE' ? 'Considerar prona, PEEP alta, VC 6mL/kg' : 'Ventilacao protetora, monitorar evolucao' })
    }

    // 4. Driving Pressure > 15
    if (calculations.dp && calculations.dp > 15) {
      a.push({ text: `Driving Pressure ${calculations.dp.toFixed(0)} cmH₂O (> 15)`, color: '#f87171', action: 'Reduzir VC ou ajustar PEEP para DP ≤ 15' })
    }

    // 5. Sedativos reduzindo → correlacionar com desmame
    const sedReducing = currentRecord.sedativos?.some((s: SedativeEntry) => {
      const trend = calcDrugTrend(s.doseInicio, s.doseAtual)
      return trend === 'reduziu'
    })
    if (sedReducing && onVM) {
      a.push({ text: 'Sedativo em reducao — avaliar despertar diario', color: '#4ade80', action: 'Considerar janela de sedacao, avaliar RASS e drive respiratorio' })
    }

    // 6. Dias TOT > 7 → intubação prolongada
    if (calculations.daysTOT && calculations.daysTOT >= 7 && isIntubated) {
      a.push({ text: `Intubacao prolongada: D${calculations.daysTOT} de TOT`, color: '#f87171', action: calculations.daysTOT >= 14 ? 'Considerar TQT — intubacao > 14 dias' : 'Avaliar indicacao de TQT se perspectiva de VM prolongada' })
    }

    // 7. Glasgow + drive → elegibilidade desmame
    if (calculations.glasgow && calculations.glasgow >= 8 && onVM) {
      const hasDrive = currentRecord.p01 || currentRecord.pocc
      if (hasDrive) {
        a.push({ text: `Glasgow ${calculations.glasgow} + drive presente → avaliar desmame`, color: '#4ade80', action: 'Paciente com nivel de consciencia e drive respiratorio — checar criterios de elegibilidade' })
      }
    }
    if (calculations.glasgow && calculations.glasgow < 8 && onVM) {
      a.push({ text: `Glasgow ${calculations.glasgow} — nivel de consciencia rebaixado`, color: '#fb923c', action: 'Sem condicoes de protecao de via aerea. Manter VM.' })
    }

    // 8. Gasometria com disturbio acido-base
    if (calculations.gaso?.disturbio && calculations.gaso.disturbio !== 'Normal') {
      a.push({ text: `Gasometria: ${calculations.gaso.disturbio}`, color: '#fb923c', action: calculations.gaso.disturbio.includes('Acidose respiratoria') ? 'Aumentar VM (FR ou VC) para corrigir PaCO₂' : calculations.gaso.disturbio.includes('Alcalose respiratoria') ? 'Reduzir VM — pode dificultar desmame' : 'Corrigir disturbio metabolico' })
    }

    // 9. RSBI automatico de FR e VC
    if (calculations.rsbi && onVM) {
      const cor = calculations.rsbi < 80 ? '#4ade80' : calculations.rsbi < 105 ? '#facc15' : '#f87171'
      if (calculations.rsbi >= 105) {
        a.push({ text: `RSBI ${calculations.rsbi.toFixed(0)} (≥ 105) — risco de falha no desmame`, color: cor })
      }
    }

    // 10. Balanço hidrico positivo → dificulta desmame
    const bal24 = parseNumber(currentRecord.balanco24h)
    if (bal24 > 500 && onVM) {
      a.push({ text: `Balanco hidrico +${bal24}mL — dificulta desmame`, color: '#facc15', action: 'Considerar restricao hidrica ou diuretico antes do TRE' })
    }

    return a
  }, [currentRecord, calculations])

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
    <div className="rounded-[0.75rem] border border-white/10 bg-black/16 p-1.5">
      <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/40">{icon} {label}</p>
      <select
        className="w-full rounded-[0.4rem] border border-white/10 bg-black/22 px-1 py-0.5 text-[9px] text-white outline-none"
        defaultValue=""
        onChange={(event) => {
          toggleStringArrayField(field, event.target.value)
          event.target.selectedIndex = 0
        }}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {(currentRecord?.[field] as string[])?.length ? (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {(currentRecord?.[field] as string[]).map((item) => {
            const ok = item.startsWith('Normal') || item === 'Sem assincronias'
            return (
              <div
                key={`${field}-${item}`}
                className="flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px]"
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
                  className="text-[10px] leading-none text-[#fca5a5]"
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
        next.push({ droga: '', inicio: '', dose: '', unidade: 'mcg/kg/min' } satisfies DVAEntry)
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
        next.push({ data: '', tipo: '', laudo: '', achados: [] as string[] } as unknown as Record<string, string>)
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
      pmean: currentRecord.pmean || '',
      ps: currentRecord.ps,
      ipap: currentRecord.ipap || '',
      epap: currentRecord.epap || '',
      p01: currentRecord.p01 || '',
      pocc: currentRecord.pocc || '',
      pmusc: calculations?.pmusc ? calculations.pmusc.toFixed(1) : (currentRecord.pmusc || ''),
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

  const ensureMraRows = (rows: MraRow[]): MraRow[] => {
    const result = [...rows]
    while (result.length < 8) result.push({ plato: '', peep: '', cest: '', sat: '', pam: '', best: false })
    return result
  }

  const ensureTitRows = (rows: TitRow[]): TitRow[] => {
    const result = [...rows]
    while (result.length < 10) result.push({ pico: '', plato: '', peep: '', cest: '', si: '', sat: '', pam: '', best: false })
    return result
  }

  const setMraField = (index: number, field: keyof MraRow, value: string) => {
    updateCurrentRecord((record) => {
      const next = ensureMraRows(record.mraTab || [])
      next[index] = { ...next[index], [field]: value }
      return { ...record, mraTab: next }
    })
  }

  const toggleMraBest = (index: number) => {
    updateCurrentRecord((record) => {
      const next = ensureMraRows(record.mraTab || [])
      next[index] = { ...next[index], best: !next[index].best }
      return { ...record, mraTab: next }
    })
  }

  const setTitField = (index: number, field: keyof TitRow, value: string) => {
    updateCurrentRecord((record) => {
      const next = ensureTitRows(record.titTab || [])
      next[index] = { ...next[index], [field]: value }
      return { ...record, titTab: next }
    })
  }

  const toggleTitBest = (index: number) => {
    updateCurrentRecord((record) => {
      const next = ensureTitRows(record.titTab || [])
      next[index] = { ...next[index], best: !next[index].best }
      return { ...record, titTab: next }
    })
  }

  const saveDesmame = () => {
    if (!currentRecord) return
    const rsbi = calculations?.weanRsbi ? calculations.weanRsbi.toFixed(1) : ''
    const vm = calculations?.weanMinuteVentilation ? calculations.weanMinuteVentilation.toFixed(1) : ''
    const analise = calculations?.weanSummary?.text || ''
    if (!currentRecord.dPimax && !currentRecord.dPemax && !currentRecord.dVcDesm) return
    const entry: DesmHistEntry = {
      ts: nowIso(),
      pimax: currentRecord.dPimax,
      pemax: currentRecord.dPemax,
      vc: currentRecord.dVcDesm,
      fr: currentRecord.dFrDesm,
      cv: currentRecord.dCv,
      vm,
      rsbi,
      analise,
    }
    updateCurrentRecord((record) => ({ ...record, desmHist: [entry, ...(record.desmHist || [])] }))
  }

  const deleteDesmame = (index: number) => {
    updateCurrentRecord((record) => ({ ...record, desmHist: (record.desmHist || []).filter((_, i) => i !== index) }))
  }

  const saveDesmEtapas = () => {
    if (!currentRecord) return
    const isTOT = currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML'
    const isTQT = currentRecord.tipoVia?.startsWith('TQT')
    let tipo = 'Simples'
    if (currentRecord.treOK && currentRecord.treDt && currentRecord.dataTOT) {
      const dias = Math.floor((new Date(currentRecord.treDt).getTime() - new Date(currentRecord.dataTOT).getTime()) / 86400000)
      if (dias > 14) tipo = 'Prolongado'
      else if (dias > 7) tipo = 'Dificil'
    }
    const entry: DesmEtapaEntry = {
      ts: nowIso(),
      treOK: currentRecord.treOK === '1',
      treDt: currentRecord.treDt,
      treTm: currentRecord.treTm,
      extOK: isTOT ? currentRecord.extOK === '1' : false,
      extResult: currentRecord.extResult,
      descVMOK: isTQT ? currentRecord.descVMOK === '1' : false,
      descResult: currentRecord.descResult,
      tipo,
    }
    updateCurrentRecord((record) => ({ ...record, desmEtapasHist: [entry, ...(record.desmEtapasHist || [])] }))
  }

  const deleteDesmEtapa = (index: number) => {
    updateCurrentRecord((record) => ({ ...record, desmEtapasHist: (record.desmEtapasHist || []).filter((_, i) => i !== index) }))
  }

  const saveMrc = () => {
    if (!currentRecord) return
    const mrc = calculations?.mrc
    if (!mrc) return
    const entry: MrcHistEntry = {
      ts: nowIso(),
      ombroD: currentRecord.mrcOmbroD, ombroE: currentRecord.mrcOmbroE,
      cotoveloD: currentRecord.mrcCotoveloD, cotoveloE: currentRecord.mrcCotoveloE,
      punhoD: currentRecord.mrcPunhoD, punhoE: currentRecord.mrcPunhoE,
      quadrilD: currentRecord.mrcQuadrilD, quadrilE: currentRecord.mrcQuadrilE,
      joelhoD: currentRecord.mrcJoelhoD, joelhoE: currentRecord.mrcJoelhoE,
      tornozeloD: currentRecord.mrcTornozeloD, tornozeloE: currentRecord.mrcTornozeloE,
      total: mrc.total,
    }
    updateCurrentRecord((r) => ({ ...r, mrcHist: [entry, ...(r.mrcHist || [])] }))
  }
  const deleteMrc = (index: number) => {
    updateCurrentRecord((r) => ({ ...r, mrcHist: (r.mrcHist || []).filter((_, i) => i !== index) }))
  }

  const savePerme = () => {
    if (!currentRecord) return
    const perme = calculations?.perme
    if (!perme) return
    const entry: PermeHistEntry = {
      ts: nowIso(),
      estado: currentRecord.permeEstado,
      barreira: currentRecord.permeBarreira,
      forcaMS: currentRecord.permeForcaMS,
      forcaMI: currentRecord.permeForcaMI,
      leito: currentRecord.permeLeito,
      transf: currentRecord.permeTransf,
      marcha: currentRecord.permeMarcha,
      total: perme.total,
    }
    updateCurrentRecord((r) => ({ ...r, permeHist: [entry, ...(r.permeHist || [])] }))
  }
  const deletePerme = (index: number) => {
    updateCurrentRecord((r) => ({ ...r, permeHist: (r.permeHist || []).filter((_, i) => i !== index) }))
  }

  const saveIms = () => {
    if (!currentRecord || !currentRecord.imsScore) return
    const entry: ImsHistEntry = { ts: nowIso(), score: currentRecord.imsScore }
    updateCurrentRecord((r) => ({ ...r, imsHist: [entry, ...(r.imsHist || [])] }))
  }
  const deleteIms = (index: number) => {
    updateCurrentRecord((r) => ({ ...r, imsHist: (r.imsHist || []).filter((_, i) => i !== index) }))
  }

  const saveProna = () => {
    if (!currentRecord || !currentRecord.pronaAtiva) return
    const entry: PronaHistEntry = {
      ts: nowIso(),
      tempo: currentRecord.pronaTempo,
      dataInicio: currentRecord.pronaData,
      horaInicio: currentRecord.pronaHora,
    }
    updateCurrentRecord((record) => ({ ...record, pronaHist: [entry, ...(record.pronaHist || [])] }))
  }

  const deleteProna = (index: number) => {
    updateCurrentRecord((record) => ({ ...record, pronaHist: (record.pronaHist || []).filter((_, i) => i !== index) }))
  }

  const addRecord = () => {
    const record = createRecord()
    setRecords((prev) => [record, ...prev])
    setSelectedId(record.id)
    setActiveTab('dados')
    setView('records')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Import data from another device's session
  const importSession = async () => {
    const code = syncCodeInput.trim()
    if (!code || !supabase) return
    setImportingSync(true)
    try {
      const { data } = await supabase.from('icu_sessions').select('records,archive').eq('session_id', code).maybeSingle()
      if (data?.records) {
        const imported = (data.records as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
        const importedArchive = ((data.archive ?? []) as Array<Partial<ICURecord>>).map(r => normalizeRecord(r))
        // Switch this device to use the imported session_id
        localStorage.setItem('sea-session-id', code)
        localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(imported))
        localStorage.setItem(STORAGE_KEYS.archive, JSON.stringify(importedArchive))
        setRecords(imported)
        setArchive(importedArchive)
        setShowSyncModal(false)
        setSyncCodeInput('')
      } else {
        alert('Código não encontrado ou sem dados.')
      }
    } catch {
      alert('Erro ao importar. Verifique o código e tente novamente.')
    } finally {
      setImportingSync(false)
    }
  }

  const openRecord = (id: string) => {
    setSelectedId(id)
    setActiveTab('dados')
    setView('records')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const archiveRecord = (id: string) => {
    const target = records.find((r) => r.id === id)
    if (!target) return
    setRecords((prev) => prev.filter((r) => r.id !== id))
    setArchive((prev) => [{ ...target, updatedAt: nowIso() }, ...prev])
    if (selectedId === id) setSelectedId(null)
  }

  const restoreRecord = (id: string) => {
    const target = archive.find((r) => r.id === id)
    if (!target) return
    setArchive((prev) => prev.filter((r) => r.id !== id))
    setRecords((prev) => [{ ...target, updatedAt: nowIso() }, ...prev])
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
      <div className="chrome-board rounded-[1.8rem] p-3 md:p-6">
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
              <h3 className="text-[1rem] font-semibold text-white/92">Pacientes e referencia clinica</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(recordBadges.viaCounts).map(([key, count]) =>
                  count > 0 ? (
                    <span
                      key={key}
                      className="rounded-full border px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        borderColor: VIA_BADGE_STYLES[key]?.border ?? 'rgba(255,255,255,0.12)',
                        background: VIA_BADGE_STYLES[key]?.background ?? 'rgba(255,255,255,0.05)',
                        color: VIA_BADGE_STYLES[key]?.color ?? 'rgba(255,255,255,0.72)',
                      }}
                    >
                      {VIA_BADGE_STYLES[key]?.label ?? key}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sync status indicator */}
            {syncStatus === 'syncing' && (
              <span className="flex items-center gap-1 rounded-full border border-[#60a5fa30] bg-[#60a5fa0a] px-2 py-0.5 text-[9px] font-semibold text-[#60a5fa]">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />Sync
              </span>
            )}
            {syncStatus === 'saved' && (
              <span className="flex items-center gap-1 rounded-full border border-[#4ade8030] bg-[#4ade800a] px-2 py-0.5 text-[9px] font-semibold text-[#4ade80]">
                <CheckCircle2 className="h-2.5 w-2.5" />Salvo
              </span>
            )}
            {syncStatus === 'offline' && (
              <span className="flex items-center gap-1 rounded-full border border-[#facc1530] bg-[#facc150a] px-2 py-0.5 text-[9px] font-semibold text-[#facc15]">
                <WifiOff className="h-2.5 w-2.5" />Offline
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="flex items-center gap-1 rounded-full border border-[#f8717130] bg-[#f871710a] px-2 py-0.5 text-[9px] font-semibold text-[#f87171]">
                <Cloud className="h-2.5 w-2.5" />Erro
              </span>
            )}
            <ActionButton icon={Link2} label="Sincronizar" active={showSyncModal} onClick={() => setShowSyncModal(v => !v)} />
            <ActionButton icon={Archive} label="Arquivo" badge={archive.length} active={view === 'archive'} onClick={() => setView(view === 'archive' ? 'records' : 'archive')} />
            <ActionButton icon={BookOpen} label="Ref." active={view === 'reference'} onClick={() => setView(view === 'reference' ? 'records' : 'reference')} />
            <ActionButton icon={Plus} label="Adicionar" onClick={addRecord} />
          </div>
        </div>

        {/* Sync modal — share session code between devices */}
        {showSyncModal && (
          <div className="chrome-panel rounded-[1.2rem] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/72">Sincronizar entre dispositivos</p>
              <button onClick={() => setShowSyncModal(false)} className="text-white/38 hover:text-white/72 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/48">Código deste dispositivo — copie e cole no outro aparelho para usar os mesmos dados:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-[0.6rem] border border-white/10 bg-black/20 px-2.5 py-1.5 text-[10px] text-[#60a5fa] font-mono">
                  {typeof window !== 'undefined' ? (localStorage.getItem('sea-session-id') ?? '—') : '—'}
                </code>
                <button
                  onClick={() => {
                    const id = localStorage.getItem('sea-session-id')
                    if (id) {
                      navigator.clipboard.writeText(id).then(() => {
                        setSyncCopied(true)
                        setTimeout(() => setSyncCopied(false), 2000)
                      })
                    }
                  }}
                  className="flex items-center gap-1 rounded-[0.6rem] border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-white/72 hover:bg-white/10 transition-colors"
                >
                  {syncCopied ? <CheckCircle2 className="h-3 w-3 text-[#4ade80]" /> : <Copy className="h-3 w-3" />}
                  {syncCopied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/48">Ou cole aqui o código de outro dispositivo para importar os dados dele:</p>
              <div className="flex items-center gap-2">
                <input
                  value={syncCodeInput}
                  onChange={e => setSyncCodeInput(e.target.value)}
                  placeholder="Cole o código aqui..."
                  className="flex-1 rounded-[0.6rem] border border-white/10 bg-black/20 px-2.5 py-1.5 text-[10px] text-white placeholder:text-white/28 outline-none focus:border-white/20"
                />
                <button
                  onClick={importSession}
                  disabled={!syncCodeInput.trim() || importingSync}
                  className="flex items-center gap-1 rounded-[0.6rem] border border-[#60a5fa30] bg-[#60a5fa0a] px-2.5 py-1.5 text-[10px] font-semibold text-[#60a5fa] hover:bg-[#60a5fa18] transition-colors disabled:opacity-40"
                >
                  {importingSync ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}
                  Importar
                </button>
              </div>
            </div>
          </div>
        )}

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
                      onClick={() => openRecord(record.id)}
                      className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </button>
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
            <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedId(null); if (isViewingArchived) setView('archive') }}
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

                <div className="flex items-center justify-center gap-1.5">
                  {isViewingArchived ? (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-[0.7rem] border border-[#facc1530] bg-[#facc150d] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-[#fde68a]">
                        <Archive className="h-3 w-3" /> Arquivado
                      </span>
                      <button
                        onClick={() => { restoreRecord(currentRecord.id); setSelectedId(currentRecord.id) }}
                        className="chrome-subtle inline-flex items-center gap-1 rounded-[0.7rem] border border-white/12 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-white/72"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restaurar
                      </button>
                      <button
                        onClick={() => { deletePermanently(currentRecord.id); setSelectedId(null) }}
                        className="inline-flex items-center gap-1 rounded-[0.7rem] border border-[#f8717130] bg-[#f8717110] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-[#fca5a5]"
                      >
                        <Trash2 className="h-3 w-3" />
                        Apagar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={saveAndClose}
                        className="chrome-subtle inline-flex items-center gap-1 rounded-[0.7rem] border border-white/12 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-white/72"
                      >
                        <Save className="h-3 w-3" />
                        Salvar
                      </button>
                      <button
                        onClick={() => archiveRecord(currentRecord.id)}
                        className="inline-flex items-center gap-1 rounded-[0.7rem] border border-[#facc1530] bg-[#facc150d] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-[#fde68a]"
                      >
                        <Archive className="h-3 w-3" />
                        Arquivar
                      </button>
                      <button
                        onClick={() => deleteActiveRecord(currentRecord.id)}
                        className="inline-flex items-center gap-1 rounded-[0.7rem] border border-[#f8717130] bg-[#f8717110] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-[#fca5a5]"
                      >
                        <Trash2 className="h-3 w-3" />
                        Apagar
                      </button>
                    </>
                  )}
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

            <div ref={tabContentRef} />

            {/* ── SMART ALERTS ── */}
            {smartAlerts.length > 0 && (
              <div className="mb-4 space-y-1.5">
                {smartAlerts.map((alert, i) => (
                  <div key={i} className="rounded-[1rem] border px-3 py-2" style={{ borderColor: `${alert.color}25`, background: `${alert.color}08` }}>
                    <p className="text-[11px] font-semibold" style={{ color: alert.color }}>{alert.text}</p>
                    {alert.action && <p className="text-[10px] text-white/40 mt-0.5">{alert.action}</p>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dados' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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
                        className={INPUT_CLASS_SM}
                        value={currentRecord.nome}
                        onChange={(event) => setField('nome', event.target.value)}
                        placeholder="Nome do paciente"
                      />
                    </FieldShell>
                  </div>

                  {/* 5 + 5 */}
                  <div className="grid grid-cols-5 gap-2">
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
                    <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2">
                      <div className="scrollbar-hide flex flex-nowrap items-center gap-1.5 overflow-x-auto">
                        {calculations?.vtTargets?.length ? (
                          calculations.vtTargets.map((target) => (
                            <span
                              key={target.multiplier}
                              className="shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.10em]"
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
                              {target.multiplier === 6 ? '★ ' : ''}VC{target.multiplier}: {target.value}mL
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
                    <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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

                    <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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
                              <div className="grid grid-cols-5 gap-1">
                                {LAB_FIELDS.map((field) => (
                                  <div key={field.key} className="space-y-1">
                                    <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.12em] text-white/48">
                                      {field.label}
                                      {field.unit ? (
                                        <span className="ml-0.5 text-[6px] normal-case tracking-normal text-white/28">
                                          {field.unit}
                                        </span>
                                      ) : null}
                                    </p>
                                    <input
                                      className={INPUT_CLASS_LAB}
                                      value={String(exam[field.key] ?? '')}
                                      onChange={(event) => updateListItem('examesLabList', index, field.key, event.target.value)}
                                      placeholder={field.ref}
                                    />
                                  </div>
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
                    <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Avaliacao neurologica
                  </p>
                  <div className="grid gap-2 grid-cols-5">
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
                        <option value="+4">+4 Combativo</option>
                        <option value="+3">+3 Muito agitado</option>
                        <option value="+2">+2 Agitado</option>
                        <option value="+1">+1 Inquieto</option>
                        <option value="0">0 Alerta e calmo</option>
                        <option value="-1">-1 Sonolento</option>
                        <option value="-2">-2 Sedação leve</option>
                        <option value="-3">-3 Sedação moderada</option>
                        <option value="-4">-4 Sedação profunda</option>
                        <option value="-5">-5 Não despertável</option>
                      </select>
                    </FieldShell>
                    <FieldShell label="M.RASS">
                      <select className={INPUT_CLASS_SM} value={currentRecord.metaRASS} onChange={(e) => setField('metaRASS', e.target.value)}>
                        <option value="">--</option>
                        <option value="0">0 Alerta e calmo</option>
                        <option value="-1">-1 Sonolento</option>
                        <option value="-2">-2 Sedação leve</option>
                        <option value="-3">-3 Sedação moderada</option>
                        <option value="-4">-4 Sedação profunda</option>
                        <option value="-5">-5 Não despertável</option>
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
                    <MetricChip label="RASS" value={currentRecord.rass || '--'} hint={currentRecord.metaRASS ? `Meta ${currentRecord.metaRASS}` : null} color={
                      currentRecord.rass === '+4' || currentRecord.rass === '+3' ? '#f87171'
                      : currentRecord.rass === '+2' || currentRecord.rass === '+1' ? '#fb923c'
                      : currentRecord.rass === '0' ? '#4ade80'
                      : currentRecord.rass === '-1' || currentRecord.rass === '-2' ? '#60a5fa'
                      : currentRecord.rass === '-3' ? '#facc15'
                      : currentRecord.rass === '-4' || currentRecord.rass === '-5' ? '#f87171'
                      : undefined
                    } />
                    <MetricChip label="TOF" value={currentRecord.ultimoTOF || '--'} hint={currentRecord.metaTOF ? `Meta ${currentRecord.metaTOF}` : null} />
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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

                  <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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

                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Hemodinamica / DVA
                  </p>
                  <div className="grid gap-2 grid-cols-3 md:grid-cols-7">
                    <FieldShell label="PAS">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.pas} onChange={(event) => setField('pas', event.target.value)} placeholder="120" />
                    </FieldShell>
                    <FieldShell label="PAD">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.pad} onChange={(event) => setField('pad', event.target.value)} placeholder="80" />
                    </FieldShell>
                    <FieldShell label="PAM">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.pam} onChange={(event) => setField('pam', event.target.value)} placeholder="85" />
                    </FieldShell>
                    <FieldShell label="FC">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.fc} onChange={(event) => setField('fc', event.target.value)} placeholder="88" />
                    </FieldShell>
                    <FieldShell label="Lactato">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.lactatoCardio} onChange={(event) => setField('lactatoCardio', event.target.value)} placeholder="1.2" />
                    </FieldShell>
                    <FieldShell label="Mudanca hemodinamica" span="col-span-3 md:col-span-2">
                      <select className={INPUT_CLASS_SM} value={currentRecord.cardiovascularMudanca} onChange={(event) => setField('cardiovascularMudanca', event.target.value)}>
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

                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
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
                      currentRecord.dvaList.map((item, index) => {
                        const analise = analiseDVA(item.inicio, item.dose)
                        return (
                        <div key={`dva-${index}`} className="rounded-[1.2rem] border border-white/10 bg-black/18 p-3">
                          <div className="grid gap-2 grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                            <FieldShell label="Droga" span="col-span-2 md:col-span-1">
                              <select className={INPUT_CLASS_SM} value={item.droga} onChange={(event) => updateListItem('dvaList', index, 'droga', event.target.value)}>
                                {DVA_OPTIONS.map((option) => (
                                  <option key={option} value={option}>{option || 'Selecionar'}</option>
                                ))}
                              </select>
                            </FieldShell>
                            <FieldShell label="Inicio">
                              <input className={INPUT_CLASS_SM} value={item.inicio} onChange={(event) => updateListItem('dvaList', index, 'inicio', event.target.value)} placeholder="0.12" />
                            </FieldShell>
                            <FieldShell label="Dose atual">
                              <input className={INPUT_CLASS_SM} value={item.dose} onChange={(event) => updateListItem('dvaList', index, 'dose', event.target.value)} placeholder="0.08" />
                            </FieldShell>
                            <FieldShell label="Unidade">
                              <input className={INPUT_CLASS_SM} value={item.unidade} onChange={(event) => updateListItem('dvaList', index, 'unidade', event.target.value)} />
                            </FieldShell>
                            <div className="flex items-end justify-end pb-1 md:justify-start">
                              <button
                                onClick={() => removeListItem('dvaList', index)}
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
                        Nenhuma DVA registrada.
                      </div>
                    )}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <FieldShell label="Avaliacao cardiovascular">
                    <AutoGrowTextarea
                      value={currentRecord.cardiovascular}
                      onChange={(value) => setField('cardiovascular', value)}
                      placeholder="Perfusao, edema, resposta vasoativa, ritmos, metas..."
                    />
                  </FieldShell>
                </div>
              </div>
            ) : null}

            {activeTab === 'resp' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Via aerea / avaliacao pulmonar / secrecao
                  </p>
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    <FieldShell label="Via aerea atual">
                      <select className={INPUT_CLASS_SM} value={currentRecord.tipoVia} onChange={(event) => setField('tipoVia', event.target.value)}>
                        {VIA_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                    <FieldShell label="Avaliacao pulmonar" span="xl:col-span-2">
                      <AutoGrowTextarea
                        value={currentRecord.pulmonar}
                        onChange={(value) => setField('pulmonar', value)}
                        placeholder="Ausculta, complacencia, infiltrado, expansao..."
                      />
                    </FieldShell>
                    <FieldShell label="Secrecao">
                      <AutoGrowTextarea
                        value={currentRecord.secrecao}
                        onChange={(value) => setField('secrecao', value)}
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

                {(currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia.startsWith('TQT')) && (
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Eventos de via aerea
                  </p>
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-6">
                    {(currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT') && (
                      <>
                        <FieldShell label="Data IOT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataTOT} onChange={(event) => setField('dataTOT', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora IOT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaTOT} onChange={(event) => setField('horaTOT', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Data extubacao">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataExtubacao} onChange={(event) => setField('dataExtubacao', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora extubacao">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaExtubacao} onChange={(event) => setField('horaExtubacao', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Data Re-IOT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataReIOT} onChange={(event) => setField('dataReIOT', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora Re-IOT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaReIOT} onChange={(event) => setField('horaReIOT', event.target.value)} />
                        </FieldShell>
                      </>
                    )}

                    {currentRecord.tipoVia.startsWith('TQT') && (
                      <>
                        <FieldShell label="Data TQT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataTQT} onChange={(event) => setField('dataTQT', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora TQT">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaTQT} onChange={(event) => setField('horaTQT', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Data decanulacao">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataDecanulacao} onChange={(event) => setField('dataDecanulacao', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora decanulacao">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaDecanulacao} onChange={(event) => setField('horaDecanulacao', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Data desc. VM">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="dd/mm/aa" value={currentRecord.dataDescVM} onChange={(event) => setField('dataDescVM', event.target.value)} />
                        </FieldShell>
                        <FieldShell label="Hora desc. VM">
                          <input className={INPUT_CLASS_SM} type="text" placeholder="hh:mm" value={currentRecord.horaDescVM} onChange={(event) => setField('horaDescVM', event.target.value)} />
                        </FieldShell>
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
                )}

                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Gasometria
                  </p>
                  <div className="mb-2 flex gap-3">
                    <div className="w-[55%]">
                      <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/48">Data</p>
                      <input
                        className="w-full rounded-[0.5rem] border border-white/10 bg-black/22 px-1.5 py-1 text-[10px] text-white outline-none placeholder:text-white/30"
                        type="text"
                        placeholder="dd/mm/aa"
                        value={currentRecord.gasoData}
                        onChange={(event) => setField('gasoData', event.target.value)}
                      />
                    </div>
                    <div className="w-[45%]">
                      <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/48">Hora</p>
                      <input
                        className="w-full rounded-[0.5rem] border border-white/10 bg-black/22 px-1.5 py-1 text-[10px] text-white outline-none placeholder:text-white/30"
                        type="text"
                        placeholder="hh:mm"
                        value={currentRecord.gasoHora}
                        onChange={(event) => setField('gasoHora', event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2 grid-cols-5">
                    <FieldShell label="SpO2 S/F">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.sfSpO2} onChange={(event) => setField('sfSpO2', event.target.value)} placeholder="96" />
                    </FieldShell>
                    <FieldShell label="FiO2 S/F">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.sfFiO2} onChange={(event) => setField('sfFiO2', event.target.value)} placeholder="40" />
                    </FieldShell>
                    <FieldShell label="pH">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoPH} onChange={(event) => setField('gasoPH', event.target.value)} placeholder="7.36" />
                    </FieldShell>
                    <FieldShell label="PaCO2">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoPaCO2} onChange={(event) => setField('gasoPaCO2', event.target.value)} placeholder="45" />
                    </FieldShell>
                    <FieldShell label="PaO2">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoPaO2} onChange={(event) => setField('gasoPaO2', event.target.value)} placeholder="80" />
                    </FieldShell>
                    <FieldShell label="HCO3">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoHCO3} onChange={(event) => setField('gasoHCO3', event.target.value)} placeholder="24" />
                    </FieldShell>
                    <FieldShell label="BE">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoBE} onChange={(event) => setField('gasoBE', event.target.value)} placeholder="0" />
                    </FieldShell>
                    <FieldShell label="SaO2">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoSaO2} onChange={(event) => setField('gasoSaO2', event.target.value)} placeholder="96" />
                    </FieldShell>
                    <FieldShell label="Lac">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoLactato} onChange={(event) => setField('gasoLactato', event.target.value)} placeholder="1.5" />
                    </FieldShell>
                    <FieldShell label="FiO2">
                      <input className={INPUT_CLASS_SM} type="number" value={currentRecord.gasoFiO2} onChange={(event) => setField('gasoFiO2', event.target.value)} placeholder="40" />
                    </FieldShell>
                  </div>

                  <div className="mt-4">
                    <FieldShell label="Obs. gasometricas">
                      <AutoGrowTextarea
                        value={currentRecord.gasoObs}
                        onChange={(value) => setField('gasoObs', value)}
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

                {/* Gasometria analise — só aparece quando há dados */}
                {calculations?.gaso ? (
                  <div className="chrome-panel rounded-[1.5rem] p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">Análise gasométrica</p>
                    <p className="text-sm font-semibold" style={{ color: calculations.gaso.cor }}>{calculations.gaso.full}</p>
                    {calculations.gaso.comp ? (
                      <p className="mt-1 text-[11px] text-white/52">{calculations.gaso.comp}</p>
                    ) : null}
                  </div>
                ) : null}

                {/* P/F + S/F classificação — painel único compacto */}
                {(calculations?.pf || calculations?.sf) ? (
                  <div className="chrome-panel rounded-[1.5rem] p-3">
                    <div className="grid grid-cols-2 gap-3">

                      {/* P/F — 3 colunas */}
                      {calculations?.pf ? (
                        <div>
                          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/44">
                            P/F <span className="text-white/70">{calculations.pf.toFixed(0)}</span>
                          </p>
                          <div className="grid grid-cols-3 gap-1">
                            {/* Padrão */}
                            <div className="space-y-0.5">
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">Padrão</p>
                              {([
                                { label: '>300 Normal', active: calculations.pf > 300, color: '#4ade80' },
                                { label: '200–300 Leve', active: calculations.pf > 200 && calculations.pf <= 300, color: '#facc15' },
                                { label: '100–200 Mod.', active: calculations.pf > 100 && calculations.pf <= 200, color: '#fb923c' },
                                { label: '≤100 Grave', active: calculations.pf <= 100, color: '#f87171' },
                              ] as { label: string; active: boolean; color: string }[]).map((row, i) => (
                                <div key={i} className={`rounded-[0.4rem] px-1.5 py-0.5 text-[9px] leading-tight ${row.active ? 'font-semibold' : 'text-white/24'}`}
                                  style={row.active ? { background: row.color + '1e', border: `1px solid ${row.color}38`, color: row.color } : { border: '1px solid transparent' }}
                                >{row.label}</div>
                              ))}
                            </div>
                            {/* Berlim 2012 — sem Normal (só SDRA) */}
                            <div className="space-y-0.5">
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">Berlim 12</p>
                              {([
                                { label: '200–300 Leve', active: calculations.pf > 200 && calculations.pf <= 300, color: '#facc15' },
                                { label: '100–200 Mod.', active: calculations.pf > 100 && calculations.pf <= 200, color: '#fb923c' },
                                { label: '≤100 Grave', active: calculations.pf <= 100, color: '#f87171' },
                              ] as { label: string; active: boolean; color: string }[]).map((row, i) => (
                                <div key={i} className={`rounded-[0.4rem] px-1.5 py-0.5 text-[9px] leading-tight ${row.active ? 'font-semibold' : 'text-white/24'}`}
                                  style={row.active ? { background: row.color + '1e', border: `1px solid ${row.color}38`, color: row.color } : { border: '1px solid transparent' }}
                                >{row.label}</div>
                              ))}
                            </div>
                            {/* Global 2023 via S/F */}
                            <div className="space-y-0.5">
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">Global 23</p>
                              {([
                                { label: 'S/F>315', active: (calculations.sf ?? 0) > 315, color: '#4ade80' },
                                { label: 'S/F 235–315', active: (calculations.sf ?? 0) > 235 && (calculations.sf ?? 0) <= 315, color: '#facc15' },
                                { label: 'S/F 148–235', active: (calculations.sf ?? 0) > 148 && (calculations.sf ?? 0) <= 235, color: '#fb923c' },
                                { label: 'S/F≤148', active: (calculations.sf ?? 0) > 0 && (calculations.sf ?? 0) <= 148, color: '#f87171' },
                              ] as { label: string; active: boolean; color: string }[]).map((row, i) => (
                                <div key={i} className={`rounded-[0.4rem] px-1.5 py-0.5 text-[9px] leading-tight ${row.active ? 'font-semibold' : 'text-white/24'}`}
                                  style={row.active ? { background: row.color + '1e', border: `1px solid ${row.color}38`, color: row.color } : { border: '1px solid transparent' }}
                                >{row.label}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* S/F — 2 colunas */}
                      {calculations?.sf ? (
                        <div>
                          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/44">
                            S/F <span className="text-white/70">{calculations.sf.toFixed(0)}</span>
                            <span className="ml-1.5 text-[8px] text-white/30">≈P/F {Math.round((calculations.sf - 64) / 0.84)}</span>
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {/* Tabela 1 */}
                            <div className="space-y-0.5">
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">Tab 1</p>
                              {([
                                { pf: '>300', sf: '>315', active: calculations.sf > 315, color: '#4ade80' },
                                { pf: '<300', sf: '≤315', active: calculations.sf > 274 && calculations.sf <= 315, color: '#facc15' },
                                { pf: '<250', sf: '≤274', active: calculations.sf > 232 && calculations.sf <= 274, color: '#fb923c' },
                                { pf: '<200', sf: '≤232', active: calculations.sf > 0 && calculations.sf <= 232, color: '#f87171' },
                              ] as { pf: string; sf: string; active: boolean; color: string }[]).map((row, i) => (
                                <div key={i} className={`flex justify-between rounded-[0.4rem] px-1.5 py-0.5 text-[9px] leading-tight ${row.active ? 'font-semibold' : 'text-white/24'}`}
                                  style={row.active ? { background: row.color + '1e', border: `1px solid ${row.color}38`, color: row.color } : { border: '1px solid transparent' }}
                                >
                                  <span>{row.pf}</span><span>{row.sf}</span>
                                </div>
                              ))}
                            </div>
                            {/* Tabela 2 */}
                            <div className="space-y-0.5">
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">Tab 2</p>
                              {([
                                { pf: '>300', sf: '>315', active: calculations.sf > 315, color: '#4ade80' },
                                { pf: '≤300', sf: '≤315', active: calculations.sf > 250 && calculations.sf <= 315, color: '#facc15' },
                                { pf: '≤225', sf: '≤250', active: calculations.sf > 200 && calculations.sf <= 250, color: '#fb923c' },
                                { pf: '≤150', sf: '≤200', active: calculations.sf > 0 && calculations.sf <= 200, color: '#f87171' },
                              ] as { pf: string; sf: string; active: boolean; color: string }[]).map((row, i) => (
                                <div key={i} className={`flex justify-between rounded-[0.4rem] px-1.5 py-0.5 text-[9px] leading-tight ${row.active ? 'font-semibold' : 'text-white/24'}`}
                                  style={row.active ? { background: row.color + '1e', border: `1px solid ${row.color}38`, color: row.color } : { border: '1px solid transparent' }}
                                >
                                  <span>{row.pf}</span><span>{row.sf}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                    </div>
                  </div>
                ) : null}

                {currentRecord.gasometrias?.length ? (
                  <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Historico de gasometria · {currentRecord.gasometrias.length}
                    </p>
                    {currentRecord.gasometrias.length >= 2 && (() => {
                      const insights = analyzeGasoTrend(currentRecord.gasometrias)
                      if (!insights.length) return null
                      return (
                        <div className="mb-3 rounded-[1rem] border border-white/10 bg-black/22 p-3 space-y-1">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/36 mb-1.5">Evolução gasométrica</p>
                          {insights.map((ins, i) => (
                            <p key={i} className="text-[11px] leading-snug" style={{ color: ins.color }}>{ins.text}</p>
                          ))}
                        </div>
                      )
                    })()}
                    <div className="space-y-2">
                      {currentRecord.gasometrias.map((entry, index) => (
                        <div key={`${entry.ts}-${index}`} className="rounded-[1rem] border border-white/10 bg-black/18 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-white/86">
                                {entry.data || '--'} {entry.hora || ''}
                                {entry.analise ? <span className="ml-2 text-[10px]" style={{ color: gasoAnaliseColor(entry.analise) }}>{entry.analise}</span> : null}
                              </p>
                              <p className="mt-0.5 text-[10px] text-white/44">
                                pH {entry.pH || '--'} · PaCO2 {entry.paCO2 || '--'} · PaO2 {entry.paO2 || '--'} · HCO3 {entry.hco3 || '--'} · Lac {entry.lactato || '--'}
                              </p>
                              <p className="mt-0.5 text-[10px] text-white/36">
                                P/F {entry.pf || '--'} · S/F {entry.sf || '--'} · FiO2 {entry.fio2 || '--'}
                              </p>
                              {entry.obs ? <p className="mt-1 text-[10px] text-white/50">{entry.obs}</p> : null}
                            </div>
                            <button onClick={() => deleteGaso(index)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Ventilacao mecanica
                  </p>
                  <div className="grid gap-2 grid-cols-3 xl:grid-cols-6">
                    <FieldShell label="Modo ventilatorio" span="xl:col-span-2">
                      <select className={INPUT_CLASS_SM} value={currentRecord.modoVM} onChange={(event) => setField('modoVM', event.target.value)}>
                        {VM_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FieldShell>
                  </div>

                  {/* ── VCV / PRVC ── */}
                  {(currentRecord.modoVM === 'VCV' || currentRecord.modoVM === 'PRVC') && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="VT (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vt} onChange={(e) => setField('vt', e.target.value)} placeholder="450" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="10" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Fluxo (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fluxo} onChange={(e) => setField('fluxo', e.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="1.0" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="P. Pico">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ppico} onChange={(e) => setField('ppico', e.target.value)} placeholder="28" />
                        </FieldShell>
                        <FieldShell label="P. Plato">
                          <input className={INPUT_CLASS_SM} value={currentRecord.pplato} onChange={(e) => setField('pplato', e.target.value)} placeholder="25" />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── PCV ── */}
                  {currentRecord.modoVM === 'PCV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PC (cmH2O)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ppico} onChange={(e) => setField('ppico', e.target.value)} placeholder="20" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="10" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="P. Pico">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ppico} onChange={(e) => setField('ppico', e.target.value)} placeholder="28" />
                        </FieldShell>
                        <FieldShell label="P. Plato">
                          <input className={INPUT_CLASS_SM} value={currentRecord.pplato} onChange={(e) => setField('pplato', e.target.value)} placeholder="22" />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── PSV ── */}
                  {currentRecord.modoVM === 'PSV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PS (cmH2O)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ps} onChange={(e) => setField('ps', e.target.value)} placeholder="10" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:3" />
                        </FieldShell>
                        <FieldShell label="P0.1">
                          <input className={INPUT_CLASS_SM} value={currentRecord.p01} onChange={(e) => setField('p01', e.target.value)} placeholder="2.2" />
                        </FieldShell>
                        <FieldShell label="Pocc">
                          <input className={INPUT_CLASS_SM} value={currentRecord.pocc} onChange={(e) => setField('pocc', e.target.value)} placeholder="8" />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── Tubo-T ── */}
                  {currentRecord.modoVM === 'TuboT' && (
                    <div className="mt-4">
                      <FieldShell label="Observacoes Tubo-T" span="col-span-full">
                        <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Tempo, tolerancia, SatO2, FR..." />
                      </FieldShell>
                    </div>
                  )}

                  {/* ── CPAP ── */}
                  {currentRecord.modoVM === 'CPAP' && (
                    <div className="mt-4">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="CPAP / PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Interface">
                          <select className={INPUT_CLASS_SM} value={currentRecord.interfaceVNI} onChange={(e) => setField('interfaceVNI', e.target.value)}>
                            <option value="facial">Facial</option>
                            <option value="oronasal">Oronasal</option>
                            <option value="nasal">Nasal</option>
                            <option value="fullface">Full Face</option>
                            <option value="helmet">Helmet</option>
                          </select>
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── BIPAP ── */}
                  {currentRecord.modoVM === 'BIPAP' && (
                    <div className="mt-4">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="IPAP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ipap} onChange={(e) => setField('ipap', e.target.value)} placeholder="15" />
                        </FieldShell>
                        <FieldShell label="EPAP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.epap} onChange={(e) => setField('epap', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Interface">
                          <select className={INPUT_CLASS_SM} value={currentRecord.interfaceVNI} onChange={(e) => setField('interfaceVNI', e.target.value)}>
                            <option value="facial">Facial</option>
                            <option value="oronasal">Oronasal</option>
                            <option value="nasal">Nasal</option>
                            <option value="fullface">Full Face</option>
                            <option value="helmet">Helmet</option>
                          </select>
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── APRV ── */}
                  {currentRecord.modoVM === 'APRV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="P-High (cmH2O)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ppico} onChange={(e) => setField('ppico', e.target.value)} placeholder="28" />
                        </FieldShell>
                        <FieldShell label="T-High (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="4.5" />
                        </FieldShell>
                        <FieldShell label="P-Low (cmH2O)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="0" />
                        </FieldShell>
                        <FieldShell label="T-Low (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="0.5" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="60" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-2">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── VS / ASV / IntelliVENT ── */}
                  {(currentRecord.modoVM === 'VS' || currentRecord.modoVM === 'ASV' || currentRecord.modoVM === 'IntelliVENT') && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-3">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── SmartCare/PS ── */}
                  {currentRecord.modoVM === 'SmartCare' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                      </div>
                      <FieldShell label="Observacoes" span="col-span-full">
                        <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                      </FieldShell>
                    </div>
                  )}

                  {/* ── PAV+ ── */}
                  {currentRecord.modoVM === 'PAV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="% Suporte">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ps} onChange={(e) => setField('ps', e.target.value)} placeholder="70" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="WOB (J/L)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.wob ?? ''} onChange={(e) => setField('wob', e.target.value)} placeholder="0.8" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-3">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── NAVA ── */}
                  {currentRecord.modoVM === 'NAVA' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PS / NAVA level">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ps} onChange={(e) => setField('ps', e.target.value)} placeholder="2.0" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="Trigger (μV)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="0.5" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-4">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── HFOV ── */}
                  {currentRecord.modoVM === 'HFOV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="mPaw (cmH2O)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ppico} onChange={(e) => setField('ppico', e.target.value)} placeholder="30" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="ΔP amplitude">
                          <input className={INPUT_CLASS_SM} value={currentRecord.pplato} onChange={(e) => setField('pplato', e.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="Hz">
                          <input className={INPUT_CLASS_SM} value={currentRecord.hfovHz ?? ''} onChange={(e) => setField('hfovHz', e.target.value)} placeholder="5" />
                        </FieldShell>
                        <FieldShell label="TI (%)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="33" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="off" />
                        </FieldShell>
                        <FieldShell label="Bias Flow (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.hfovBiasFlow ?? ''} onChange={(e) => setField('hfovBiasFlow', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-3">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
                    </div>
                  )}

                  {/* ── MMV ── */}
                  {currentRecord.modoVM === 'MMV' && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-5">
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.vc} onChange={(e) => setField('vc', e.target.value)} placeholder="420" />
                        </FieldShell>
                        <FieldShell label="VE (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ve} onChange={(e) => setField('ve', e.target.value)} placeholder={calculations?.minuteVentilation ? `${calculations.minuteVentilation.toFixed(1)} (auto)` : '8'} />
                        </FieldShell>
                        <FieldShell label="Fluxo (L/min)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fluxo} onChange={(e) => setField('fluxo', e.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fr} onChange={(e) => setField('fr', e.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="I:E">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ie} onChange={(e) => setField('ie', e.target.value)} placeholder="1:2" />
                        </FieldShell>
                      </div>
                      <div className="grid gap-3 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="Trigger">
                          <input className={INPUT_CLASS_SM} value={currentRecord.trigger} onChange={(e) => setField('trigger', e.target.value)} placeholder="-2" />
                        </FieldShell>
                        <FieldShell label="TI (s)">
                          <input className={INPUT_CLASS_SM} value={currentRecord.ti} onChange={(e) => setField('ti', e.target.value)} placeholder="1.0" />
                        </FieldShell>
                        <FieldShell label="PEEP">
                          <input className={INPUT_CLASS_SM} value={currentRecord.peep} onChange={(e) => setField('peep', e.target.value)} placeholder="8" />
                        </FieldShell>
                        <FieldShell label="FiO2">
                          <input className={INPUT_CLASS_SM} value={currentRecord.fio2} onChange={(e) => setField('fio2', e.target.value)} placeholder="40" />
                        </FieldShell>
                        <FieldShell label="Observacoes" span="xl:col-span-2">
                          <AutoGrowTextarea value={currentRecord.vmObs ?? ''} onChange={(v) => setField('vmObs', v)} placeholder="Obs..." />
                        </FieldShell>
                      </div>
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

                {/* ── Analysis chips — volume modes (VCV, PRVC, HFOV, MMV) ── */}
                {/* ── Analysis chips — volume modes (VCV, PRVC) ── */}
                {respModeType === 'volume' && (
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    {calculations?.dp != null && (
                      <MetricChip label="DP (Driving Pressure)" value={`${calculations.dp.toFixed(1)} cmH2O`} hint={calculations.dp > 15 ? 'ALTO — risco de VILI' : 'Adequado'} color={calculations.dp > 15 ? 'red' : 'green'} />
                    )}
                    {calculations?.cest != null && (
                      <MetricChip label="Cest (complacencia)" value={`${calculations.cest.toFixed(1)} mL/cmH2O`} hint="Complacencia estatica" />
                    )}
                    {calculations?.cdyn != null && (
                      <MetricChip label="Cdyn (complacencia din.)" value={`${calculations.cdyn.toFixed(1)} mL/cmH2O`} hint="Complacencia dinamica" />
                    )}
                    {calculations?.raw != null && (
                      <MetricChip label="Raw (resistencia)" value={`${calculations.raw.toFixed(1)} cmH2O/L/s`} hint="Resistencia de via aerea" />
                    )}
                    {currentRecord.ppico && (
                      <MetricChip label="P. Pico" value={`${currentRecord.ppico} cmH2O`} hint={Number(currentRecord.ppico) > 40 ? 'ALTO' : 'OK'} color={Number(currentRecord.ppico) > 40 ? 'red' : undefined} />
                    )}
                    {currentRecord.pplato && (
                      <MetricChip label="P. Plato" value={`${currentRecord.pplato} cmH2O`} hint={Number(currentRecord.pplato) > 30 ? 'ALTO' : 'OK'} color={Number(currentRecord.pplato) > 30 ? 'red' : undefined} />
                    )}
                    {calculations?.mechanicalPower != null && (
                      <MetricChip label="Mechanical Power" value={`${calculations.mechanicalPower.toFixed(1)} J/min`} hint={calculations.mechanicalPower > 17 ? 'ALTO — risco de VILI' : 'Adequado'} color={calculations.mechanicalPower > 17 ? 'red' : 'green'} />
                    )}
                  </div>
                )}

                {/* ── Analysis chips — pressure modes (PCV) ── */}
                {respModeType === 'pressure' && (
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    {calculations?.dp != null && (
                      <MetricChip label="DP (Driving Pressure)" value={`${calculations.dp.toFixed(1)} cmH2O`} hint={calculations.dp > 15 ? 'ALTO — risco de VILI' : 'Adequado'} color={calculations.dp > 15 ? 'red' : 'green'} />
                    )}
                    {calculations?.cdyn != null && (
                      <MetricChip label="Cdyn (complacencia din.)" value={`${calculations.cdyn.toFixed(1)} mL/cmH2O`} hint="Complacencia dinamica" />
                    )}
                    {calculations?.mechanicalPower != null && (
                      <MetricChip label="Mechanical Power" value={`${calculations.mechanicalPower.toFixed(1)} J/min`} hint={calculations.mechanicalPower > 17 ? 'ALTO — risco de VILI' : 'Adequado'} color={calculations.mechanicalPower > 17 ? 'red' : 'green'} />
                    )}
                  </div>
                )}

                {/* ── Analysis chips — spontaneous modes (PSV) ── */}
                {respModeType === 'spontaneous' && currentRecord.modoVM !== 'TuboT' && currentRecord.modoVM !== 'CPAP' && currentRecord.modoVM !== 'BIPAP' && (
                  <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                    {calculations?.rsbi != null && (
                      <MetricChip label="RSBI" value={calculations.rsbi.toFixed(1)} hint={calculations.rsbiInterp?.t} color={calculations.rsbiInterp?.c} />
                    )}
                    {(currentRecord.p01 || currentRecord.pocc) && (
                      <MetricChip
                        label="P0.1 / Pocc"
                        value={`${currentRecord.p01 || '--'} / ${currentRecord.pocc || '--'}`}
                        hint={calculations?.p01Interp?.t || calculations?.poccInterp?.t}
                        color={calculations?.p01Interp?.c || calculations?.poccInterp?.c}
                      />
                    )}
                    {calculations?.pmusc != null && (
                      <MetricChip label="Pmusc" value={calculations.pmusc.toFixed(1)} hint={calculations.pmuscInterp?.t} color={calculations.pmuscInterp?.c} />
                    )}
                  </div>
                )}

                {currentRecord.vmHist?.length ? (
                  <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Historico VM · {currentRecord.vmHist.length}
                    </p>
                    {currentRecord.vmHist.length >= 2 && (() => {
                      const insights = analyzeVMTrend(currentRecord.vmHist)
                      if (!insights.length) return null
                      return (
                        <div className="mb-3 rounded-[1rem] border border-white/10 bg-black/22 p-3 space-y-1">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/36 mb-1.5">Evolução ventilatória</p>
                          {insights.map((ins, i) => (
                            <p key={i} className="text-[11px] leading-snug" style={{ color: ins.color }}>{ins.text}</p>
                          ))}
                        </div>
                      )
                    })()}
                    <div className="space-y-2">
                      {currentRecord.vmHist.map((entry, index) => {
                        // Build params list showing only filled values
                        const params: Array<{ label: string; value: string; color?: string }> = []
                        if (entry.vt) params.push({ label: 'VT', value: `${entry.vt} mL` })
                        if (entry.vc) params.push({ label: 'VC', value: `${entry.vc} mL` })
                        if (entry.ve) params.push({ label: 'VE', value: `${entry.ve} L/min` })
                        if (entry.fr) params.push({ label: 'FR', value: entry.fr })
                        if (entry.peep) params.push({ label: 'PEEP', value: entry.peep })
                        if (entry.fio2) params.push({ label: 'FiO2', value: `${entry.fio2}%` })
                        if (entry.ps) params.push({ label: 'PS', value: `${entry.ps} cmH₂O` })
                        if (entry.fluxo) params.push({ label: 'Fluxo', value: `${entry.fluxo} L/min` })
                        if (entry.trigger) params.push({ label: 'Trigger', value: entry.trigger })
                        if (entry.ti) params.push({ label: 'TI', value: `${entry.ti}s` })
                        if (entry.ie) params.push({ label: 'I:E', value: entry.ie })
                        if (entry.ppico) params.push({ label: 'Ppico', value: `${entry.ppico} cmH₂O` })
                        if (entry.pplato) params.push({ label: 'Pplatô', value: `${entry.pplato} cmH₂O` })
                        if (entry.pmean) params.push({ label: 'Pmean', value: `${entry.pmean} cmH₂O` })
                        if (entry.p01) params.push({ label: 'P0.1', value: entry.p01 })
                        if (entry.pocc) params.push({ label: 'Pocc', value: entry.pocc })
                        if (entry.ipap) params.push({ label: 'IPAP', value: entry.ipap })
                        if (entry.epap) params.push({ label: 'EPAP', value: entry.epap })

                        const calcs: Array<{ label: string; value: string; color?: string }> = []
                        if (entry.dp) { const v = parseFloat(entry.dp); calcs.push({ label: 'DP', value: `${entry.dp}`, color: v > 15 ? '#f87171' : '#4ade80' }) }
                        if (entry.cest) calcs.push({ label: 'Cest', value: entry.cest })
                        if (entry.raw) calcs.push({ label: 'Raw', value: entry.raw })
                        if (entry.pmusc) calcs.push({ label: 'Pmusc', value: entry.pmusc })

                        return (
                          <div key={`${entry.ts}-${index}`} className="rounded-[1rem] border border-white/10 bg-black/18 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold text-white/86">
                                  {entry.modo || 'Sem modo'} · {formatDateTime(entry.ts)}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                  {params.map((p, pi) => (
                                    <span key={pi} className="text-[10px] text-white/50">
                                      <span className="text-white/30">{p.label}</span> {p.value}
                                    </span>
                                  ))}
                                </div>
                                {calcs.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                    {calcs.map((c, ci) => (
                                      <span key={ci} className="text-[10px]" style={{ color: c.color || 'rgba(255,255,255,0.36)' }}>
                                        <span className="text-white/30">{c.label}</span> {c.value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button onClick={() => deleteVM(index)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <button
                    type="button"
                    onClick={() => setCollapsedPeep((v) => !v)}
                    className="flex w-full items-center justify-between gap-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Otimizacao de PEEP / stress index
                    </p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 shrink-0 text-white/30 transition-transform" style={{ transform: collapsedPeep ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  {!collapsedPeep && (
                    <>
                      <div className="mt-3 grid gap-2 xl:grid-cols-3">
                        {peepRows.map((row, index) => (
                          <div key={`peep-row-${index}`} className="rounded-[1rem] border border-white/10 bg-black/18 p-2.5">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/36">Nivel {index + 1}</p>
                              <button
                                type="button"
                                onClick={() => { setPeepOptField(index, 'peep', ''); setPeepOptField(index, 'plato', ''); setPeepOptField(index, 'si', '') }}
                                className="flex h-5 w-5 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <div className="grid gap-2 grid-cols-3">
                              <FieldShell label="PEEP">
                                <input className={INPUT_CLASS_SM} type="number" value={row.peep} onChange={(event) => setPeepOptField(index, 'peep', event.target.value)} placeholder="10" />
                              </FieldShell>
                              <FieldShell label="Plato">
                                <input className={INPUT_CLASS_SM} type="number" value={row.plato} onChange={(event) => setPeepOptField(index, 'plato', event.target.value)} placeholder="22" />
                              </FieldShell>
                              <FieldShell label="SI">
                                <input className={INPUT_CLASS_SM} value={row.si} onChange={(event) => setPeepOptField(index, 'si', event.target.value)} placeholder="=1" />
                              </FieldShell>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-2 grid-cols-2">
                        <MetricChip
                          label="Melhor combinacao"
                          value={calculations?.peepOptBest ? `Nivel ${calculations.peepOptBest.index + 1}` : '--'}
                          hint={calculations?.peepOptBest ? `PEEP ${calculations.peepOptBest.peep} · ΔP ${calculations.peepOptBest.dp.toFixed(1)} · SI ${calculations.peepOptBest.stressIndex.toFixed(2)}` : 'Preencha ao menos um nivel'}
                          color={calculations?.peepOptBest ? '#60a5fa' : undefined}
                        />
                        <MetricChip label="Leitura" value={calculations?.peepOptBest ? 'Config. sugerida' : '--'} hint="SI proximo de 1.0 com menor DP" />
                      </div>
                    </>
                  )}
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">Analise de curvas e loops</p>
                    <button
                      type="button"
                      onClick={() => updateCurrentRecord((r) => ({ ...r, curvaPxT: [], curvaFxT: [], curvaVxT: [], loopPV: [], loopFV: [], assincronia: [] }))}
                      className="inline-flex items-center gap-1 rounded-[0.7rem] border border-[#f8717130] bg-[#f8717110] px-2 py-1 text-[9px] font-semibold text-[#fca5a5]"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                      Limpar
                    </button>
                  </div>
                  <div className="grid gap-2 grid-cols-3">
                    {renderRespSelectionField('P×T', 'curvaPxT', CURVE_PXT_OPTIONS, 'PXT')}
                    {renderRespSelectionField('F×T', 'curvaFxT', CURVE_FXT_OPTIONS, 'FXT')}
                    {renderRespSelectionField('V×T', 'curvaVxT', CURVE_VXT_OPTIONS, 'VXT')}
                  </div>
                  <div className="mt-2 grid gap-2 grid-cols-3">
                    {renderRespSelectionField('Loop P-V', 'loopPV', LOOP_PV_OPTIONS, 'LPV')}
                    {renderRespSelectionField('Loop F-V', 'loopFV', LOOP_FV_OPTIONS, 'LFV')}
                    {renderRespSelectionField('Assinc.', 'assincronia', ASSINCRONIA_OPTIONS, 'ASY')}
                  </div>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setCollapsedDesmame((v) => !v)}
                      className="flex flex-1 items-center justify-between gap-2"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">Calculadora de desmame</p>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 shrink-0 text-white/30 transition-transform" style={{ transform: collapsedDesmame ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); updateCurrentRecord((r) => ({ ...r, dPimax: '', dPemax: '', dVcDesm: '', dFrDesm: '', dCv: '', weanTRETipo: '', weanObs: '' })) }}
                      className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {!collapsedDesmame && (
                    <>
                      <div className="mt-3 grid gap-2 grid-cols-3 xl:grid-cols-6">
                        <FieldShell label="PImax">
                          <input className={INPUT_CLASS_SM} type="number" value={currentRecord.dPimax} onChange={(event) => setField('dPimax', event.target.value)} placeholder="-40" />
                        </FieldShell>
                        <FieldShell label="PEmax">
                          <input className={INPUT_CLASS_SM} type="number" value={currentRecord.dPemax} onChange={(event) => setField('dPemax', event.target.value)} placeholder="60" />
                        </FieldShell>
                        <FieldShell label="VC (mL)">
                          <input className={INPUT_CLASS_SM} type="number" value={currentRecord.dVcDesm} onChange={(event) => setField('dVcDesm', event.target.value)} placeholder="450" />
                        </FieldShell>
                        <FieldShell label="FR">
                          <input className={INPUT_CLASS_SM} type="number" value={currentRecord.dFrDesm} onChange={(event) => setField('dFrDesm', event.target.value)} placeholder="18" />
                        </FieldShell>
                        <FieldShell label="CV (mL/kg)">
                          <input className={INPUT_CLASS_SM} type="number" value={currentRecord.dCv} onChange={(event) => setField('dCv', event.target.value)} placeholder="15" />
                        </FieldShell>
                        <FieldShell label="TRE">
                          <select className={INPUT_CLASS_SM} value={currentRecord.weanTRETipo} onChange={(event) => setField('weanTRETipo', event.target.value)}>
                            {TRE_TYPE_OPTIONS.map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </FieldShell>
                      </div>

                      <div className="mt-2">
                        <FieldShell label="Obs. desmame">
                          <AutoGrowTextarea value={currentRecord.weanObs} onChange={(value) => setField('weanObs', value)} placeholder="TRE, tolerancia, fadiga, tosse, secrecao..." />
                        </FieldShell>
                      </div>

                      <div className="mt-3 grid gap-2 grid-cols-2 xl:grid-cols-5">
                        <MetricChip label="RSBI" value={calculations?.weanRsbi ? calculations.weanRsbi.toFixed(1) : '--'} hint={calculations?.weanSummary?.text} color={calculations?.weanSummary?.color} />
                        <MetricChip label="PImax" value={currentRecord.dPimax || '--'} hint={calculations?.pimaxAdequate ? 'Adequado' : 'Vigiar'} color={calculations?.pimaxAdequate ? '#4ade80' : '#facc15'} />
                        <MetricChip label="PEmax" value={currentRecord.dPemax || '--'} hint={calculations?.pemaxAdequate ? 'Adequado' : 'Tosse limitada'} color={calculations?.pemaxAdequate ? '#4ade80' : '#facc15'} />
                        <MetricChip label="CV" value={currentRecord.dCv || '--'} hint={calculations?.cvAdequate ? 'Reserva adequada' : 'Em vigilancia'} color={calculations?.cvAdequate ? '#4ade80' : '#facc15'} />
                        <MetricChip label="VM" value={calculations?.weanMinuteVentilation ? `${calculations.weanMinuteVentilation.toFixed(1)} L/min` : '--'} hint="VC × FR" />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={saveDesmame} className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">
                          <Save className="h-4 w-4" />
                          Salvar Desmame
                        </button>
                      </div>

                      {currentRecord.desmHist?.length ? (
                        <div className="mt-3">
                          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/36">Historico · {currentRecord.desmHist.length}</p>
                          <div className="space-y-1.5">
                            {currentRecord.desmHist.map((entry, i) => (
                              <div key={`desm-${i}`} className="rounded-[0.8rem] border border-white/10 bg-black/18 p-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[9px] text-white/40">{formatDateTime(entry.ts)}</p>
                                    <p className="mt-0.5 text-[10px] text-white/60">PImax {entry.pimax || '--'} · PEmax {entry.pemax || '--'} · VC {entry.vc || '--'} · FR {entry.fr || '--'} · RSBI {entry.rsbi || '--'}</p>
                                    {entry.analise ? <p className="mt-0.5 text-[9px] font-semibold" style={{ color: calculations?.weanSummary?.color || '#60a5fa' }}>{entry.analise}</p> : null}
                                  </div>
                                  <button onClick={() => deleteDesmame(i)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                {(() => {
                  const isTOT = currentRecord.tipoVia === 'TOT' || currentRecord.tipoVia === 'TNT' || currentRecord.tipoVia === 'ML'
                  const isTQT = currentRecord.tipoVia?.startsWith('TQT')
                  // ── Auto-detect from events ──
                  // Se preencheu data de extubação → extubação ativa automaticamente
                  const extFromEvent = !!(currentRecord.dataExtubacao && currentRecord.horaExtubacao)
                  // Se preencheu data desc VM → desconexão ativa automaticamente
                  const descFromEvent = !!(currentRecord.dataDescVM && currentRecord.horaDescVM)

                  const treActive = currentRecord.treOK === '1'
                  const extActive = currentRecord.extOK === '1' || extFromEvent
                  const descActive = currentRecord.descVMOK === '1' || descFromEvent

                  // ── Intelligent phase detection ──────────────────────────────
                  const isControlled = ['VCV', 'PCV', 'PRVC', 'MMV', 'HFOV'].includes(currentRecord.modoVM)
                  const isPSV = currentRecord.modoVM === 'PSV'
                  const psVal = isPSV ? parseFloat(currentRecord.ps || '99') : 99
                  const psvLow = isPSV && psVal <= 10          // PS <= 10 → sugerir TRE
                  const psvTRE = isPSV && psVal <= 7           // PS <= 7 → já está em TRE
                  const rsbiGood = (calculations?.rsbi ?? 999) < 105
                  const suggestTRE = psvLow && rsbiGood

                  // active phase: 4 > 3 > 2 > 1
                  // PS ≤ 7 automaticamente detecta TRE (fase 3)
                  const activePhase = (extActive || descActive) ? 4
                    : (treActive || psvTRE) ? 3
                    : isPSV ? 2
                    : isControlled ? 1
                    : 0

                  let tipoDesmame = 'Simples'; let corDesm = '#4ade80'
                  if (treActive && currentRecord.treDt && currentRecord.dataTOT) {
                    const dias = Math.floor((new Date(currentRecord.treDt).getTime() - new Date(currentRecord.dataTOT).getTime()) / 86400000)
                    if (dias > 14) { tipoDesmame = 'Prolongado'; corDesm = '#f87171' }
                    else if (dias > 7) { tipoDesmame = 'Dificil'; corDesm = '#facc15' }
                  }

                  const phaseColor = (p: number) => {
                    if (activePhase === p) return '#60a5fa'
                    if (activePhase > p) return '#4ade80'
                    return undefined
                  }
                  const phaseDone = (p: number) => activePhase > p

                  return (
                    <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                      {/* Header */}
                      <div className="mb-3 flex items-center justify-center gap-2 flex-wrap">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">Parametros de Desmame</p>
                        {treActive && currentRecord.treDt ? (
                          <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ color: corDesm, borderColor: `${corDesm}30`, background: `${corDesm}12` }}>
                            {tipoDesmame}
                          </span>
                        ) : null}
                        {activePhase === 3 && psvTRE && !treActive && (
                          <span className="rounded-full border border-[#60a5fa40] bg-[#60a5fa12] px-2 py-0.5 text-[9px] font-bold text-[#60a5fa]">
                            PS ≤ 7 — TRE detectado
                          </span>
                        )}
                        {activePhase === 2 && psvLow && !psvTRE && (
                          <span className="rounded-full border border-[#facc1540] bg-[#facc1512] px-2 py-0.5 text-[9px] font-bold text-[#facc15]">
                            PS baixa — avaliar TRE
                          </span>
                        )}
                        {activePhase === 2 && suggestTRE && (
                          <span className="rounded-full border border-[#4ade8040] bg-[#4ade8012] px-2 py-0.5 text-[9px] font-bold text-[#4ade80]">
                            ✓ Pronto para TRE
                          </span>
                        )}
                        {activePhase === 4 && extFromEvent && (
                          <span className="rounded-full border border-[#4ade8040] bg-[#4ade8012] px-2 py-0.5 text-[9px] font-bold text-[#4ade80]">
                            ✓ Extubado
                          </span>
                        )}
                        {activePhase === 4 && descFromEvent && (
                          <span className="rounded-full border border-[#4ade8040] bg-[#4ade8012] px-2 py-0.5 text-[9px] font-bold text-[#4ade80]">
                            ✓ Desconectado VM
                          </span>
                        )}
                      </div>

                      {/* Phase flow */}
                      <div className="mb-3 flex items-center justify-center gap-1.5 flex-wrap">
                        {([
                          [1, '① VCV/PCV'],
                          [2, '② PSV'],
                          [3, '③ TRE'],
                          [4, '④ ' + (isTQT ? 'Desconexao' : 'Extubacao')],
                        ] as [number, string][]).map(([p, label]) => {
                          const col = phaseColor(p)
                          const done = phaseDone(p)
                          // Phase 3 (TRE) is clickable to toggle
                          const isTREPhase = p === 3
                          return (
                            <div key={p} className="flex items-center gap-1.5">
                              {isTREPhase ? (
                                <button
                                  type="button"
                                  onClick={() => setField('treOK', treActive ? '' : '1')}
                                  className="rounded-[0.5rem] border px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer"
                                  style={col
                                    ? { color: col, borderColor: `${col}40`, background: `${col}12` }
                                    : { color: 'rgba(255,255,255,0.28)', borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }
                                  }
                                >
                                  {done ? '✓ ' : ''}{label}
                                </button>
                              ) : (
                                <span
                                  className="rounded-[0.5rem] border px-2 py-0.5 text-[10px] font-semibold transition-all"
                                  style={col
                                    ? { color: col, borderColor: `${col}40`, background: `${col}12` }
                                    : { color: 'rgba(255,255,255,0.28)', borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }
                                  }
                                >
                                  {done ? '✓ ' : ''}{label}
                                </span>
                              )}
                              {p < 4 ? <span className="text-[9px] text-white/18">→</span> : null}
                            </div>
                          )
                        })}
                      </div>

                      {/* Phase 2 — PSV guidance */}
                      {activePhase === 2 && (
                        <div className="mb-3 rounded-[0.8rem] border border-[#60a5fa20] bg-[#60a5fa08] p-2.5 text-[10px] text-white/60 space-y-1">
                          <p className="font-semibold text-[#60a5fa]">PSV ativo — protocolo de reducao</p>
                          <div className="flex flex-wrap gap-3">
                            <span>PS atual: <strong className={psVal <= 10 ? 'text-[#4ade80]' : 'text-white/80'}>{currentRecord.ps || '--'} cmH₂O</strong></span>
                            {calculations?.rsbi != null && <span>RSBI: <strong className={rsbiGood ? 'text-[#4ade80]' : 'text-[#f87171]'}>{calculations.rsbi.toFixed(1)}</strong></span>}
                            <span className={psVal <= 8 ? 'text-[#4ade80]' : 'text-white/40'}>Alvo PS ≤ 8</span>
                            <span className={rsbiGood ? 'text-[#4ade80]' : 'text-white/40'}>RSBI &lt; 105</span>
                          </div>
                          {suggestTRE && (
                            <p className="font-semibold text-[#4ade80]">→ Criterios favoraveis: iniciar TRE</p>
                          )}
                        </div>
                      )}

                      {/* Ext / Desc action buttons */}
                      <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {isTOT && (
                          <button type="button" onClick={() => setField('extOK', extActive ? '' : '1')}
                            className="rounded-[0.8rem] border px-3 py-1.5 text-[10px] font-semibold"
                            style={extActive ? { background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.35)', color: '#60a5fa' } : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.50)' }}
                          >Extubacao</button>
                        )}
                        {isTQT && (
                          <button type="button" onClick={() => setField('descVMOK', descActive ? '' : '1')}
                            className="rounded-[0.8rem] border px-3 py-1.5 text-[10px] font-semibold"
                            style={descActive ? { background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.35)', color: '#60a5fa' } : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.50)' }}
                          >Desconexao VM</button>
                        )}
                      </div>

                      {/* TRE date/time */}
                      {treActive && (
                        <div className="mb-3 grid gap-2 grid-cols-2">
                          <FieldShell label="Data TRE">
                            <input className={INPUT_CLASS_SM} type="date" value={currentRecord.treDt} onChange={(e) => setField('treDt', e.target.value)} />
                          </FieldShell>
                          <FieldShell label="Hora TRE">
                            <input className={INPUT_CLASS_SM} type="time" value={currentRecord.treTm} onChange={(e) => setField('treTm', e.target.value)} />
                          </FieldShell>
                        </div>
                      )}

                      {/* Extubation result */}
                      {isTOT && extActive && (
                        <div className="mb-3">
                          <p className="mb-1 text-[9px] text-white/36">Resultado da Extubacao</p>
                          <div className="flex gap-2">
                            {(['Sucesso', 'Falha'] as const).map((opt) => (
                              <button key={opt} type="button" onClick={() => setField('extResult', opt)}
                                className="rounded-[0.7rem] border px-3 py-1 text-[10px] font-semibold"
                                style={currentRecord.extResult === opt ? (opt === 'Sucesso' ? { background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.35)', color: '#4ade80' } : { background: 'rgba(248,113,113,0.12)', borderColor: 'rgba(248,113,113,0.35)', color: '#f87171' }) : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disconnection result */}
                      {isTQT && descActive && (
                        <div className="mb-3">
                          <p className="mb-1 text-[9px] text-white/36">Resultado da Desconexao</p>
                          <div className="flex gap-2">
                            {(['Sucesso', 'Falha'] as const).map((opt) => (
                              <button key={opt} type="button" onClick={() => setField('descResult', opt)}
                                className="rounded-[0.7rem] border px-3 py-1 text-[10px] font-semibold"
                                style={currentRecord.descResult === opt ? (opt === 'Sucesso' ? { background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.35)', color: '#4ade80' } : { background: 'rgba(248,113,113,0.12)', borderColor: 'rgba(248,113,113,0.35)', color: '#f87171' }) : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )
                })()}

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                    Protocolo VM especifico
                  </p>
                  <div className="grid gap-1.5 grid-cols-2 xl:grid-cols-3">
                    {PROTOCOL_OPTIONS.map((protocol) => {
                      const selected = currentRecord.protocoloVM.includes(protocol.id)
                      return (
                        <button
                          key={protocol.id}
                          type="button"
                          onClick={() => toggleStringArrayField('protocoloVM', protocol.id)}
                          className="flex items-center gap-2 rounded-[0.8rem] border px-3 py-2 text-left transition-all"
                          style={{
                            borderColor: selected ? `${protocol.color}55` : 'rgba(255,255,255,0.08)',
                            background: selected ? `${protocol.color}12` : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <div
                            className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[0.25rem] border"
                            style={{ borderColor: selected ? protocol.color : 'rgba(255,255,255,0.18)' }}
                          >
                            {selected ? <div className="h-1.5 w-1.5 rounded-[0.1rem]" style={{ background: protocol.color }} /> : null}
                          </div>
                          <span className="text-[11px] font-medium text-white/76">{protocol.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {currentRecord.protocoloVM.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {currentRecord.protocoloVM.map((pid) => {
                        const proto = PROTOCOL_OPTIONS.find((p) => p.id === pid)
                        if (!proto) return null
                        const isOpen = expandedProtocols.has(pid)
                        return (
                          <div key={pid}>
                            <button
                              type="button"
                              onClick={() => setExpandedProtocols((prev) => { const next = new Set(prev); isOpen ? next.delete(pid) : next.add(pid); return next })}
                              className="flex w-full items-center gap-2 rounded-[1rem] border px-4 py-2.5 text-left"
                              style={{ borderColor: `${proto.color}30`, background: `${proto.color}08` }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke={proto.color} strokeWidth="2.5" className="h-3 w-3 shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                              <span className="text-[10px] font-bold" style={{ color: proto.color }}>{proto.label}</span>
                            </button>
                            {isOpen ? (
                              <div className="rounded-b-[1rem] border border-t-0 px-4 py-3" style={{ borderColor: `${proto.color}15`, background: `${proto.color}03` }}>
                                {getProtocolContent(pid)}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <button
                    type="button"
                    onClick={() => setCollapsedProna((v) => !v)}
                    className="flex w-full items-center justify-between gap-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">Prona / recrutabilidade</p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 shrink-0 text-white/30 transition-transform" style={{ transform: collapsedProna ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  {!collapsedProna && (
                    <>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setField('pronaAtiva', proneActive ? '' : '1')}
                          className="rounded-[0.8rem] border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                          style={{
                            borderColor: proneActive ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.12)',
                            background: proneActive ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                            color: proneActive ? '#86efac' : 'rgba(255,255,255,0.72)',
                          }}
                        >
                          {proneActive ? 'Prona ativa' : 'Iniciar prona'}
                        </button>
                        {proneActive && (
                          <button
                            type="button"
                            onClick={() => updateCurrentRecord((r) => ({ ...r, pronaAtiva: '', pronaTempo: '', pronaData: '', pronaHora: '' }))}
                            className="inline-flex items-center gap-1 rounded-[0.8rem] border border-[#f8717130] bg-[#f8717110] px-3 py-1.5 text-[10px] font-semibold text-[#fca5a5]"
                          >
                            <Trash2 className="h-3 w-3" />
                            Limpar Prona
                          </button>
                        )}
                      </div>

                      {proneActive && (
                        <div className="mt-2 grid gap-2 grid-cols-3">
                          <FieldShell label="Tempo prona">
                            <select className={INPUT_CLASS_SM} value={currentRecord.pronaTempo} onChange={(event) => setField('pronaTempo', event.target.value)}>
                              {PRONA_TIME_OPTIONS.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                          </FieldShell>
                          <FieldShell label="Data inicio">
                            <input className={INPUT_CLASS_SM} type="date" value={currentRecord.pronaData} onChange={(event) => setField('pronaData', event.target.value)} />
                          </FieldShell>
                          <FieldShell label="Hora inicio">
                            <input className={INPUT_CLASS_SM} type="time" value={currentRecord.pronaHora} onChange={(event) => setField('pronaHora', event.target.value)} />
                          </FieldShell>
                        </div>
                      )}

                      {calculations?.proneSupineAt && (
                        <div className="mt-2">
                          <MetricChip label="Supinar em" value={formatDateTime(calculations.proneSupineAt.toISOString())} hint="Previsao automatica" color="#a78bfa" />
                        </div>
                      )}

                      {proneActive && (
                        <div className="mt-2">
                          <button onClick={saveProna} className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">
                            <Save className="h-4 w-4" />
                            Salvar Prona
                          </button>
                        </div>
                      )}

                      {currentRecord.pronaHist?.length ? (
                        <div className="mt-2 space-y-1.5">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/36">Historico Prona</p>
                          {currentRecord.pronaHist.map((entry, i) => (
                            <div key={`prona-${i}`} className="flex items-center justify-between gap-2 rounded-[0.8rem] border border-white/10 bg-black/18 px-2.5 py-1.5">
                              <p className="text-[9px] text-white/50">
                                {formatDateTime(entry.ts)} · {entry.tempo || '--'} · {entry.dataInicio || '--'} {entry.horaInicio || ''}
                              </p>
                              <button onClick={() => deleteProna(i)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 border-t border-white/8 pt-4">
                        <p className="mb-1.5 text-[10px] font-bold text-[#fb923c]">Manobra de Recrutamento</p>
                        <p className="mb-2 text-[9px] leading-relaxed text-white/30">FiO₂ 100%, FR 10, ΔP 15 cmH₂O | PCV: PEEP +5 a cada 2min ate 25-45 cmH₂O | Apos: PEEP 25, calcular Cest, iniciar titulacao decremental.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[9px]">
                        <thead>
                          <tr className="bg-white/4">
                            {['PLATO','PEEP','ΔP','CEST','SAT','PAM','★'].map((h) => (
                              <th key={h} className="border border-white/8 px-1 py-1 text-center text-[8px] font-semibold text-white/44">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ensureMraRows(currentRecord.mraTab || []).map((row, ri) => {
                            const plato = parseFloat(row.plato); const peep = parseFloat(row.peep)
                            const dp = (!isNaN(plato) && !isNaN(peep)) ? (plato - peep).toFixed(0) : ''
                            return (
                              <tr key={ri} style={row.best ? { background: 'rgba(74,222,128,0.08)' } : {}}>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.plato} onChange={(e) => setMraField(ri, 'plato', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.peep} onChange={(e) => setMraField(ri, 'peep', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-1 py-0.5 text-center font-semibold" style={{ color: dp && parseFloat(dp) > 15 ? '#f87171' : '#4ade80' }}>{dp || ''}</td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.cest} onChange={(e) => setMraField(ri, 'cest', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.sat} onChange={(e) => setMraField(ri, 'sat', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.pam} onChange={(e) => setMraField(ri, 'pam', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-1 py-0.5 text-center">
                                  <button type="button" onClick={() => toggleMraBest(ri)} className="text-[11px]" style={{ color: row.best ? '#4ade80' : 'rgba(255,255,255,0.20)' }}>★</button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateCurrentRecord((r) => ({ ...r, mraTab: Array(8).fill(null).map(() => ({ plato: '', peep: '', cest: '', sat: '', pam: '', best: false })) }))}
                      className="mt-2 rounded-[0.8rem] border border-[#f8717130] bg-[#f8717110] px-3 py-1.5 text-[9px] font-semibold text-[#fca5a5]"
                    >
                      Limpar Tabela
                    </button>
                  </div>

                  <div className="mt-5 border-t border-white/8 pt-5">
                    <p className="mb-2 text-[10px] font-bold text-[#60a5fa]">Titulacao PEEP Decremental</p>
                    <p className="mb-3 text-[9px] leading-relaxed text-white/30">VCV, Onda Quadrada | PEEP 25: reduzir -2 cmH₂O a cada 4min | PEEP ideal: melhor Cest + 2 cmH₂O.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[9px]">
                        <thead>
                          <tr className="bg-white/4">
                            {['PICO','PLATO','PEEP','ΔP','CEST','SI','SAT','PAM','★'].map((h) => (
                              <th key={h} className="border border-white/8 px-1 py-1 text-center text-[8px] font-semibold text-white/44">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ensureTitRows(currentRecord.titTab || []).map((row, ti) => {
                            const plato = parseFloat(row.plato); const peep = parseFloat(row.peep)
                            const dp = (!isNaN(plato) && !isNaN(peep)) ? (plato - peep).toFixed(0) : ''
                            return (
                              <tr key={ti} style={row.best ? { background: 'rgba(74,222,128,0.08)' } : {}}>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.pico} onChange={(e) => setTitField(ti, 'pico', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.plato} onChange={(e) => setTitField(ti, 'plato', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.peep} onChange={(e) => setTitField(ti, 'peep', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-1 py-0.5 text-center font-semibold" style={{ color: dp && parseFloat(dp) > 15 ? '#f87171' : '#4ade80' }}>{dp || ''}</td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.cest} onChange={(e) => setTitField(ti, 'cest', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="text" value={row.si} onChange={(e) => setTitField(ti, 'si', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="=1" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.sat} onChange={(e) => setTitField(ti, 'sat', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-0.5 py-0.5"><input type="number" value={row.pam} onChange={(e) => setTitField(ti, 'pam', e.target.value)} className="w-full bg-transparent text-center text-[9px] text-white outline-none placeholder:text-white/20" placeholder="--" /></td>
                                <td className="border border-white/6 px-1 py-0.5 text-center">
                                  <button type="button" onClick={() => toggleTitBest(ti)} className="text-[11px]" style={{ color: row.best ? '#4ade80' : 'rgba(255,255,255,0.20)' }}>★</button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {(() => {
                      const bestTit = (currentRecord.titTab || []).find((r) => r.best)
                      if (bestTit?.peep) {
                        const peepIdeal = parseFloat(bestTit.peep) + 2
                        return (
                          <div className="mt-2 rounded-[0.8rem] border border-[#4ade8030] bg-[#4ade8008] px-3 py-2 text-[10px] font-semibold text-[#4ade80]">
                            PEEP Ideal: {peepIdeal} cmH₂O (melhor Cest {bestTit.cest} + 2)
                          </div>
                        )
                      }
                      return null
                    })()}
                    <button
                      type="button"
                      onClick={() => updateCurrentRecord((r) => ({ ...r, titTab: Array(10).fill(null).map(() => ({ pico: '', plato: '', peep: '', cest: '', si: '', sat: '', pam: '', best: false })) }))}
                      className="mt-2 rounded-[0.8rem] border border-[#f8717130] bg-[#f8717110] px-3 py-1.5 text-[9px] font-semibold text-[#fca5a5]"
                    >
                      Limpar Tabela
                    </button>
                  </div>

                      <div className="mt-4 border-t border-white/8 pt-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold text-[#a78bfa]">Recrutabilidade pulmonar</p>
                          <button
                            type="button"
                            onClick={() => updateCurrentRecord((r) => ({ ...r, recVolInsp: '', recVolExp: '' }))}
                            className="inline-flex items-center gap-1 rounded-[0.6rem] border border-[#f8717130] bg-[#f8717110] px-2 py-0.5 text-[9px] font-semibold text-[#fca5a5]"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                            Limpar
                          </button>
                        </div>
                        <div className="grid gap-2 grid-cols-2 xl:grid-cols-4">
                          <FieldShell label="Vol. insp. (mL)">
                            <input className={INPUT_CLASS_SM} type="number" value={currentRecord.recVolInsp} onChange={(event) => setField('recVolInsp', event.target.value)} placeholder="1200" />
                          </FieldShell>
                          <FieldShell label="Vol. exp. (mL)">
                            <input className={INPUT_CLASS_SM} type="number" value={currentRecord.recVolExp} onChange={(event) => setField('recVolExp', event.target.value)} placeholder="600" />
                          </FieldShell>
                          <MetricChip
                            label="Diferenca"
                            value={calculations?.recruitDiff !== null && calculations?.recruitDiff !== undefined ? `${calculations.recruitDiff.toFixed(0)} mL` : '--'}
                            hint="Vol. insp. - exp."
                          />
                          <MetricChip
                            label="Leitura"
                            value={calculations?.recruitSummary?.text || '--'}
                            hint="> 500 mL recrutavel"
                            color={calculations?.recruitSummary?.color}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === 'motora' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <FieldShell label="Avaliacao motora / funcional">
                    <AutoGrowTextarea
                      value={currentRecord.motora}
                      onChange={(value) => setField('motora', value)}
                      placeholder="Forca, mobilidade, barreiras, evolucao funcional..."
                    />
                  </FieldShell>
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">MRC</p>
                    <div className="flex items-center gap-2">
                      {calculations?.mrc && (
                        <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ color: calculations.mrc.color, borderColor: `${calculations.mrc.color}30`, background: `${calculations.mrc.color}12` }}>
                          {calculations.mrc.total}/60 · {calculations.mrc.text}
                        </span>
                      )}
                      {calculations?.mrc && (
                        <button type="button" onClick={saveMrc} title="Salvar avaliacao MRC" className="flex items-center gap-1 rounded-[0.6rem] border border-white/12 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-white/50 hover:text-white/80">
                          <Save className="h-2.5 w-2.5" />Salvar
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {MRC_GROUPS.map((group) => (
                      <div key={group.label} className="grid items-center gap-2 grid-cols-[1fr_auto_auto]">
                        <p className="text-[11px] text-white/65">{group.label}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-white/36 w-4 text-center">D</span>
                          <select className={INPUT_CLASS_SM} value={currentRecord[group.right]} onChange={(event) => setField(group.right, event.target.value)}>
                            <option value="">-</option>
                            {['0', '1', '2', '3', '4', '5'].map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-white/36 w-4 text-center">E</span>
                          <select className={INPUT_CLASS_SM} value={currentRecord[group.left]} onChange={(event) => setField(group.left, event.target.value)}>
                            <option value="">-</option>
                            {['0', '1', '2', '3', '4', '5'].map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(currentRecord.mrcHist?.length ?? 0) > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-white/8 pt-2.5">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Historico MRC</p>
                      {currentRecord.mrcHist!.map((entry, i) => {
                        const prev = currentRecord.mrcHist![i + 1]
                        const diff = prev != null ? entry.total - prev.total : null
                        return (
                          <div key={`mrc-h-${i}`} className="flex items-center justify-between gap-2 rounded-[0.8rem] border border-white/8 bg-black/15 px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-white/36">{formatDateTime(entry.ts)}</span>
                              <span className="rounded-full border px-1.5 py-0.5 text-[9px] font-bold" style={{ color: entry.total >= 48 ? '#4ade80' : entry.total >= 36 ? '#facc15' : '#f87171', borderColor: entry.total >= 48 ? '#4ade8030' : entry.total >= 36 ? '#facc1530' : '#f8717130', background: entry.total >= 48 ? '#4ade8010' : entry.total >= 36 ? '#facc1510' : '#f8717110' }}>
                                {entry.total}/60
                              </span>
                              {diff !== null && (
                                <span className={`text-[9px] font-semibold ${diff > 0 ? 'text-[#4ade80]' : diff < 0 ? 'text-[#f87171]' : 'text-white/36'}`}>
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              )}
                            </div>
                            <button type="button" onClick={() => deleteMrc(i)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">PERME</p>
                    <div className="flex items-center gap-2">
                      {calculations?.perme && (
                        <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ color: calculations.perme.color, borderColor: `${calculations.perme.color}30`, background: `${calculations.perme.color}12` }}>
                          {calculations.perme.total}/21 · {calculations.perme.text}
                        </span>
                      )}
                      {calculations?.perme && (
                        <button type="button" onClick={savePerme} title="Salvar avaliacao PERME" className="flex items-center gap-1 rounded-[0.6rem] border border-white/12 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-white/50 hover:text-white/80">
                          <Save className="h-2.5 w-2.5" />Salvar
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2 grid-cols-2 xl:grid-cols-4">
                    {PERME_ITEMS.map((item) => (
                      <FieldShell key={item.key} label={item.label}>
                        <select className={INPUT_CLASS_SM} value={currentRecord[item.key]} onChange={(event) => setField(item.key, event.target.value)}>
                          {item.options.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </FieldShell>
                    ))}
                  </div>
                  {(currentRecord.permeHist?.length ?? 0) > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-white/8 pt-2.5">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Historico PERME</p>
                      {currentRecord.permeHist!.map((entry, i) => {
                        const prev = currentRecord.permeHist![i + 1]
                        const diff = prev != null ? entry.total - prev.total : null
                        return (
                          <div key={`perme-h-${i}`} className="flex items-center justify-between gap-2 rounded-[0.8rem] border border-white/8 bg-black/15 px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-white/36">{formatDateTime(entry.ts)}</span>
                              <span className="rounded-full border px-1.5 py-0.5 text-[9px] font-bold" style={{ color: entry.total >= 15 ? '#4ade80' : entry.total >= 8 ? '#facc15' : '#f87171', borderColor: entry.total >= 15 ? '#4ade8030' : entry.total >= 8 ? '#facc1530' : '#f8717130', background: entry.total >= 15 ? '#4ade8010' : entry.total >= 8 ? '#facc1510' : '#f8717110' }}>
                                {entry.total}/21
                              </span>
                              {diff !== null && (
                                <span className={`text-[9px] font-semibold ${diff > 0 ? 'text-[#4ade80]' : diff < 0 ? 'text-[#f87171]' : 'text-white/36'}`}>
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              )}
                            </div>
                            <button type="button" onClick={() => deletePerme(i)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="chrome-panel rounded-[1.5rem] p-2.5 md:p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">IMS</p>
                    <div className="flex items-center gap-2">
                      {calculations?.ims && (
                        <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ color: calculations.ims.color, borderColor: `${calculations.ims.color}30`, background: `${calculations.ims.color}12` }}>
                          {calculations.ims.value}/10 · {calculations.ims.text}
                        </span>
                      )}
                      {currentRecord.imsScore && (
                        <button type="button" onClick={saveIms} title="Salvar avaliacao IMS" className="flex items-center gap-1 rounded-[0.6rem] border border-white/12 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-white/50 hover:text-white/80">
                          <Save className="h-2.5 w-2.5" />Salvar
                        </button>
                      )}
                    </div>
                  </div>
                  <FieldShell label="Score IMS">
                    <select className={INPUT_CLASS_SM} value={currentRecord.imsScore} onChange={(event) => setField('imsScore', event.target.value)}>
                      {IMS_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FieldShell>
                  {(currentRecord.imsHist?.length ?? 0) > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-white/8 pt-2.5">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Historico IMS</p>
                      {currentRecord.imsHist!.map((entry, i) => {
                        const prev = currentRecord.imsHist![i + 1]
                        const score = parseInt(entry.score)
                        const diff = prev != null ? score - parseInt(prev.score) : null
                        return (
                          <div key={`ims-h-${i}`} className="flex items-center justify-between gap-2 rounded-[0.8rem] border border-white/8 bg-black/15 px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-white/36">{formatDateTime(entry.ts)}</span>
                              <span className="rounded-full border px-1.5 py-0.5 text-[9px] font-bold" style={{ color: score >= 7 ? '#4ade80' : score >= 4 ? '#facc15' : '#f87171', borderColor: score >= 7 ? '#4ade8030' : score >= 4 ? '#facc1530' : '#f8717130', background: score >= 7 ? '#4ade8010' : score >= 4 ? '#facc1510' : '#f8717110' }}>
                                IMS {entry.score}/10
                              </span>
                              {diff !== null && (
                                <span className={`text-[9px] font-semibold ${diff > 0 ? 'text-[#4ade80]' : diff < 0 ? 'text-[#f87171]' : 'text-white/36'}`}>
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              )}
                            </div>
                            <button type="button" onClick={() => deleteIms(i)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] border border-[#f8717130] bg-[#f8717110] text-[#fca5a5]">
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === 'percepcao' ? (
              <div className="space-y-5">
                <div className="chrome-panel rounded-[1.5rem] p-3 md:p-5">
                  <div className="space-y-4">
                    <FieldShell label="Percepcao do plantao">
                      <AutoGrowTextarea
                        value={currentRecord.percepcao}
                        onChange={(value) => setField('percepcao', value)}
                        placeholder="Leitura global do turno..."
                      />
                    </FieldShell>
                    <FieldShell label="Pendencias">
                      <AutoGrowTextarea
                        value={currentRecord.pendencias}
                        onChange={(value) => setField('pendencias', value)}
                        placeholder="Pendencias, prioridades, exames..."
                      />
                    </FieldShell>
                    <FieldShell label="Condutas">
                      <AutoGrowTextarea
                        value={currentRecord.condutas}
                        onChange={(value) => setField('condutas', value)}
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
                      <p className="truncate text-[9px] font-semibold text-white/90">{recordTitle(record)}</p>
                      <p className="truncate text-[8px] text-white/48">{recordSubtitle(record)}</p>
                    </div>

                    {/* Badges afastados do nome */}
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      {cardStatus ? (
                        <span
                          className="rounded-full border px-1 py-px text-[6px] font-semibold uppercase tracking-[0.08em]"
                          style={{ borderColor: cardStatus.border, background: cardStatus.background, color: cardStatus.color }}
                        >
                          {cardStatus.label}
                        </span>
                      ) : null}
                      {cardVia ? (
                        <span
                          className="rounded-full border px-1 py-px text-[6px] font-semibold uppercase tracking-[0.08em]"
                          style={{ borderColor: cardVia.border, background: cardVia.background, color: cardVia.color }}
                        >
                          {cardVia.label}
                        </span>
                      ) : null}
                      {showDays ? (
                        <span
                          className="rounded-full border px-1 py-px text-[6px] font-semibold uppercase tracking-[0.08em]"
                          style={{ borderColor: `${showDays.color}40`, background: `${showDays.color}14`, color: showDays.color }}
                        >
                          {showDays.label}
                        </span>
                      ) : null}
                    </div>

                    {/* Botões ação */}
                    <div className="flex shrink-0 items-center gap-1.5">
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
