'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Brain,
  Calculator,
  ChevronDown,
  Gauge,
  HeartPulse,
  Layers3,
  Orbit,
  Radar,
  RotateCcw,
  ShieldAlert,
  Stethoscope,
  Waves,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import {
  analyzeGaso,
  calcAsynchronyIndex,
  calcCest,
  calcCdyn,
  calcCO2Gap,
  calcDP,
  calcGlasgow,
  calcHacorBase,
  calcMechanicalPower,
  calcMrcTotal,
  calcPeepOptimization,
  calcPermeTotal,
  calcPF,
  calcPmusc,
  calcPVCompliance,
  calcRecruitabilityByVolume,
  calcROX,
  calcRSBI,
  calcRaw,
  calcSF,
  calcSofaTotal,
  calcSuggestedPeepFromLip,
  calcUpdatedHacor,
  calcVcByWeight,
  calcVDVT,
  calcVentilatoryRatio,
  interpAsynchronyIndex,
  interpBE,
  interpCO2Gap,
  interpDP,
  interpIMS,
  interpMechanicalPower,
  interpMrc,
  interpP01,
  interpPF,
  interpPerme,
  interpPmusc,
  interpPocc,
  interpROX,
  interpRSBI,
  interpUpdatedHacor,
  interpVDVT,
  interpVentilatoryRatio,
  summarizeWeaningCriteria,
  toNumber,
} from '@/lib/vm-calcs'

type CardId =
  | 'hacor'
  | 'rox'
  | 'compliance'
  | 'peep'
  | 'recruit'
  | 'rsbi'
  | 'mpower'
  | 'vcweight'
  | 'drive'
  | 'wean'
  | 'gaso'
  | 'asynchrony'
  | 'glasgow'
  | 'mrc'
  | 'perme'
  | 'ims'

type HacorState = {
  fc: string
  ph: string
  gcs: string
  oxig: string
  fr: string
  dx: string
  sofaResp: string
  sofaCns: string
  sofaCardio: string
  sofaCoag: string
  sofaLiver: string
  sofaRenal: string
}

type PermeKey =
  | 'estado'
  | 'barreira'
  | 'forcaMs'
  | 'forcaMi'
  | 'leito'
  | 'transf'
  | 'marcha'

type MrcKey =
  | 'ombroD'
  | 'ombroE'
  | 'cotoveloD'
  | 'cotoveloE'
  | 'punhoD'
  | 'punhoE'
  | 'quadrilD'
  | 'quadrilE'
  | 'joelhoD'
  | 'joelhoE'
  | 'tornozeloD'
  | 'tornozeloE'

const HACOR_SELECTS = {
  fc: [
    { value: 'leq120', label: '<= 120 -> 0' },
    { value: 'ge121', label: '>= 121 -> +1' },
  ],
  ph: [
    { value: 'ge735', label: '>= 7,35 -> 0' },
    { value: '730_734', label: '7,30 a 7,34 -> +2' },
    { value: '725_729', label: '7,25 a 7,29 -> +3' },
    { value: 'lt725', label: '< 7,25 -> +4' },
  ],
  gcs: [
    { value: '15', label: '15 -> 0' },
    { value: '13_14', label: '13-14 -> +2' },
    { value: '11_12', label: '11-12 -> +5' },
    { value: 'le10', label: '<= 10 -> +10' },
  ],
  oxig: [
    { value: 'ge201', label: '>= 201 -> 0' },
    { value: '176_200', label: '176-200 -> +2' },
    { value: '151_175', label: '151-175 -> +3' },
    { value: '126_150', label: '126-150 -> +4' },
    { value: '101_125', label: '101-125 -> +5' },
    { value: 'le100', label: '<= 100 -> +6' },
  ],
  fr: [
    { value: 'le30', label: '<= 30 -> 0' },
    { value: '31_35', label: '31-35 -> +1' },
    { value: '36_40', label: '36-40 -> +2' },
    { value: '41_45', label: '41-45 -> +3' },
    { value: 'ge46', label: '>= 46 -> +4' },
  ],
  dx: [
    { value: 'pneumonia', label: 'Pneumonia (+2,5)' },
    { value: 'choque_septico', label: 'Choque septico (+2,5)' },
    { value: 'ards', label: 'ARDS (+3,0)' },
    { value: 'edema_cardiogenico', label: 'Edema cardiogenico (-4,0)' },
  ],
} as const

