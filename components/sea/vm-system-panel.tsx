'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  Brain,
  Gauge,
  HeartPulse,
  Layers3,
  Orbit,
  Waves,
  Wind,
} from 'lucide-react'
import {
  analisarGaso,
  calcGlasgow,
  calcPesoIdeal,
  calcPmusc,
  interpP01,
  interpPF,
  interpPmusc,
  interpPocc,
  interpRSBI,
} from '@/lib/icu-calcs'
import {
  calcCdyn,
  calcCest,
  calcDP,
  calcMechanicalPower,
  calcPF,
  calcROX,
  calcRSBI,
  calcRaw,
} from '@/lib/vm-calcs'

type PeepLevel = {
  peep: string
  plato: string
  si: string
}

type HacorState = {
  fc: string
  ph: string
  gcs: string
  oxig: string
  fr: string
  dx: string
}

type SofaState = {
  resp: string
  cns: string
  cardio: string
  coag: string
  liver: string
  renal: string
}

type MrcState = Record<string, string>

const INITIAL_PEEP_LEVELS: PeepLevel[] = [
  { peep: '', plato: '', si: '' },
  { peep: '', plato: '', si: '' },
  { peep: '', plato: '', si: '' },
]

const INITIAL_HACOR: HacorState = {
  fc: '',
  ph: '',
  gcs: '',
  oxig: '',
  fr: '',
  dx: '',
}

const INITIAL_SOFA: SofaState = {
  resp: '',
  cns: '',
  cardio: '',
  coag: '',
  liver: '',
  renal: '',
}

