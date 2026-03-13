'use client'

import { useMemo, useState } from 'react'
import { Activity, Gauge, HeartPulse, Layers3, Wind } from 'lucide-react'
import {
  analisarGaso,
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
    return { value: 1, label: '=1', ok: true }
  }

  if (normalized === '>1') {
    return { value: 1.2, label: '>1', ok: false }
  }

  if (normalized === '<1') {
    return { value: 0.8, label: '<1', ok: false }
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

function toneClass(color?: string) {
  if (color === '#4ade80') return 'border-[#4ade8030] bg-[#4ade8010] text-[#86efac]'
  if (color === '#facc15') return 'border-[#facc1530] bg-[#facc150f] text-[#fde68a]'
  if (color === '#fb923c') return 'border-[#fb923c30] bg-[#fb923c10] text-[#fdba74]'
  if (color === '#f87171') return 'border-[#f8717130] bg-[#f8717110] text-[#fca5a5]'
  if (color === '#60a5fa') return 'border-[#60a5fa30] bg-[#60a5fa10] text-[#93c5fd]'
  return 'border-white/10 bg-white/[0.04] text-white/84'
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

function CompactMetric({
  label,
  value,
  hint,
  color,
}: {
  label: string
  value: string
  hint?: string
  color?: string
}) {
  return (
    <div className={`rounded-[1.1rem] border p-3 ${toneClass(color)}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs opacity-70">{hint}</p> : null}
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof Activity
  eyebrow: string
  title: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">{eyebrow}</p>
        <h4 className="text-sm font-semibold text-white/88">{title}</h4>
      </div>
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
  const [peepLevels, setPeepLevels] = useState<PeepLevel[]>(INITIAL_PEEP_LEVELS)
  const [hacor, setHacor] = useState<HacorState>(INITIAL_HACOR)
  const [sofa, setSofa] = useState<SofaState>(INITIAL_SOFA)

  const idealWeight = useMemo(() => {
    const parsedHeight = parseNumber(height)
    if (parsedHeight === null) {
      return null
    }

    return calcPesoIdeal(parsedHeight, sex)
  }, [height, sex])

  const vtWindow = useMemo(() => {
    if (!idealWeight) {
      return null
    }

    return {
      low: Math.round(idealWeight * 4),
      high: Math.round(idealWeight * 6),
      pbw: idealWeight.toFixed(1),
    }
  }, [idealWeight])

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

  const driveMetrics = useMemo(() => {
    const parsedP01 = parseNumber(p01)
    const parsedPocc = parseNumber(pocc)
    const pmusc = parsedPocc !== null ? calcPmusc(parsedPocc) : null

    return {
      p01Interp: parsedP01 !== null ? interpP01(parsedP01) : null,
      poccInterp: parsedPocc !== null ? interpPocc(parsedPocc) : null,
      pmusc,
      pmuscInterp: pmusc !== null ? interpPmusc(pmusc) : null,
    }
  }, [p01, pocc])

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
          score,
        }
      })
      .filter(Boolean) as {
      index: number
      peep: number
      plato: number
      dp: number
      siLabel: string
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
      total,
      risk,
      color,
      probability,
      sofaTotal,
    }
  }, [hacor, sofa])

  return (
    <div className="space-y-5">
      <div className="chrome-panel rounded-[1.6rem] p-5">
        <SectionHeader icon={Wind} eyebrow="S2" title="Base ventilatoria" />

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <InputField label="FR (rpm)" value={fr} onChange={setFr} placeholder="16" />
          <InputField label="PEEP" value={peep} onChange={setPeep} placeholder="8" />
          <InputField label="P. pico" value={peakPressure} onChange={setPeakPressure} placeholder="26" />
          <InputField label="P. plato" value={platoPressure} onChange={setPlatoPressure} placeholder="20" />
          <InputField label="VT (mL)" value={tidalVolume} onChange={setTidalVolume} placeholder="420" />
          <InputField label="Fluxo (L/min)" value={flow} onChange={setFlow} placeholder="60" />
          <InputField label="FiO2 (%)" value={fio2} onChange={setFio2} placeholder="40" />
          <InputField label="PaO2" value={pao2} onChange={setPao2} placeholder="92" />
          <InputField label="SpO2 (%)" value={spo2} onChange={setSpo2} placeholder="96" />
          <InputField label="VC espont. (mL)" value={vc} onChange={setVc} placeholder="380" />
          <InputField label="Peso (kg)" value={bodyWeight} onChange={setBodyWeight} placeholder="70" />
          <InputField label="Altura (cm)" value={height} onChange={setHeight} placeholder="170" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <SelectField
            label="Sexo"
            value={sex}
            onChange={setSex}
            options={[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Feminino' },
            ]}
          />
          <CompactMetric
            label="VT por peso"
            value={vtWindow ? `${vtWindow.low}-${vtWindow.high} mL` : 'Informe altura'}
            hint={vtWindow ? `PBW ${vtWindow.pbw} kg` : undefined}
            color="#60a5fa"
          />
          <CompactMetric
            label="Delta P"
            value={metrics.dp !== null ? `${metrics.dp.toFixed(1)} cmH2O` : '—'}
            color={metrics.dp !== null ? (metrics.dp < 12 ? '#4ade80' : metrics.dp <= 15 ? '#facc15' : '#f87171') : undefined}
          />
          <CompactMetric
            label="Cest"
            value={metrics.cest !== null ? `${metrics.cest.toFixed(1)} mL/cmH2O` : '—'}
            color="#60a5fa"
          />
          <CompactMetric
            label="P/F"
            value={metrics.pf !== null ? metrics.pf.toFixed(0) : '—'}
            hint={metrics.pfInterp?.t}
            color={metrics.pfInterp?.c}
          />
          <CompactMetric
            label="ROX"
            value={metrics.rox !== null ? metrics.rox.toFixed(2) : '—'}
            color="#a78bfa"
          />
          <CompactMetric
            label="RSBI"
            value={metrics.rsbi !== null ? metrics.rsbi.toFixed(1) : '—'}
            hint={metrics.rsbiInterp?.t}
            color={metrics.rsbiInterp?.c}
          />
          <CompactMetric
            label="Cdyn / Raw"
            value={metrics.cdyn !== null && metrics.raw !== null ? `${metrics.cdyn.toFixed(1)} / ${metrics.raw.toFixed(2)}` : '—'}
            color="#facc15"
          />
          <CompactMetric
            label="Mechanical power"
            value={metrics.mechanicalPower !== null ? `${metrics.mechanicalPower.toFixed(1)} J/min` : '—'}
            color="#f87171"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="chrome-panel rounded-[1.6rem] p-5">
          <SectionHeader icon={Gauge} eyebrow="S2" title="Gaso e drive" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InputField label="pH" value={gasoPh} onChange={setGasoPh} placeholder="7.36" />
            <InputField label="PaCO2" value={gasoPaCO2} onChange={setGasoPaCO2} placeholder="49" />
            <InputField label="HCO3" value={gasoHCO3} onChange={setGasoHCO3} placeholder="27" />
            <InputField label="P0.1" value={p01} onChange={setP01} placeholder="2.4" />
            <InputField label="Pocc" value={pocc} onChange={setPocc} placeholder="8" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <CompactMetric
              label="Analise"
              value={gasAnalysis ? gasAnalysis.full : 'Preencha pH, PaCO2 e HCO3'}
              color={gasAnalysis?.cor}
            />
            <CompactMetric
              label="P0.1"
              value={driveMetrics.p01Interp ? driveMetrics.p01Interp.t : '—'}
              color={driveMetrics.p01Interp?.c}
            />
            <CompactMetric
              label="Pocc"
              value={driveMetrics.poccInterp ? driveMetrics.poccInterp.t : '—'}
              color={driveMetrics.poccInterp?.c}
            />
            <CompactMetric
              label="Pmusc"
              value={driveMetrics.pmusc !== null && driveMetrics.pmuscInterp ? `${driveMetrics.pmusc.toFixed(1)}` : '—'}
              hint={driveMetrics.pmuscInterp?.t}
              color={driveMetrics.pmuscInterp?.c}
            />
          </div>
        </div>

        <div className="chrome-panel rounded-[1.6rem] p-5">
          <SectionHeader icon={Layers3} eyebrow="vm-calcs.js" title="PEEP + stress index" />

          <div className="grid gap-3 md:grid-cols-3">
            {peepLevels.map((level, index) => (
              <div key={`peep-${index}`} className="rounded-[1.2rem] border border-white/8 bg-black/14 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">Nivel {index + 1}</p>
                <div className="space-y-3">
                  <InputField
                    label="PEEP"
                    value={level.peep}
                    onChange={(value) =>
                      setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, peep: value } : item)))
                    }
                    placeholder="8"
                  />
                  <InputField
                    label="Plato"
                    value={level.plato}
                    onChange={(value) =>
                      setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, plato: value } : item)))
                    }
                    placeholder="20"
                  />
                  <InputField
                    label="Stress index"
                    value={level.si}
                    onChange={(value) =>
                      setPeepLevels((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, si: value } : item)))
                    }
                    placeholder="=1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {peepOptimization ? (
              <CompactMetric
                label={`Melhor nivel ${peepOptimization.index + 1}`}
                value={`PEEP ${peepOptimization.peep} | Plato ${peepOptimization.plato}`}
                hint={`Delta P ${peepOptimization.dp.toFixed(1)} | SI ${peepOptimization.siLabel}`}
                color="#4ade80"
              />
            ) : (
              <CompactMetric
                label="PEEP"
                value="Preencha um nivel completo"
                hint="PEEP + Plato + Stress Index"
              />
            )}
          </div>
        </div>
      </div>

      <div className="chrome-panel rounded-[1.6rem] p-5">
        <SectionHeader icon={HeartPulse} eyebrow="vm-calcs.js" title="Updated HACOR + SOFA" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          <SelectField label="SOFA resp" value={sofa.resp} onChange={(value) => setSofa((prev) => ({ ...prev, resp: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
          <SelectField label="SOFA cns" value={sofa.cns} onChange={(value) => setSofa((prev) => ({ ...prev, cns: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
          <SelectField label="SOFA cardio" value={sofa.cardio} onChange={(value) => setSofa((prev) => ({ ...prev, cardio: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
          <SelectField label="SOFA coag" value={sofa.coag} onChange={(value) => setSofa((prev) => ({ ...prev, coag: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
          <SelectField label="SOFA liver" value={sofa.liver} onChange={(value) => setSofa((prev) => ({ ...prev, liver: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
          <SelectField label="SOFA renal" value={sofa.renal} onChange={(value) => setSofa((prev) => ({ ...prev, renal: value }))} options={['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }))} />
        </div>

        <div className="mt-4">
          {hacorResult ? (
            <CompactMetric
              label="Updated HACOR"
              value={`${hacorResult.total.toFixed(1)} | ${hacorResult.risk}`}
              hint={`Prob. ${hacorResult.probability} | SOFA ${hacorResult.sofaTotal}`}
              color={hacorResult.color}
            />
          ) : (
            <CompactMetric
              label="Updated HACOR"
              value="Preencha HACOR e SOFA"
              hint="Abre o risco de falha da VNI"
            />
          )}
        </div>
      </div>
    </div>
  )
}