const SOFA_SELECTS = [
  {
    key: 'sofaResp',
    label: 'SOFA resp',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    key: 'sofaCns',
    label: 'SOFA CNS',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    key: 'sofaCardio',
    label: 'SOFA cardio',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    key: 'sofaCoag',
    label: 'SOFA coag',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    key: 'sofaLiver',
    label: 'SOFA liver',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    key: 'sofaRenal',
    label: 'SOFA renal',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
] as const

const MRC_GROUPS: Array<{ keyD: MrcKey; keyE: MrcKey; label: string }> = [
  { keyD: 'ombroD', keyE: 'ombroE', label: 'Abducao ombro' },
  { keyD: 'cotoveloD', keyE: 'cotoveloE', label: 'Flexao cotovelo' },
  { keyD: 'punhoD', keyE: 'punhoE', label: 'Extensao punho' },
  { keyD: 'quadrilD', keyE: 'quadrilE', label: 'Flexao quadril' },
  { keyD: 'joelhoD', keyE: 'joelhoE', label: 'Extensao joelho' },
  { keyD: 'tornozeloD', keyE: 'tornozeloE', label: 'Dorsiflexao tornozelo' },
]

const PERME_ITEMS: Array<{ key: PermeKey; label: string; options: { value: string; label: string }[] }> = [
  {
    key: 'estado',
    label: 'Estado mental',
    options: [
      { value: '0', label: 'Nao responde (0)' },
      { value: '1', label: 'Resp. dor (1)' },
      { value: '2', label: 'Resp. voz (2)' },
      { value: '3', label: 'Alerta/orientado (3)' },
    ],
  },
  {
    key: 'barreira',
    label: 'Barreiras',
    options: [
      { value: '0', label: '2+ barreiras (0)' },
      { value: '1', label: '1 barreira (1)' },
      { value: '2', label: 'Nenhuma (2)' },
    ],
  },
  {
    key: 'forcaMs',
    label: 'Forca MMSS',
    options: [
      { value: '0', label: 'Sem mov. (0)' },
      { value: '1', label: 'Sem vencer grav. (1)' },
      { value: '2', label: 'Vence grav. (2)' },
      { value: '3', label: 'Resist. moderada (3)' },
    ],
  },
  {
    key: 'forcaMi',
    label: 'Forca MMII',
    options: [
      { value: '0', label: 'Sem mov. (0)' },
      { value: '1', label: 'Sem vencer grav. (1)' },
      { value: '2', label: 'Vence grav. (2)' },
      { value: '3', label: 'Resist. moderada (3)' },
    ],
  },
  {
    key: 'leito',
    label: 'Mobilidade leito',
    options: [
      { value: '0', label: 'Nao realiza (0)' },
      { value: '1', label: 'Assist. total (1)' },
      { value: '2', label: 'Assist. parcial (2)' },
      { value: '3', label: 'Independente (3)' },
    ],
  },
  {
    key: 'transf',
    label: 'Transferencia',
    options: [
      { value: '0', label: 'Nao realiza (0)' },
      { value: '1', label: 'Assist. total (1)' },
      { value: '2', label: 'Assist. parcial (2)' },
      { value: '3', label: 'Independente (3)' },
    ],
  },
  {
    key: 'marcha',
    label: 'Marcha',
    options: [
      { value: '0', label: 'Nao deambula (0)' },
      { value: '1', label: 'Assist. total/esteira (1)' },
      { value: '2', label: 'Assist. parcial (2)' },
      { value: '3', label: 'Independente (3)' },
    ],
  },
]

const IMS_OPTIONS = [
  { value: '0', label: '0 - Nenhuma mobilidade' },
  { value: '1', label: '1 - Exercicios no leito' },
  { value: '2', label: '2 - Passivo para cadeira' },
  { value: '3', label: '3 - Sentado beira-leito' },
  { value: '4', label: '4 - Ortostatismo' },
  { value: '5', label: '5 - Transferencia leito-cadeira' },
  { value: '6', label: '6 - Marcha estacionaria' },
  { value: '7', label: '7 - Deambulacao assistida (2+)' },
  { value: '8', label: '8 - Deambulacao assistida (1)' },
  { value: '9', label: '9 - Deambulacao com dispositivo' },
  { value: '10', label: '10 - Deambulacao independente' },
]

const INITIAL_COMPLIANCE = { mode: 'VCV', pico: '', plato: '', peep: '', vt: '', fluxo: '' }
const createInitialPeepLevels = () => [
  { peep: '', plato: '', si: '' },
  { peep: '', plato: '', si: '' },
  { peep: '', plato: '', si: '' },
]
const INITIAL_RECRUIT = { recVolInsp: '', recVolExp: '', lip: '', uip: '', volLip: '', volUip: '' }
const INITIAL_RSBI = { fr: '', vc: '' }
const INITIAL_HACOR: HacorState = {
  fc: '',
  ph: '',
  gcs: '',
  oxig: '',
  fr: '',
  dx: '',
  sofaResp: '',
  sofaCns: '',
  sofaCardio: '',
  sofaCoag: '',
  sofaLiver: '',
  sofaRenal: '',
}
const INITIAL_ROX = { spo2: '', fio2: '', fr: '' }
const INITIAL_ASYNCHRONY = { events: '', total: '' }
const INITIAL_MECHANICAL_POWER = { vc: '', dp: '', f: '' }
const INITIAL_VC_WEIGHT = { weight: '' }
const INITIAL_GLASGOW = { o: '', v: '', m: '' }
const INITIAL_GASO = {
  ph: '',
  paCO2: '',
  hco3: '',
  paO2: '',
  fio2: '',
  spO2: '',
  be: '',
  sfMonSpO2: '',
  sfVmFiO2: '',
}
const createInitialMrc = (): Record<MrcKey, string> => ({
  ombroD: '',
  ombroE: '',
  cotoveloD: '',
  cotoveloE: '',
  punhoD: '',
  punhoE: '',
  quadrilD: '',
  quadrilE: '',
  joelhoD: '',
  joelhoE: '',
  tornozeloD: '',
  tornozeloE: '',
})
const createInitialPerme = (): Record<PermeKey, string> => ({
  estado: '',
  barreira: '',
  forcaMs: '',
  forcaMi: '',
  leito: '',
  transf: '',
  marcha: '',
})
const INITIAL_IMS = { score: '' }
const INITIAL_DRIVE = { p01: '', pocc: '' }
const INITIAL_WEAN = {
  vdvtPaCO2: '',
  vdvtPetCO2: '',
  vrVe: '',
  vrPaCO2: '',
  gapPaCO2: '',
  gapEtCO2: '',
  piMax: '',
  peMax: '',
  cvMlKg: '',
}

function toneClass(color?: string) {
  if (color === '#4ade80') return 'border-[#4ade8030] bg-[#4ade8010] text-[#86efac]'
  if (color === '#facc15') return 'border-[#facc1530] bg-[#facc150f] text-[#fde68a]'
  if (color === '#fb923c') return 'border-[#fb923c30] bg-[#fb923c10] text-[#fdba74]'
  if (color === '#f87171') return 'border-[#f8717130] bg-[#f8717110] text-[#fca5a5]'
  if (color === '#60a5fa') return 'border-[#60a5fa30] bg-[#60a5fa10] text-[#93c5fd]'
  if (color === '#a855f7') return 'border-[#a855f730] bg-[#a855f710] text-[#d8b4fe]'
  return 'border-white/10 bg-white/[0.04] text-white/84'
}

function SectionDivider({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="chrome-subtle flex h-12 w-12 items-center justify-center rounded-[1.1rem]">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">{eyebrow}</p>
        <h2 className="metal-text text-[1.05rem] font-semibold uppercase tracking-[0.22em] md:text-[1.2rem]">
          {title}
        </h2>
      </div>
      <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08),transparent)]" />
    </div>
  )
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  step,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  type?: string
  step?: string
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[0.95rem] border border-white/10 bg-black/18 px-3 text-[13px] text-white outline-none transition-all placeholder:text-white/24 focus:border-white/18"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[0.95rem] border border-white/10 bg-black/18 px-3 text-[13px] text-white outline-none transition-all focus:border-white/18"
      >
        <option value="">Selecionar</option>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ResultBadge({
  label,
  value,
  hint,
  color,
  compact = false,
}: {
  label: string
  value: string
  hint?: string
  color?: string
  compact?: boolean
}) {
  return (
    <div className={`rounded-[0.95rem] border ${compact ? 'p-2' : 'p-2.5'} ${toneClass(color)}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-72">{label}</p>
      <p className={`mt-1.5 font-semibold ${compact ? 'text-[12px] md:text-[13px]' : 'text-[13px] md:text-sm'}`}>{value}</p>
      {hint ? <p className={`mt-1 opacity-72 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{hint}</p> : null}
    </div>
  )
}