const INITIAL_MRC: MrcState = {
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

const IMS_OPTIONS = [
  { value: '0', label: '0 - Imobilidade' },
  { value: '1', label: '1 - Exercicio no leito' },
  { value: '2', label: '2 - Passivo para cadeira' },
  { value: '3', label: '3 - Sentado beira-leito' },
  { value: '4', label: '4 - Ortostatismo' },
  { value: '5', label: '5 - Transferencia leito-cadeira' },
  { value: '6', label: '6 - Marcha estacionaria' },
  { value: '7', label: '7 - Deambulacao assistida 2+' },
  { value: '8', label: '8 - Deambulacao assistida 1' },
  { value: '9', label: '9 - Deambulacao com dispositivo' },
  { value: '10', label: '10 - Deambulacao independente' },
]

const MRC_FIELDS = [
  { key: 'ombroD', label: 'Ombro D' },
  { key: 'ombroE', label: 'Ombro E' },
  { key: 'cotoveloD', label: 'Cotovelo D' },
  { key: 'cotoveloE', label: 'Cotovelo E' },
  { key: 'punhoD', label: 'Punho D' },
  { key: 'punhoE', label: 'Punho E' },
  { key: 'quadrilD', label: 'Quadril D' },
  { key: 'quadrilE', label: 'Quadril E' },
  { key: 'joelhoD', label: 'Joelho D' },
  { key: 'joelhoE', label: 'Joelho E' },
  { key: 'tornozeloD', label: 'Tornozelo D' },
  { key: 'tornozeloE', label: 'Tornozelo E' },
] as const

function parseNumber(value: string) {
  if (!value.trim()) {
    return null
  }

  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function parseStressIndex(value: string) {
  const normalized = value.trim().replace(/\s/g, '')

  if (!normalized) {
    return { value: null, label: '-', ok: false }
  }

  if (normalized === '=1' || normalized === '1' || normalized === '1.0') {
    return { value: 1, label: '=1 (ideal)', ok: true }
  }

  if (normalized === '>1') {
    return { value: 1.2, label: '>1 (hiperdistensao)', ok: false }
  }

  if (normalized === '<1') {
    return { value: 0.8, label: '<1 (colapso)', ok: false }
  }

  const parsed = parseNumber(normalized)
  if (parsed === null) {
    return { value: null, label: normalized, ok: false }
  }

  return {
    value: parsed,
    label: parsed.toFixed(2),
    ok: parsed >= 0.9 && parsed <= 1.1,
  }
}

function metricBoxStyle(color: string) {
  return {
    borderColor: `${color}30`,
    background: `${color}10`,
  }
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1rem] border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/22 focus:border-white/18"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-white/18"
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

function MetricCard({
  icon: Icon,
  label,
  value,
  caption,
  color,
}: {
  icon: typeof Activity
  label: string
  value: string
  caption: string
  color: string
}) {
  return (
    <div className="chrome-panel rounded-[1.35rem] p-4">
      <div className="mb-3 flex items-center gap-2 text-white/48">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="text-xl font-semibold text-white/92">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/48">{caption}</p>
    </div>
  )
}

export function VMSystemPanel() {
  const [fr, setFr] = useState('16')
  const [peep, setPeep] = useState('8')
  const [peakPressure, setPeakPressure] = useState('26')
  const [platoPressure, setPlatoPressure] = useState('20')
  const [tidalVolume, setTidalVolume] = useState('420')
  const [flow, setFlow] = useState('60')
  const [fio2, setFio2] = useState('40')
  const [pao2, setPao2] = useState('92')
  const [spo2, setSpo2] = useState('96')
  const [vc, setVc] = useState('380')
  const [bodyWeight, setBodyWeight] = useState('70')
  const [height, setHeight] = useState('170')
  const [sex, setSex] = useState('M')
  const [gasoPh, setGasoPh] = useState('7.36')
  const [gasoPaCO2, setGasoPaCO2] = useState('49')
  const [gasoHCO3, setGasoHCO3] = useState('27')
  const [p01, setP01] = useState('2.4')
  const [pocc, setPocc] = useState('8')
  const [glasgowO, setGlasgowO] = useState('4')
  const [glasgowV, setGlasgowV] = useState('T')
  const [glasgowM, setGlasgowM] = useState('6')
  const [imsScore, setImsScore] = useState('4')
  const [peepLevels, setPeepLevels] = useState<PeepLevel[]>(INITIAL_PEEP_LEVELS)
  const [hacor, setHacor] = useState<HacorState>(INITIAL_HACOR)
  const [sofa, setSofa] = useState<SofaState>(INITIAL_SOFA)
  const [mrc, setMrc] = useState<MrcState>(INITIAL_MRC)

  const metrics = useMemo(() => {
    const parsedFr = parseNumber(fr)
    const parsedPeep = parseNumber(peep)
    const parsedPeak = parseNumber(peakPressure)
    const parsedPlato = parseNumber(platoPressure)
    const parsedVt = parseNumber(tidalVolume)
    const parsedFlow = parseNumber(flow)
    const parsedFio2 = parseNumber(fio2)
    const parsedPao2 = parseNumber(pao2)
    const parsedSpo2 = parseNumber(spo2)
    const parsedVc = parseNumber(vc)

    const dp = parsedPlato !== null && parsedPeep !== null ? calcDP(parsedPlato, parsedPeep) : null
    const cest = parsedVt !== null && dp !== null ? calcCest(parsedVt, dp) : null
    const cdyn =
      parsedVt !== null && parsedPeak !== null && parsedPeep !== null ? calcCdyn(parsedVt, parsedPeak, parsedPeep) : null
    const raw =
      parsedPeak !== null && parsedPlato !== null && parsedFlow !== null
        ? calcRaw(parsedPeak, parsedPlato, parsedFlow)
        : null
    const pf = parsedPao2 !== null && parsedFio2 !== null ? calcPF(parsedPao2, parsedFio2) : null
    const rsbi = parsedFr !== null && parsedVc !== null ? calcRSBI(parsedFr, parsedVc) : null
    const rox =
      parsedSpo2 !== null && parsedFio2 !== null && parsedFr !== null ? calcROX(parsedSpo2, parsedFio2, parsedFr) : null
    const mechanicalPower =
      parsedVt !== null && dp !== null && parsedFr !== null ? calcMechanicalPower(parsedVt, dp, parsedFr) : null

    return {
      dp,
      cest,
      cdyn,
      raw,
      pf,
      pfInterp: pf !== null ? interpPF(pf) : null,
      rsbi,
      rsbiInterp: rsbi !== null ? interpRSBI(rsbi) : null,
      rox,
      mechanicalPower,
    }
  }, [fio2, flow, fr, pao2, peep, peakPressure, platoPressure, spo2, tidalVolume, vc])

  const gasAnalysis = useMemo(() => {
    const ph = parseNumber(gasoPh)
    const paCo2 = parseNumber(gasoPaCO2)
    const hco3 = parseNumber(gasoHCO3)

    if (ph === null || paCo2 === null || hco3 === null) {
      return null
    }

    return analisarGaso({
      gasoPH: ph,
      gasoPaCO2: paCo2,
      gasoHCO3: hco3,
    })
  }, [gasoHCO3, gasoPaCO2, gasoPh])

  const neuroDrive = useMemo(() => {
    const parsedP01 = parseNumber(p01)
    const parsedPocc = parseNumber(pocc)
    const pmusc = parsedPocc !== null ? calcPmusc(parsedPocc) : null

    return {
      p01Interp: parsedP01 !== null ? interpP01(parsedP01) : null,
      poccInterp: parsedPocc !== null ? interpPocc(parsedPocc) : null,
      pmusc,
      pmuscInterp: pmusc !== null ? interpPmusc(pmusc) : null,
      glasgow:
        glasgowO || glasgowV || glasgowM
          ? calcGlasgow(Number(glasgowO || 0), glasgowV || 'T', Number(glasgowM || 0))
          : null,
    }
  }, [glasgowM, glasgowO, glasgowV, p01, pocc])

  const peepOptimization = useMemo(() => {
    const results = peepLevels
      .map((level, index) => {
        const currentPeep = parseNumber(level.peep)
        const currentPlato = parseNumber(level.plato)
        const si = parseStressIndex(level.si)

        if (currentPeep === null || currentPlato === null) {
          return null
        }

        const dp = currentPlato - currentPeep
        const score = (dp < 12 ? 3 : dp <= 15 ? 2 : 1) + (si.ok ? 3 : si.value !== null ? 1 : 0)

        return {
          index,
          peep: currentPeep,
          plato: currentPlato,
          dp,
          siLabel: si.label,
          siOk: si.ok,
          score,
        }
      })
      .filter(Boolean) as {
      index: number
      peep: number
      plato: number
      dp: number
      siLabel: string
      siOk: boolean
      score: number
    }[]

    results.sort((left, right) => right.score - left.score || left.dp - right.dp)
    return results[0] ?? null
  }, [peepLevels])

  const hacorResult = useMemo(() => {
    const baseParts = [
      hacor.fc ? HACOR_SCORE.fc[hacor.fc as keyof typeof HACOR_SCORE.fc] : null,
      hacor.ph ? HACOR_SCORE.ph[hacor.ph as keyof typeof HACOR_SCORE.ph] : null,
      hacor.gcs ? HACOR_SCORE.gcs[hacor.gcs as keyof typeof HACOR_SCORE.gcs] : null,
      hacor.oxig ? HACOR_SCORE.oxig[hacor.oxig as keyof typeof HACOR_SCORE.oxig] : null,
      hacor.fr ? HACOR_SCORE.fr[hacor.fr as keyof typeof HACOR_SCORE.fr] : null,
    ]

    if (baseParts.every((value) => value === null)) {
      return null
    }

    const base = baseParts.reduce((total, value) => total + (value ?? 0), 0)
    const sofaTotal = Object.values(sofa).reduce((total, value) => total + (parseInt(value, 10) || 0), 0)
    const total = base + (hacor.dx ? HACOR_DX[hacor.dx as keyof typeof HACOR_DX] : 0) + sofaTotal * 0.5

    let risk = 'Baixo'
    let color = '#4ade80'
    let probability = '~12,4%'

    if (total > 14) {
      risk = 'Muito alto'
      color = '#f87171'
      probability = '>83,7%'
    } else if (total >= 11) {
      risk = 'Alto'
      color = '#fb923c'
      probability = '~67,1%'
    } else if (total >= 7.5) {
      risk = 'Moderado'
      color = '#facc15'
      probability = '~38,2%'
    }

    return {
      base,
      sofaTotal,
      total,
      risk,
      color,
      probability,
    }
  }, [hacor, sofa])

  const mrcResult = useMemo(() => {
    const values = Object.values(mrc).filter((value) => value !== '')
    const total = values.reduce((sum, value) => sum + (parseInt(value, 10) || 0), 0)

    if (values.length !== MRC_FIELDS.length) {
      return null
    }

    if (total >= 48) return { total, text: 'Normal (>=48)', color: '#4ade80' }
    if (total >= 36) return { total, text: 'Fraqueza leve (36-47)', color: '#facc15' }
    if (total >= 24) return { total, text: 'Fraqueza moderada (24-35)', color: '#fb923c' }
    return { total, text: 'Grave (<24) ICU-AW', color: '#f87171' }
  }, [mrc])

  const imsResult = useMemo(() => {
    const value = parseInt(imsScore, 10)
    if (Number.isNaN(value)) {
      return null
    }

    if (value >= 7) return { value, text: 'Alta (7-10)', color: '#4ade80' }
    if (value >= 4) return { value, text: 'Moderada (4-6)', color: '#facc15' }
    if (value >= 1) return { value, text: 'Baixa (1-3)', color: '#fb923c' }
    return { value, text: 'Imobilidade (0)', color: '#f87171' }
  }, [imsScore])

  const idealWeight = useMemo(() => {
    const parsedHeight = parseNumber(height)
    if (parsedHeight === null) {
      return null
    }

    return calcPesoIdeal(parsedHeight, sex)
  }, [height, sex])

  const vcRange = useMemo(() => {
    const weight = parseNumber(bodyWeight) ?? idealWeight
    if (weight === null || weight <= 0) {
      return null
    }

    return {
      protetor: `${Math.round(weight * 4)}-${Math.round(weight * 6)} mL`,
      convencional: `${Math.round(weight * 6)}-${Math.round(weight * 8)} mL`,
    }
  }, [bodyWeight, idealWeight])

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.35fr,1fr]">
        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
              <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Wind className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Base ventilatoria</p>
              <h4 className="text-sm font-semibold text-white/88">Parametros principais da VM</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InputField label="FR (rpm)" value={fr} onChange={setFr} placeholder="16" />
            <InputField label="PEEP (cmH2O)" value={peep} onChange={setPeep} placeholder="8" />
            <InputField label="P. pico" value={peakPressure} onChange={setPeakPressure} placeholder="26" />
            <InputField label="P. plato" value={platoPressure} onChange={setPlatoPressure} placeholder="20" />
            <InputField label="VT (mL)" value={tidalVolume} onChange={setTidalVolume} placeholder="420" />
            <InputField label="Fluxo (L/min)" value={flow} onChange={setFlow} placeholder="60" />
            <InputField label="FiO2 (%)" value={fio2} onChange={setFio2} placeholder="40" />
            <InputField label="PaO2 (mmHg)" value={pao2} onChange={setPao2} placeholder="92" />
            <InputField label="SpO2 (%)" value={spo2} onChange={setSpo2} placeholder="96" />
            <InputField label="VC (mL)" value={vc} onChange={setVc} placeholder="380" />
            <InputField label="Peso (kg)" value={bodyWeight} onChange={setBodyWeight} placeholder="70" />
            <InputField label="Altura (cm)" value={height} onChange={setHeight} placeholder="170" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <SelectField
              label="Sexo"
              value={sex}
              onChange={setSex}
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
              ]}
            />
            <div className="chrome-subtle rounded-[1rem] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/36">VT por peso</p>
              {vcRange ? (
                <div className="mt-3 space-y-2 text-sm text-white/74">
                  <p>
                    Protetor: <span className="font-semibold text-white">{vcRange.protetor}</span>
                  </p>
                  <p>
                    Convencional: <span className="font-semibold text-white">{vcRange.convencional}</span>
                  </p>
                  {idealWeight ? (
                    <p className="text-xs text-white/46">PBW estimado: {idealWeight.toFixed(1)} kg</p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-sm text-white/46">Informe peso ou altura para abrir a faixa ventilatoria.</p>
              )}
            </div>
          </div>
        </div>

        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Gaso e drive</p>
              <h4 className="text-sm font-semibold text-white/88">Acido-base, p0.1, pocc e Glasgow</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="pH" value={gasoPh} onChange={setGasoPh} placeholder="7.36" />
            <InputField label="PaCO2" value={gasoPaCO2} onChange={setGasoPaCO2} placeholder="49" />
            <InputField label="HCO3" value={gasoHCO3} onChange={setGasoHCO3} placeholder="27" />
            <InputField label="P0.1" value={p01} onChange={setP01} placeholder="2.4" />
            <InputField label="Pocc" value={pocc} onChange={setPocc} placeholder="8" />
            <SelectField
              label="Glasgow verbal"
              value={glasgowV}
              onChange={setGlasgowV}
              options={[
                { value: '5', label: '5' },
                { value: '4', label: '4' },
                { value: '3', label: '3' },
                { value: '2', label: '2' },
                { value: '1', label: '1' },
                { value: 'T', label: 'T - Intubado' },
              ]}
            />
            <SelectField
              label="Glasgow ocular"
              value={glasgowO}
              onChange={setGlasgowO}
              options={[
                { value: '4', label: '4' },
                { value: '3', label: '3' },
                { value: '2', label: '2' },
                { value: '1', label: '1' },
              ]}
            />
            <SelectField
              label="Glasgow motor"
              value={glasgowM}
              onChange={setGlasgowM}
              options={[
                { value: '6', label: '6' },
                { value: '5', label: '5' },
                { value: '4', label: '4' },
                { value: '3', label: '3' },
                { value: '2', label: '2' },
                { value: '1', label: '1' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Driving pressure"
          value={metrics.dp !== null ? `${metrics.dp.toFixed(1)} cmH2O` : '—'}
          caption="Pplato - PEEP"
          color="#e5e7eb"
        />
        <MetricCard
          icon={Waves}
          label="Compliance estatica"
          value={metrics.cest !== null ? `${metrics.cest.toFixed(1)} mL/cmH2O` : '—'}
          caption="Vt / delta P"
          color="#38bdf8"
        />
        <MetricCard
          icon={Orbit}
          label="ROX"
          value={metrics.rox !== null ? metrics.rox.toFixed(2) : '—'}
          caption="CNAF e risco de intubacao"
          color="#a78bfa"
        />
        <MetricCard
          icon={HeartPulse}
          label="Mechanical power"
          value={metrics.mechanicalPower !== null ? `${metrics.mechanicalPower.toFixed(1)} J/min` : '—'}
          caption="Energia transmitida ao pulmao"
          color="#f87171"
        />
        <MetricCard
          icon={Wind}
          label="P/F"
          value={metrics.pf !== null ? metrics.pf.toFixed(0) : '—'}
          caption={metrics.pfInterp?.t ?? 'Oxigenacao'}
          color={metrics.pfInterp?.c ?? '#e5e7eb'}
        />
        <MetricCard
          icon={Layers3}
          label="RSBI"
          value={metrics.rsbi !== null ? metrics.rsbi.toFixed(1) : '—'}
          caption={metrics.rsbiInterp?.t ?? 'Desmame'}
          color={metrics.rsbiInterp?.c ?? '#e5e7eb'}
        />
        <MetricCard
          icon={Gauge}
          label="Cdyn / Raw"
          value={
            metrics.cdyn !== null && metrics.raw !== null
              ? `${metrics.cdyn.toFixed(1)} / ${metrics.raw.toFixed(2)}`
              : '—'
          }
          caption="Complacencia dinamica e resistencia"
          color="#facc15"
        />
        <MetricCard
          icon={Brain}
          label="Glasgow"
          value={neuroDrive.glasgow?.total ? String(neuroDrive.glasgow.total) : '—'}
          caption={neuroDrive.glasgow?.interp ?? 'Estado neurologico'}
          color={neuroDrive.glasgow?.cor ?? '#e5e7eb'}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
              <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Wind className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">vm-calcs.js</p>
              <h4 className="text-sm font-semibold text-white/88">Otimizacao de PEEP e stress index</h4>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {peepLevels.map((level, index) => (
              <div key={`peep-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/14 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                  Nivel {index + 1}
                </p>
                <div className="space-y-3">
                  <InputField
                    label="PEEP"
                    value={level.peep}
                    onChange={(value) =>
                      setPeepLevels((prev) =>
                        prev.map((item, itemIndex) => (itemIndex === index ? { ...item, peep: value } : item))
                      )
                    }
                    placeholder="8"
                  />
                  <InputField
                    label="Plato"
                    value={level.plato}
                    onChange={(value) =>
                      setPeepLevels((prev) =>
                        prev.map((item, itemIndex) => (itemIndex === index ? { ...item, plato: value } : item))
                      )
                    }
                    placeholder="20"
                  />
                  <InputField
                    label="Stress index"
                    value={level.si}
                    onChange={(value) =>
                      setPeepLevels((prev) =>
                        prev.map((item, itemIndex) => (itemIndex === index ? { ...item, si: value } : item))
                      )
                    }
                    placeholder="=1"
                  />
                </div>
              </div>
            ))}
          </div>

          {peepOptimization ? (
            <div className="mt-4 rounded-[1.2rem] border p-4" style={metricBoxStyle('#4ade80')}>
              <p className="text-sm font-semibold text-white/92">
                Melhor resposta: nivel {peepOptimization.index + 1}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                PEEP {peepOptimization.peep} | Plato {peepOptimization.plato} | Delta P {peepOptimization.dp.toFixed(1)} | SI {peepOptimization.siLabel}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/46">
              Informe ao menos um nivel completo para calcular a melhor combinacao PEEP / SI.
            </p>
          )}
        </div>

        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">vm-calcs.js</p>
              <h4 className="text-sm font-semibold text-white/88">Updated HACOR + SOFA</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="FC"
              value={hacor.fc}
              onChange={(value) => setHacor((prev) => ({ ...prev, fc: value }))}
              options={[
                { value: 'leq120', label: '<=120 -> 0' },
                { value: 'ge121', label: '>=121 -> +1' },
              ]}
            />
            <SelectField
              label="pH"
              value={hacor.ph}
              onChange={(value) => setHacor((prev) => ({ ...prev, ph: value }))}
              options={[
                { value: 'ge735', label: '>=7.35 -> 0' },
                { value: '730_734', label: '7.30-7.34 -> +2' },
                { value: '725_729', label: '7.25-7.29 -> +3' },
                { value: 'lt725', label: '<7.25 -> +4' },
              ]}
            />
            <SelectField
              label="GCS"
              value={hacor.gcs}
              onChange={(value) => setHacor((prev) => ({ ...prev, gcs: value }))}
              options={[
                { value: '15', label: '15 -> 0' },
                { value: '13_14', label: '13-14 -> +2' },
                { value: '11_12', label: '11-12 -> +5' },
                { value: 'le10', label: '<=10 -> +10' },
              ]}
            />
            <SelectField
              label="PaO2/FiO2"
              value={hacor.oxig}
              onChange={(value) => setHacor((prev) => ({ ...prev, oxig: value }))}
              options={[
                { value: 'ge201', label: '>=201 -> 0' },
                { value: '176_200', label: '176-200 -> +2' },
                { value: '151_175', label: '151-175 -> +3' },
                { value: '126_150', label: '126-150 -> +4' },
                { value: '101_125', label: '101-125 -> +5' },
                { value: 'le100', label: '<=100 -> +6' },
              ]}
            />
            <SelectField
              label="FR"
              value={hacor.fr}
              onChange={(value) => setHacor((prev) => ({ ...prev, fr: value }))}
              options={[
                { value: 'le30', label: '<=30 -> 0' },
                { value: '31_35', label: '31-35 -> +1' },
                { value: '36_40', label: '36-40 -> +2' },
                { value: '41_45', label: '41-45 -> +3' },
                { value: 'ge46', label: '>=46 -> +4' },
              ]}
            />
            <SelectField
              label="Diagnostico"
              value={hacor.dx}
              onChange={(value) => setHacor((prev) => ({ ...prev, dx: value }))}
              options={[
                { value: 'pneumonia', label: 'Pneumonia +2.5' },
                { value: 'choque_septico', label: 'Choque septico +2.5' },
                { value: 'ards', label: 'ARDS +3.0' },
                { value: 'edema_cardiogenico', label: 'Edema cardiogenico -4.0' },
              ]}
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <SelectField
              label="SOFA resp"
              value={sofa.resp}
              onChange={(value) => setSofa((prev) => ({ ...prev, resp: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
            <SelectField
              label="SOFA cns"
              value={sofa.cns}
              onChange={(value) => setSofa((prev) => ({ ...prev, cns: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
            <SelectField
              label="SOFA cardio"
              value={sofa.cardio}
              onChange={(value) => setSofa((prev) => ({ ...prev, cardio: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
            <SelectField
              label="SOFA coag"
              value={sofa.coag}
              onChange={(value) => setSofa((prev) => ({ ...prev, coag: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
            <SelectField
              label="SOFA liver"
              value={sofa.liver}
              onChange={(value) => setSofa((prev) => ({ ...prev, liver: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
            <SelectField
              label="SOFA renal"
              value={sofa.renal}
              onChange={(value) => setSofa((prev) => ({ ...prev, renal: value }))}
              options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))}
            />
          </div>

          {hacorResult ? (
            <div className="mt-4 rounded-[1.2rem] border p-4" style={metricBoxStyle(hacorResult.color)}>
              <p className="text-sm font-semibold text-white/92">
                Updated HACOR {hacorResult.total.toFixed(1)} - {hacorResult.risk}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Probabilidade estimada: {hacorResult.probability} | Base {hacorResult.base} | SOFA {hacorResult.sofaTotal}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/46">
              Preencha os campos do HACOR e do SOFA para abrir o risco de falha da VNI.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Gaso e drive</p>
              <h4 className="text-sm font-semibold text-white/88">Acido-base, p0.1, pocc e pmusc</h4>
            </div>
          </div>

          <div className="space-y-4">
            {gasAnalysis ? (
              <div className="rounded-[1.2rem] border p-4" style={metricBoxStyle(gasAnalysis.cor)}>
                <p className="text-sm font-semibold text-white/92">{gasAnalysis.full}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/66">
                  Analise automatica baseada no bloco clinico do ICU legado.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-3">
              {neuroDrive.p01Interp ? (
                <div className="rounded-[1.15rem] border p-4" style={metricBoxStyle(neuroDrive.p01Interp.c)}>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">P0.1</p>
                  <p className="mt-2 text-sm font-semibold text-white/88">{neuroDrive.p01Interp.t}</p>
                </div>
              ) : null}

              {neuroDrive.poccInterp ? (
                <div className="rounded-[1.15rem] border p-4" style={metricBoxStyle(neuroDrive.poccInterp.c)}>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Pocc</p>
                  <p className="mt-2 text-sm font-semibold text-white/88">{neuroDrive.poccInterp.t}</p>
                </div>
              ) : null}

              {neuroDrive.pmusc !== null && neuroDrive.pmuscInterp ? (
                <div className="rounded-[1.15rem] border p-4" style={metricBoxStyle(neuroDrive.pmuscInterp.c)}>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Pmusc</p>
                  <p className="mt-2 text-sm font-semibold text-white/88">
                    {neuroDrive.pmusc.toFixed(1)} | {neuroDrive.pmuscInterp.t}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="chrome-panel rounded-[1.6rem] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">Mobilidade ICU</p>
              <h4 className="text-sm font-semibold text-white/88">MRC global e escala IMS</h4>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {MRC_FIELDS.map((field) => (
              <SelectField
                key={field.key}
                label={field.label}
                value={mrc[field.key]}
                onChange={(value) => setMrc((prev) => ({ ...prev, [field.key]: value }))}
                options={['0', '1', '2', '3', '4', '5'].map((value) => ({ value, label: value }))}
              />
            ))}
          </div>

          <div className="mt-4">
            <SelectField label="IMS" value={imsScore} onChange={setImsScore} options={IMS_OPTIONS} />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {mrcResult ? (
              <div className="rounded-[1.15rem] border p-4" style={metricBoxStyle(mrcResult.color)}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">MRC</p>
                <p className="mt-2 text-sm font-semibold text-white/88">
                  {mrcResult.total}/60 - {mrcResult.text}
                </p>
              </div>
            ) : null}

            {imsResult ? (
              <div className="rounded-[1.15rem] border p-4" style={metricBoxStyle(imsResult.color)}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">IMS</p>
                <p className="mt-2 text-sm font-semibold text-white/88">
                  {imsResult.value}/10 - {imsResult.text}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