function InlineNote({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-white/52">{children}</p>
}

function CalcCard({
  id,
  icon: Icon,
  title,
  subtitle,
  open,
  onToggle,
  onClear,
  children,
}: {
  id: CardId
  icon: LucideIcon
  title: string
  subtitle: string
  open: boolean
  onToggle: (id: CardId) => void
  onClear: () => void
  children: ReactNode
}) {
  return (
    <div className="chrome-card overflow-hidden rounded-[1.6rem]">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left md:px-5 md:py-4"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="chrome-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-white/92">{title}</h3>
            <p className="truncate text-[11px] tracking-[0.08em] text-white/42">{subtitle}</p>
          </div>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.24 }}>
          <ChevronDown className="h-5 w-5 text-white/52" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 px-4 py-4 md:px-5 md:py-5">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClear}
                  className="chrome-subtle inline-flex h-9 items-center gap-2 rounded-[0.95rem] px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/72 transition hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Limpar
                </button>
              </div>
              <div className="space-y-5">{children}</div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function VMSystemPanel() {
  const [openCardId, setOpenCardId] = useState<CardId | null>(null)
  const [compliance, setCompliance] = useState(INITIAL_COMPLIANCE)
  const [peepLevels, setPeepLevels] = useState(createInitialPeepLevels)
  const [recruit, setRecruit] = useState(INITIAL_RECRUIT)
  const [rsbi, setRsbi] = useState(INITIAL_RSBI)
  const [hacor, setHacor] = useState<HacorState>(INITIAL_HACOR)
  const [rox, setRox] = useState(INITIAL_ROX)
  const [asynchrony, setAsynchrony] = useState(INITIAL_ASYNCHRONY)
  const [mechanicalPower, setMechanicalPower] = useState(INITIAL_MECHANICAL_POWER)
  const [vcWeight, setVcWeight] = useState(INITIAL_VC_WEIGHT)
  const [glasgow, setGlasgow] = useState(INITIAL_GLASGOW)
  const [gaso, setGaso] = useState(INITIAL_GASO)
  const [mrc, setMrc] = useState<Record<MrcKey, string>>(createInitialMrc)
  const [perme, setPerme] = useState<Record<PermeKey, string>>(createInitialPerme)
  const [ims, setIms] = useState(INITIAL_IMS)
  const [drive, setDrive] = useState(INITIAL_DRIVE)
  const [wean, setWean] = useState(INITIAL_WEAN)

  const complianceMetrics = useMemo(() => {
    const pico = toNumber(compliance.pico)
    const plato = toNumber(compliance.plato)
    const peep = toNumber(compliance.peep)
    const vt = toNumber(compliance.vt)
    const fluxo = toNumber(compliance.fluxo)

    const dp = plato !== null && peep !== null ? calcDP(plato, peep) : null
    const cest = vt !== null && dp !== null ? calcCest(vt, dp) : null
    const cdyn = compliance.mode === 'VCV' && vt !== null && pico !== null && peep !== null ? calcCdyn(vt, pico, peep) : null
    const raw = compliance.mode === 'VCV' && pico !== null && plato !== null && fluxo !== null ? calcRaw(pico, plato, fluxo) : null

    return {
      dp,
      dpTone: dp !== null ? interpDP(dp) : null,
      cest,
      cdyn,
      raw,
    }
  }, [compliance])

  const peepResults = useMemo(() => calcPeepOptimization(peepLevels), [peepLevels])
  const recruitByVolume = useMemo(() => {
    const insp = toNumber(recruit.recVolInsp)
    const exp = toNumber(recruit.recVolExp)
    return insp !== null && exp !== null ? calcRecruitabilityByVolume(insp, exp) : null
  }, [recruit.recVolInsp, recruit.recVolExp])

  const recruitByPV = useMemo(() => {
    const lip = toNumber(recruit.lip)
    const uip = toNumber(recruit.uip)
    const volLip = toNumber(recruit.volLip)
    const volUip = toNumber(recruit.volUip)
    const compliancePv = lip !== null && uip !== null && volLip !== null && volUip !== null ? calcPVCompliance(lip, uip, volLip, volUip) : null
    const suggestedPeep = lip !== null ? calcSuggestedPeepFromLip(lip) : null
    return { compliancePv, suggestedPeep }
  }, [recruit])

  const rsbiValue = useMemo(() => {
    const fr = toNumber(rsbi.fr)
    const vc = toNumber(rsbi.vc)
    if (fr === null || vc === null) return null
    return calcRSBI(fr, vc)
  }, [rsbi])
  const rsbiTone = rsbiValue !== null ? interpRSBI(rsbiValue) : null

  const hacorBase = useMemo(
    () => calcHacorBase({ fc: hacor.fc, ph: hacor.ph, gcs: hacor.gcs, oxig: hacor.oxig, fr: hacor.fr }),
    [hacor.fc, hacor.fr, hacor.gcs, hacor.oxig, hacor.ph]
  )
  const sofaTotal = useMemo(
    () => calcSofaTotal({
      resp: hacor.sofaResp,
      cns: hacor.sofaCns,
      cardio: hacor.sofaCardio,
      coag: hacor.sofaCoag,
      liver: hacor.sofaLiver,
      renal: hacor.sofaRenal,
    }),
    [hacor.sofaCardio, hacor.sofaCns, hacor.sofaCoag, hacor.sofaLiver, hacor.sofaRenal, hacor.sofaResp]
  )
  const updatedHacor = useMemo(() => calcUpdatedHacor(hacorBase, hacor.dx, sofaTotal), [hacor.dx, hacorBase, sofaTotal])
  const updatedHacorTone = updatedHacor !== null ? interpUpdatedHacor(updatedHacor) : null

  const roxValue = useMemo(() => {
    const spo2 = toNumber(rox.spo2)
    const fio2 = toNumber(rox.fio2)
    const fr = toNumber(rox.fr)
    if (spo2 === null || fio2 === null || fr === null) return null
    return calcROX(spo2, fio2, fr)
  }, [rox])
  const roxTone = roxValue !== null ? interpROX(roxValue) : null

  const asynchronyValue = useMemo(() => {
    const events = toNumber(asynchrony.events)
    const total = toNumber(asynchrony.total)
    if (events === null || total === null) return null
    return calcAsynchronyIndex(events, total)
  }, [asynchrony])
  const asynchronyTone = asynchronyValue !== null ? interpAsynchronyIndex(asynchronyValue) : null

  const mpValue = useMemo(() => {
    const vc = toNumber(mechanicalPower.vc)
    const dp = toNumber(mechanicalPower.dp)
    const f = toNumber(mechanicalPower.f)
    if (vc === null || dp === null || f === null) return null
    return calcMechanicalPower(vc, dp, f)
  }, [mechanicalPower])
  const mpTone = mpValue !== null ? interpMechanicalPower(mpValue) : null

  const vcWeightValue = useMemo(() => {
    const weight = toNumber(vcWeight.weight)
    if (weight === null) return null
    return calcVcByWeight(weight)
  }, [vcWeight.weight])

  const glasgowValue = useMemo(() => {
    const o = toNumber(glasgow.o)
    const m = toNumber(glasgow.m)
    if (o === null || m === null || !glasgow.v) return null
    return calcGlasgow(o, glasgow.v, m)
  }, [glasgow])

  const gasoAnalysis = useMemo(() => {
    const ph = toNumber(gaso.ph)
    const paCO2 = toNumber(gaso.paCO2)
    const hco3 = toNumber(gaso.hco3)
    if (ph === null || paCO2 === null || hco3 === null) return null
    return analyzeGaso(ph, paCO2, hco3)
  }, [gaso.hco3, gaso.paCO2, gaso.ph])

  const pfValue = useMemo(() => {
    const paO2 = toNumber(gaso.paO2)
    const fio2 = toNumber(gaso.fio2)
    if (paO2 === null || fio2 === null) return null
    return calcPF(paO2, fio2)
  }, [gaso.fio2, gaso.paO2])
  const pfTone = pfValue !== null ? interpPF(pfValue) : null

  const sfValue = useMemo(() => {
    const spo2 = toNumber(gaso.sfMonSpO2 || gaso.spO2)
    const fio2 = toNumber(gaso.sfVmFiO2 || gaso.fio2)
    if (spo2 === null || fio2 === null) return null
    return calcSF(spo2, fio2)
  }, [gaso.fio2, gaso.sfMonSpO2, gaso.sfVmFiO2, gaso.spO2])
  const beTone = toNumber(gaso.be) !== null ? interpBE(Number(toNumber(gaso.be))) : null

  const p01Value = toNumber(drive.p01)
  const poccValue = toNumber(drive.pocc)
  const p01Tone = p01Value !== null ? interpP01(p01Value) : null
  const poccTone = poccValue !== null ? interpPocc(poccValue) : null
  const pmuscValue = poccValue !== null ? calcPmusc(poccValue) : null
  const pmuscTone = pmuscValue !== null ? interpPmusc(pmuscValue) : null

  const mrcTotal = useMemo(() => calcMrcTotal(Object.values(mrc)), [mrc])
  const mrcTone = mrcTotal !== null ? interpMrc(mrcTotal) : null

  const permeTotal = useMemo(() => calcPermeTotal(Object.values(perme)), [perme])
  const permeTone = permeTotal !== null ? interpPerme(permeTotal) : null

  const imsValue = toNumber(ims.score)
  const imsTone = imsValue !== null ? interpIMS(imsValue) : null

  const vdvtValue = useMemo(() => {
    const paCO2 = toNumber(wean.vdvtPaCO2)
    const petCO2 = toNumber(wean.vdvtPetCO2)
    if (paCO2 === null || petCO2 === null) return null
    return calcVDVT(paCO2, petCO2)
  }, [wean.vdvtPaCO2, wean.vdvtPetCO2])
  const vdvtTone = vdvtValue !== null ? interpVDVT(vdvtValue) : null

  const vrValue = useMemo(() => {
    const ve = toNumber(wean.vrVe)
    const paCO2 = toNumber(wean.vrPaCO2)
    const weight = toNumber(vcWeight.weight)
    if (ve === null || paCO2 === null || weight === null) return null
    return calcVentilatoryRatio(ve, paCO2, weight)
  }, [vcWeight.weight, wean.vrPaCO2, wean.vrVe])
  const vrTone = vrValue !== null ? interpVentilatoryRatio(vrValue) : null

  const gapValue = useMemo(() => {
    const paCO2 = toNumber(wean.gapPaCO2)
    const etCO2 = toNumber(wean.gapEtCO2)
    if (paCO2 === null || etCO2 === null) return null
    return calcCO2Gap(paCO2, etCO2)
  }, [wean.gapEtCO2, wean.gapPaCO2])
  const gapTone = gapValue !== null ? interpCO2Gap(gapValue) : null

  const weanSummary = useMemo(
    () =>
      summarizeWeaningCriteria(
        toNumber(wean.piMax),
        toNumber(wean.peMax),
        toNumber(wean.cvMlKg)
      ),
    [wean.cvMlKg, wean.peMax, wean.piMax]
  )

  const toggleCard = (id: CardId) => {
    setOpenCardId((current) => (current === id ? null : id))
  }

  return (
    <div className="space-y-5">
      <div className="chrome-board rounded-[1.9rem] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="chrome-subtle flex h-14 w-14 items-center justify-center rounded-[1.25rem]">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="metal-text text-[1.45rem] font-semibold uppercase tracking-[0.18em] md:text-[1.7rem]">
                Calculadoras
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionDivider icon={ShieldAlert} eyebrow="VNI" title="VNI / CNAF" />

        <CalcCard
          id="hacor"
          icon={Activity}
          title="Updated HACOR + SOFA"
          subtitle="Falha de VNI em 1-2 horas"
          open={openCardId === 'hacor'}
          onToggle={toggleCard}
          onClear={() => setHacor(INITIAL_HACOR)}
        >
          <div className="space-y-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/22 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">HACOR</p>
              <div className="scrollbar-hide mt-3 overflow-x-auto overscroll-x-contain pb-2">
                <div className="grid min-w-[58rem] grid-cols-6 gap-3">
                  <SelectField label="FC" value={hacor.fc} options={HACOR_SELECTS.fc} onChange={(value) => setHacor((prev) => ({ ...prev, fc: value }))} />
                  <SelectField label="pH" value={hacor.ph} options={HACOR_SELECTS.ph} onChange={(value) => setHacor((prev) => ({ ...prev, ph: value }))} />
                  <SelectField label="GCS" value={hacor.gcs} options={HACOR_SELECTS.gcs} onChange={(value) => setHacor((prev) => ({ ...prev, gcs: value }))} />
                  <SelectField label="PaO2/FiO2" value={hacor.oxig} options={HACOR_SELECTS.oxig} onChange={(value) => setHacor((prev) => ({ ...prev, oxig: value }))} />
                  <SelectField label="FR" value={hacor.fr} options={HACOR_SELECTS.fr} onChange={(value) => setHacor((prev) => ({ ...prev, fr: value }))} />
                  <SelectField label="Diagnostico" value={hacor.dx} options={HACOR_SELECTS.dx} onChange={(value) => setHacor((prev) => ({ ...prev, dx: value }))} />
                </div>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-black/22 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">SOFA</p>
              <div className="scrollbar-hide mt-3 overflow-x-auto overscroll-x-contain pb-2">
                <div className="grid min-w-[58rem] grid-cols-6 gap-3">
                  {SOFA_SELECTS.map((item) => (
                    <SelectField
                      key={item.key}
                      label={item.label}
                      value={hacor[item.key as keyof HacorState]}
                      options={item.options}
                      onChange={(value) => setHacor((prev) => ({ ...prev, [item.key]: value }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ResultBadge label="HACOR base" value={hacorBase !== null ? hacorBase.toFixed(1) : '-'} hint="Soma dos 5 itens" color="#ec4899" />
            <ResultBadge label="SOFA" value={sofaTotal.toFixed(0)} hint="0,5 ponto por score" color="#a855f7" />
            <ResultBadge
              label="Updated HACOR"
              value={updatedHacor !== null ? updatedHacor.toFixed(1) : '-'}
              hint={updatedHacorTone ? `${updatedHacorTone.t}${updatedHacorTone.probability ? ` • ${updatedHacorTone.probability}` : ''}` : 'Preencha os campos'}
              color={updatedHacorTone?.c}
            />
          </div>
        </CalcCard>

        <CalcCard
          id="rox"
          icon={Wind}
          title="Indice ROX"
          subtitle="CNAF e risco de intubacao"
          open={openCardId === 'rox'}
          onToggle={toggleCard}
          onClear={() => setRox(INITIAL_ROX)}
        >
          <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
            <InputField label="SpO2 (%)" value={rox.spo2} placeholder="95" onChange={(value) => setRox((prev) => ({ ...prev, spo2: value }))} type="number" />
            <InputField label="FiO2 (%)" value={rox.fio2} placeholder="50" onChange={(value) => setRox((prev) => ({ ...prev, fio2: value }))} type="number" />
            <InputField label="FR (rpm)" value={rox.fr} placeholder="24" onChange={(value) => setRox((prev) => ({ ...prev, fr: value }))} type="number" />
            <ResultBadge label="ROX" value={roxValue !== null ? roxValue.toFixed(2) : '-'} hint={roxTone?.t ?? 'Preencha os 3 campos'} color={roxTone?.c} />
            <ResultBadge label="Leitura" value={roxTone ? (roxTone.c === '#4ade80' ? 'Estavel' : roxTone.c === '#f87171' ? 'Falha provavel' : 'Reavaliar') : '-'} hint="<3,85 alto risco • >=4,88 menor risco" color={roxTone?.c} />
          </div>
        </CalcCard>
      </div>

      <div className="space-y-4">
        <SectionDivider icon={Radar} eyebrow="VMI" title="VMI" />

        <CalcCard
          id="compliance"
          icon={Gauge}
          title="Compliance e Driving Pressure"
          subtitle="VCV e PCV"
          open={openCardId === 'compliance'}
          onToggle={toggleCard}
          onClear={() => setCompliance(INITIAL_COMPLIANCE)}
        >
          <div className="grid grid-cols-3 gap-3">
              <SelectField
                label="Modo"
                value={compliance.mode}
                options={[
                  { value: 'VCV', label: 'VCV' },
                  { value: 'PCV', label: 'PCV' },
                ]}
                onChange={(value) => setCompliance((prev) => ({ ...prev, mode: value }))}
              />
              {compliance.mode === 'VCV' ? (
                <InputField label="P. pico" value={compliance.pico} placeholder="28" onChange={(value) => setCompliance((prev) => ({ ...prev, pico: value }))} type="number" />
              ) : (
                <div />
              )}
              <InputField label="P. plato" value={compliance.plato} placeholder="22" onChange={(value) => setCompliance((prev) => ({ ...prev, plato: value }))} type="number" />
              <InputField label="PEEP" value={compliance.peep} placeholder="8" onChange={(value) => setCompliance((prev) => ({ ...prev, peep: value }))} type="number" />
              <InputField label="VT (mL)" value={compliance.vt} placeholder="450" onChange={(value) => setCompliance((prev) => ({ ...prev, vt: value }))} type="number" />
              {compliance.mode === 'VCV' ? (
                <InputField label="Fluxo (L/min)" value={compliance.fluxo} placeholder="60" onChange={(value) => setCompliance((prev) => ({ ...prev, fluxo: value }))} type="number" />
              ) : (
                <div />
              )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <ResultBadge
              compact
              label="Delta P"
              value={complianceMetrics.dp !== null ? complianceMetrics.dp.toFixed(1) : '-'}
              hint={complianceMetrics.dpTone ? `${complianceMetrics.dpTone.t} • cmH2O` : 'Pplat - PEEP'}
              color={complianceMetrics.dpTone?.c}
            />
            <ResultBadge
              compact
              label="Cest"
              value={complianceMetrics.cest !== null ? complianceMetrics.cest.toFixed(1) : '-'}
              hint="mL/cmH2O"
            />
            <ResultBadge
              compact
              label="Cdyn"
              value={complianceMetrics.cdyn !== null ? complianceMetrics.cdyn.toFixed(1) : '-'}
              hint="VCV • mL/cmH2O"
            />
            <ResultBadge
              compact
              label="Raw"
              value={complianceMetrics.raw !== null ? complianceMetrics.raw.toFixed(2) : '-'}
              hint="VCV • cmH2O/L/s"
            />
          </div>
        </CalcCard>

        <CalcCard
          id="peep"
          icon={Layers3}
          title="PEEP + Stress Index"
          subtitle="3 niveis e escolha automatica"
          open={openCardId === 'peep'}
          onToggle={toggleCard}
          onClear={() => setPeepLevels(createInitialPeepLevels())}
        >
          <div className="grid gap-2 xl:grid-cols-3">
            {peepLevels.map((level, index) => (
              <div key={`level-${index}`} className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Nivel {index + 1}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <InputField label="PEEP" value={level.peep} placeholder="5" onChange={(value) => setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, peep: value } : item)))} type="number" />
                  <InputField label="Plato" value={level.plato} placeholder="22" onChange={(value) => setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, plato: value } : item)))} type="number" />
                  <InputField label="SI" value={level.si} placeholder="=1, <1, >1" onChange={(value) => setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, si: value } : item)))} />
                </div>
              </div>
            ))}
          </div>

          {peepResults ? (
            <div className="grid gap-3 xl:grid-cols-3">
              {peepResults.map((result, index) => (
                <ResultBadge
                  key={`peep-result-${result.index}`}
                  label={index === 0 ? 'Recomendado' : `Nivel ${result.index + 1}`}
                  value={`PEEP ${result.peep.toFixed(0)} • dP ${result.dp.toFixed(1)}`}
                  hint={`${result.siLabel} • ${result.dpClass}`}
                  color={index === 0 ? '#4ade80' : result.dpClass === 'Elevado' ? '#f87171' : '#facc15'}
                />
              ))}
            </div>
          ) : (
            <InlineNote>Preencha pelo menos um nivel completo com PEEP, plato e SI.</InlineNote>
          )}
        </CalcCard>

        <CalcCard
          id="recruit"
          icon={Wind}
          title="Recrutabilidade pulmonar"
          subtitle="Volumes e loop P-V"
          open={openCardId === 'recruit'}
          onToggle={toggleCard}
          onClear={() => setRecruit(INITIAL_RECRUIT)}
        >
          <div className="space-y-3">
            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Recrutabilidade</p>
              <div className="scrollbar-hide mt-2 overflow-x-auto pb-2">
                <div className="grid min-w-[34rem] grid-cols-3 gap-3">
                  <InputField label="Vol. insp." value={recruit.recVolInsp} placeholder="1200" onChange={(value) => setRecruit((prev) => ({ ...prev, recVolInsp: value }))} type="number" />
                  <InputField label="Vol. exp." value={recruit.recVolExp} placeholder="600" onChange={(value) => setRecruit((prev) => ({ ...prev, recVolExp: value }))} type="number" />
                  <ResultBadge
                    label="Diferenca"
                    value={recruitByVolume ? `${recruitByVolume.difference.toFixed(0)} mL` : '-'}
                    hint={recruitByVolume ? (recruitByVolume.recruitable ? 'Recrutavel' : 'Pouco recrutavel') : '>500 mL sugere recrutabilidade'}
                    color={recruitByVolume ? (recruitByVolume.recruitable ? '#4ade80' : '#f87171') : undefined}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Loop P-V</p>
              <div className="scrollbar-hide mt-2 overflow-x-auto pb-2">
                <div className="grid min-w-[68rem] grid-cols-6 gap-3">
                  <InputField label="LIP" value={recruit.lip} placeholder="10" onChange={(value) => setRecruit((prev) => ({ ...prev, lip: value }))} type="number" />
                  <InputField label="UIP" value={recruit.uip} placeholder="28" onChange={(value) => setRecruit((prev) => ({ ...prev, uip: value }))} type="number" />
                  <InputField label="Vol LIP" value={recruit.volLip} placeholder="200" onChange={(value) => setRecruit((prev) => ({ ...prev, volLip: value }))} type="number" />
                  <InputField label="Vol UIP" value={recruit.volUip} placeholder="800" onChange={(value) => setRecruit((prev) => ({ ...prev, volUip: value }))} type="number" />
                  <ResultBadge label="Complacencia P-V" value={recruitByPV.compliancePv !== null ? `${recruitByPV.compliancePv.toFixed(1)} mL/cmH2O` : '-'} hint="Slope" />
                  <ResultBadge label="PEEP sugerida" value={recruitByPV.suggestedPeep !== null ? `${recruitByPV.suggestedPeep.toFixed(1)} cmH2O` : '-'} hint="LIP + 2" color="#60a5fa" />
                </div>
              </div>
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="rsbi"
          icon={Gauge}
          title="RSBI"
          subtitle="Indice de respiracao rapida superficial"
          open={openCardId === 'rsbi'}
          onToggle={toggleCard}
          onClear={() => setRsbi(INITIAL_RSBI)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[44rem] grid-cols-4 gap-3">
              <InputField label="FR (rpm)" value={rsbi.fr} placeholder="25" onChange={(value) => setRsbi((prev) => ({ ...prev, fr: value }))} type="number" />
              <InputField label="VC (mL)" value={rsbi.vc} placeholder="350" onChange={(value) => setRsbi((prev) => ({ ...prev, vc: value }))} type="number" />
              <ResultBadge label="RSBI" value={rsbiValue !== null ? rsbiValue.toFixed(0) : '-'} hint={rsbiTone?.t ?? 'FR / VC em litros'} color={rsbiTone?.c} />
              <ResultBadge label="Critico" value={rsbiTone ? (rsbiTone.c === '#4ade80' ? '< 80' : rsbiTone.c === '#f87171' ? '> 105' : '80-105') : '-'} hint="Yang & Tobin" color={rsbiTone?.c} />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="mpower"
          icon={HeartPulse}
          title="Mechanical Power"
          subtitle="Energia transmitida ao pulmao"
          open={openCardId === 'mpower'}
          onToggle={toggleCard}
          onClear={() => setMechanicalPower(INITIAL_MECHANICAL_POWER)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[54rem] grid-cols-5 gap-3">
              <InputField label="VC (mL)" value={mechanicalPower.vc} placeholder="450" onChange={(value) => setMechanicalPower((prev) => ({ ...prev, vc: value }))} type="number" />
              <InputField label="Delta P" value={mechanicalPower.dp} placeholder="12" onChange={(value) => setMechanicalPower((prev) => ({ ...prev, dp: value }))} type="number" />
              <InputField label="FR" value={mechanicalPower.f} placeholder="20" onChange={(value) => setMechanicalPower((prev) => ({ ...prev, f: value }))} type="number" />
              <ResultBadge label="Mechanical power" value={mpValue !== null ? `${mpValue.toFixed(1)} J/min` : '-'} hint={mpTone?.t ?? '0,098 x VC x dP x FR'} color={mpTone?.c} />
              <ResultBadge label="Leitura" value={mpTone?.t ?? '-'} hint="Risco energetico" color={mpTone?.c} />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="vcweight"
          icon={Activity}
          title="Volume corrente por peso"
          subtitle="Faixas protetora e convencional"
          open={openCardId === 'vcweight'}
          onToggle={toggleCard}
          onClear={() => setVcWeight(INITIAL_VC_WEIGHT)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[40rem] grid-cols-3 gap-3">
              <InputField label="Peso (kg)" value={vcWeight.weight} placeholder="70" onChange={(value) => setVcWeight({ weight: value })} type="number" />
              <ResultBadge
                label="VC protetor"
                value={vcWeightValue ? `${vcWeightValue.protective[0]}-${vcWeightValue.protective[1]} mL` : '-'}
                hint="4-6 mL/kg"
                color="#4ade80"
              />
              <ResultBadge
                label="VC convencional"
                value={vcWeightValue ? `${vcWeightValue.conventional[0]}-${vcWeightValue.conventional[1]} mL` : '-'}
                hint="6-8 mL/kg"
                color="#60a5fa"
              />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="drive"
          icon={Radar}
          title="P0.1, Pocc e Pmusc"
          subtitle="Drive e esforco"
          open={openCardId === 'drive'}
          onToggle={toggleCard}
          onClear={() => setDrive(INITIAL_DRIVE)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[56rem] grid-cols-5 gap-3">
              <InputField label="P0.1 (cmH2O)" value={drive.p01} placeholder="2.0" onChange={(value) => setDrive((prev) => ({ ...prev, p01: value }))} type="number" step="0.1" />
              <InputField label="Pocc (cmH2O)" value={drive.pocc} placeholder="8" onChange={(value) => setDrive((prev) => ({ ...prev, pocc: value }))} type="number" step="0.1" />
              <ResultBadge label="P0.1" value={p01Value !== null ? p01Value.toFixed(1) : '-'} hint={p01Tone?.t ?? 'Drive'} color={p01Tone?.c} />
              <ResultBadge label="Pocc" value={poccValue !== null ? poccValue.toFixed(1) : '-'} hint={poccTone?.t ?? 'Esforco'} color={poccTone?.c} />
              <ResultBadge label="Pmusc" value={pmuscValue !== null ? pmuscValue.toFixed(1) : '-'} hint={pmuscTone?.t ?? '0,75 x Pocc'} color={pmuscTone?.c} />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="wean"
          icon={Waves}
          title="Eficiencia / Desmame"
          subtitle="VD/VT, VR, gap CO2, PImax, PEmax, CV"
          open={openCardId === 'wean'}
          onToggle={toggleCard}
          onClear={() => setWean(INITIAL_WEAN)}
        >
          <div className="grid gap-3 xl:grid-cols-2">
            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">VD/VT</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <InputField label="PaCO2" value={wean.vdvtPaCO2} placeholder="40" onChange={(value) => setWean((prev) => ({ ...prev, vdvtPaCO2: value }))} type="number" />
                <InputField label="PetCO2" value={wean.vdvtPetCO2} placeholder="35" onChange={(value) => setWean((prev) => ({ ...prev, vdvtPetCO2: value }))} type="number" />
                <ResultBadge compact label="VD/VT" value={vdvtValue !== null ? vdvtValue.toFixed(2) : '-'} hint={vdvtTone?.t ?? '0,25-0,40'} color={vdvtTone?.c} />
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Ventilatory ratio</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <InputField label="VE atual" value={wean.vrVe} placeholder="8" onChange={(value) => setWean((prev) => ({ ...prev, vrVe: value }))} type="number" step="0.1" />
                <InputField label="PaCO2 atual" value={wean.vrPaCO2} placeholder="40" onChange={(value) => setWean((prev) => ({ ...prev, vrPaCO2: value }))} type="number" />
                <ResultBadge
                  compact
                  label="VR"
                  value={vrValue !== null ? vrValue.toFixed(2) : '-'}
                  hint={vrTone?.t ?? 'Peso do VC'}
                  color={vrTone?.c}
                />
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Gap CO2</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <InputField label="PaCO2" value={wean.gapPaCO2} placeholder="40" onChange={(value) => setWean((prev) => ({ ...prev, gapPaCO2: value }))} type="number" />
                <InputField label="EtCO2" value={wean.gapEtCO2} placeholder="37" onChange={(value) => setWean((prev) => ({ ...prev, gapEtCO2: value }))} type="number" />
                <ResultBadge compact label="Gap" value={gapValue !== null ? `${gapValue.toFixed(0)} mmHg` : '-'} hint={gapTone?.t ?? 'Pa-Et'} color={gapTone?.c} />
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-black/22 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Criterios de desmame</p>
              <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                <InputField label="PImax" value={wean.piMax} placeholder="30" onChange={(value) => setWean((prev) => ({ ...prev, piMax: value }))} type="number" />
                <InputField label="PEmax" value={wean.peMax} placeholder="40" onChange={(value) => setWean((prev) => ({ ...prev, peMax: value }))} type="number" />
                <InputField label="CV (mL/kg)" value={wean.cvMlKg} placeholder="12" onChange={(value) => setWean((prev) => ({ ...prev, cvMlKg: value }))} type="number" step="0.1" />
                <ResultBadge compact label="Resumo" value={weanSummary ? weanSummary.t : '-'} hint="PI30 • PE40 • CV10" color={weanSummary?.c} />
              </div>
            </div>
          </div>
        </CalcCard>
      </div>

      <div className="space-y-4">
        <SectionDivider icon={Orbit} eyebrow="ADICIONAIS" title="Outras calculadoras" />

        <CalcCard
          id="gaso"
          icon={Stethoscope}
          title="Gasometria arterial"
          subtitle="P/F, S/F, BE e leitura acido-base"
          open={openCardId === 'gaso'}
          onToggle={toggleCard}
          onClear={() => setGaso(INITIAL_GASO)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[96rem] grid-cols-[repeat(13,minmax(0,1fr))] gap-2">
              <InputField label="pH" value={gaso.ph} placeholder="7.40" onChange={(value) => setGaso((prev) => ({ ...prev, ph: value }))} type="number" step="0.01" />
              <InputField label="PaCO2" value={gaso.paCO2} placeholder="40" onChange={(value) => setGaso((prev) => ({ ...prev, paCO2: value }))} type="number" />
              <InputField label="HCO3" value={gaso.hco3} placeholder="24" onChange={(value) => setGaso((prev) => ({ ...prev, hco3: value }))} type="number" />
              <InputField label="PaO2" value={gaso.paO2} placeholder="85" onChange={(value) => setGaso((prev) => ({ ...prev, paO2: value }))} type="number" />
              <InputField label="FiO2 gaso" value={gaso.fio2} placeholder="40" onChange={(value) => setGaso((prev) => ({ ...prev, fio2: value }))} type="number" />
              <InputField label="SpO2 gaso" value={gaso.spO2} placeholder="96" onChange={(value) => setGaso((prev) => ({ ...prev, spO2: value }))} type="number" />
              <InputField label="Sat monitor" value={gaso.sfMonSpO2} placeholder="96" onChange={(value) => setGaso((prev) => ({ ...prev, sfMonSpO2: value }))} type="number" />
              <InputField label="FiO2 VM" value={gaso.sfVmFiO2} placeholder="40" onChange={(value) => setGaso((prev) => ({ ...prev, sfVmFiO2: value }))} type="number" />
              <InputField label="BE" value={gaso.be} placeholder="-1" onChange={(value) => setGaso((prev) => ({ ...prev, be: value }))} type="number" />
              <ResultBadge compact label="Analise" value={gasoAnalysis?.full ?? '-'} hint="Acido-base" color={gasoAnalysis?.cor} />
              <ResultBadge compact label="P/F" value={pfValue !== null ? pfValue.toFixed(0) : '-'} hint={pfTone?.t ?? 'PaO2/FiO2'} color={pfTone?.c} />
              <ResultBadge compact label="S/F" value={sfValue !== null ? sfValue.toFixed(0) : '-'} hint="Sat/FiO2" color="#60a5fa" />
              <ResultBadge compact label="BE" value={toNumber(gaso.be) !== null ? `${Number(toNumber(gaso.be)).toFixed(1)}` : '-'} hint={beTone?.t ?? 'Base excess'} color={beTone?.c} />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="asynchrony"
          icon={Activity}
          title="Indice de assincronia"
          subtitle="Eventos assincronicos / ciclos totais"
          open={openCardId === 'asynchrony'}
          onToggle={toggleCard}
          onClear={() => setAsynchrony(INITIAL_ASYNCHRONY)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[44rem] grid-cols-4 gap-2">
              <InputField label="Eventos" value={asynchrony.events} placeholder="5" onChange={(value) => setAsynchrony((prev) => ({ ...prev, events: value }))} type="number" />
              <InputField label="Ciclos totais" value={asynchrony.total} placeholder="50" onChange={(value) => setAsynchrony((prev) => ({ ...prev, total: value }))} type="number" />
              <ResultBadge compact label="IA" value={asynchronyValue !== null ? `${asynchronyValue.toFixed(1)}%` : '-'} hint={asynchronyTone?.t ?? '(eventos/ciclos)'} color={asynchronyTone?.c} />
              <ResultBadge compact label="Gravidade" value={asynchronyTone?.t ?? '-'} hint=">10% grave" color={asynchronyTone?.c} />
            </div>
          </div>
        </CalcCard>

        <CalcCard
          id="glasgow"
          icon={Brain}
          title="Escala de Glasgow"
          subtitle="O + V + M"
          open={openCardId === 'glasgow'}
          onToggle={toggleCard}
          onClear={() => setGlasgow(INITIAL_GLASGOW)}
        >
          <div className="grid grid-cols-4 gap-2">
              <SelectField label="Ocular" value={glasgow.o} options={[{ value: '4', label: '4' }, { value: '3', label: '3' }, { value: '2', label: '2' }, { value: '1', label: '1' }]} onChange={(value) => setGlasgow((prev) => ({ ...prev, o: value }))} />
              <SelectField label="Verbal" value={glasgow.v} options={[{ value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3' }, { value: '2', label: '2' }, { value: '1', label: '1' }, { value: 'T', label: 'T - Intubado' }]} onChange={(value) => setGlasgow((prev) => ({ ...prev, v: value }))} />
              <SelectField label="Motora" value={glasgow.m} options={[{ value: '6', label: '6' }, { value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3' }, { value: '2', label: '2' }, { value: '1', label: '1' }]} onChange={(value) => setGlasgow((prev) => ({ ...prev, m: value }))} />
              <ResultBadge compact label="Glasgow" value={glasgowValue ? String(glasgowValue.total) : '-'} hint={glasgowValue?.interp ?? 'Selecione O, V e M'} color={glasgowValue?.cor} />
          </div>
        </CalcCard>

        <CalcCard
          id="mrc"
          icon={Activity}
          title="MRC"
          subtitle="Forca muscular global"
          open={openCardId === 'mrc'}
          onToggle={toggleCard}
          onClear={() => setMrc(createInitialMrc())}
        >
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
            {MRC_GROUPS.map((group) => (
              <div key={group.label} className="rounded-[1rem] border border-white/10 bg-black/22 p-2.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/42">{group.label}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <SelectField label="D" value={mrc[group.keyD]} options={[0,1,2,3,4,5].map((value)=>({ value: String(value), label: String(value) }))} onChange={(value) => setMrc((prev) => ({ ...prev, [group.keyD]: value }))} />
                  <SelectField label="E" value={mrc[group.keyE]} options={[0,1,2,3,4,5].map((value)=>({ value: String(value), label: String(value) }))} onChange={(value) => setMrc((prev) => ({ ...prev, [group.keyE]: value }))} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <ResultBadge compact label="MRC total" value={mrcTotal !== null ? `${mrcTotal}/60` : '-'} hint={mrcTone?.t ?? 'Preencha os 12 grupos'} color={mrcTone?.c} />
          </div>
        </CalcCard>

        <CalcCard
          id="perme"
          icon={Waves}
          title="PERME"
          subtitle="Mobilidade 0-21"
          open={openCardId === 'perme'}
          onToggle={toggleCard}
          onClear={() => setPerme(createInitialPerme())}
        >
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            {PERME_ITEMS.map((item) => (
              <SelectField key={item.key} label={item.label} value={perme[item.key]} options={item.options} onChange={(value) => setPerme((prev) => ({ ...prev, [item.key]: value }))} />
            ))}
            <ResultBadge compact label="PERME" value={permeTotal !== null ? `${permeTotal}/21` : '-'} hint={permeTone?.t ?? 'Preencha os 7 itens'} color={permeTone?.c} />
          </div>
          <div className="hidden md:grid md:grid-cols-4 md:gap-2">
            <div />
            <div />
            <div />
            <div />
          </div>
        </CalcCard>

        <CalcCard
          id="ims"
          icon={Radar}
          title="IMS"
          subtitle="ICU Mobility Scale"
          open={openCardId === 'ims'}
          onToggle={toggleCard}
          onClear={() => setIms(INITIAL_IMS)}
        >
          <div className="scrollbar-hide overflow-x-auto pb-2">
            <div className="grid min-w-[28rem] grid-cols-2 gap-2">
              <SelectField label="IMS" value={ims.score} options={IMS_OPTIONS} onChange={(value) => setIms({ score: value })} />
              <ResultBadge compact label="IMS" value={imsValue !== null ? `${imsValue}/10` : '-'} hint={imsTone?.t ?? 'Escala de mobilidade'} color={imsTone?.c} />
            </div>
          </div>
        </CalcCard>
      </div>
    </div>
  )
}
