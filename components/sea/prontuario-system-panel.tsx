'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  BookOpen,
  Eye,
  FileText,
  PencilLine,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'
import { ICUSystemPanel } from '@/components/sea/icu-system-panel'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  calcCest,
  calcDP,
  calcGlasgow,
  calcPesoIdeal,
  calcPF,
  calcRSBI,
  emptyPatient,
  interpPF,
  interpRSBI,
  type PatientData,
} from '@/lib/icu-calcs'

type PatientRecord = {
  id: number
  patientName: string
  recordNumber: string
  diagnosis: string
  createdAt: string
}

const INITIAL_RECORDS: PatientRecord[] = [
  {
    id: 1,
    patientName: 'João Silva',
    recordNumber: 'REC-001-2026',
    diagnosis: 'Insuficiencia Respiratoria',
    createdAt: '2026-03-10',
  },
  {
    id: 2,
    patientName: 'Maria Santos',
    recordNumber: 'REC-002-2026',
    diagnosis: 'SDRA em ventilacao mecanica',
    createdAt: '2026-03-11',
  },
  {
    id: 3,
    patientName: 'Pedro Oliveira',
    recordNumber: 'REC-003-2026',
    diagnosis: 'Pos-operatorio cardiaco com suporte ventilatorio',
    createdAt: '2026-03-12',
  },
]

function ActionButton({
  icon: Icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: typeof Activity
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[1rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all ${
        active
          ? 'border-white/18 bg-white/12 text-white'
          : 'border-white/10 bg-black/18 text-white/62 hover:border-white/16 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {typeof badge === 'number' && badge > 0 ? (
        <span className="rounded-full border border-white/12 px-1.5 py-0.5 text-[9px] text-white/74">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function ProntuarioSystemPanel() {
  const [view, setView] = useState<'records' | 'reference' | 'trash'>('records')
  const [activeTab, setActiveTab] = useState<'lista' | 'calculadora'>('lista')
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_RECORDS)
  const [trash, setTrash] = useState<PatientRecord[]>([])
  const [patientData, setPatientData] = useState<PatientData>(emptyPatient())

  const calculations = useMemo(() => {
    const pesoIdeal = patientData.altura
      ? calcPesoIdeal(parseFloat(patientData.altura) || 0, patientData.sexo || 'M')
      : 0
    const pf = calcPF(parseFloat(patientData.gasoPaO2) || 0, parseFloat(patientData.gasoFiO2) || 0)
    const pfInterp = pf ? interpPF(pf) : null
    const dp = calcDP(parseFloat(patientData.pplato) || 0, parseFloat(patientData.peep) || 0)
    const cest = calcCest(parseFloat(patientData.vt) || 0, dp || 0)
    const glasgow = calcGlasgow(
      parseFloat(patientData.glasgowO) || 0,
      patientData.glasgowV || 'T',
      parseFloat(patientData.glasgowM) || 0
    )
    const rsbi = calcRSBI(parseFloat(patientData.fr) || 0, parseFloat(patientData.vc) || 0)
    const rsbiInterp = rsbi ? interpRSBI(rsbi) : null

    return { pesoIdeal, pf, pfInterp, dp, cest, glasgow, rsbi, rsbiInterp }
  }, [patientData])

  const handleInputChange = (field: string, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const addRecord = () => {
    const nextIndex = records.length + trash.length + 1
    const padded = String(nextIndex).padStart(3, '0')

    setRecords((prev) => [
      {
        id: Date.now(),
        patientName: `Novo Paciente ${padded}`,
        recordNumber: `REC-${padded}-2026`,
        diagnosis: 'Aguardando preenchimento clinico',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    setView('records')
    setActiveTab('lista')
  }

  const moveToTrash = (id: number) => {
    setRecords((prev) => {
      const target = prev.find((record) => record.id === id)
      if (!target) return prev
      setTrash((current) => [target, ...current])
      return prev.filter((record) => record.id !== id)
    })
  }

  const restoreRecord = (id: number) => {
    setTrash((prev) => {
      const target = prev.find((record) => record.id === id)
      if (!target) return prev
      setRecords((current) => [target, ...current])
      return prev.filter((record) => record.id !== id)
    })
    setView('records')
  }

  const deletePermanently = (id: number) => {
    setTrash((prev) => prev.filter((record) => record.id !== id))
  }

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
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
                O prontuario continua como nucleo do sistema. A referencia clinica abre separada por botao, como apoio para problemas e planejamento terapeutico.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              icon={Trash2}
              label="Lixeira"
              badge={trash.length}
              active={view === 'trash'}
              onClick={() => setView('trash')}
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
        ) : view === 'trash' ? (
          <div className="space-y-4">
            {trash.length ? (
              trash.map((record) => (
                <div
                  key={record.id}
                  className="chrome-panel flex flex-col gap-4 rounded-[1.35rem] p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="chrome-subtle flex h-12 w-12 items-center justify-center rounded-[1rem]">
                      <Trash2 className="h-5 w-5 text-white/72" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white/88">{record.patientName}</p>
                      <p className="mt-1 text-sm text-white/58">{record.recordNumber}</p>
                      <p className="mt-2 text-sm text-white/56">{record.diagnosis}</p>
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
                      <X className="h-4 w-4" />
                      Apagar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="chrome-panel rounded-[1.45rem] p-8 text-center">
                <p className="text-sm text-white/56">Lixeira vazia.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex gap-2 border-b border-white/8 pb-2">
              <button
                onClick={() => setActiveTab('lista')}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  activeTab === 'lista' ? 'bg-white/10 text-white' : 'text-white/48 hover:text-white/76'
                }`}
              >
                Prontuarios
              </button>
              <button
                onClick={() => setActiveTab('calculadora')}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  activeTab === 'calculadora' ? 'bg-white/10 text-white' : 'text-white/48 hover:text-white/76'
                }`}
              >
                Calculadora ICU
              </button>
            </div>

            {activeTab === 'lista' ? (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="chrome-panel flex flex-col gap-4 rounded-[1.35rem] p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="flex min-w-0 gap-4">
                      <div className="chrome-subtle flex h-12 w-12 items-center justify-center rounded-[1rem]">
                        <FileText className="h-5 w-5 text-white/72" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-white/88">{record.patientName}</p>
                        <p className="mt-1 text-sm text-white/58">{record.recordNumber}</p>
                        <p className="mt-2 text-sm text-white/56">{record.diagnosis}</p>
                        <p className="mt-2 text-xs text-white/38">Criado em: {record.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </button>
                      <button className="chrome-subtle inline-flex items-center gap-2 rounded-[1rem] border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72">
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => moveToTrash(record.id)}
                        className="inline-flex items-center gap-2 rounded-[1rem] border border-[#f8717130] bg-[#f8717110] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fca5a5]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Lixeira
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Nome</Label>
                    <Input
                      placeholder="Nome do paciente"
                      value={patientData.nome || ''}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Idade</Label>
                    <Input
                      type="number"
                      placeholder="Idade"
                      value={patientData.idade || ''}
                      onChange={(e) => handleInputChange('idade', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Altura</Label>
                    <Input
                      type="number"
                      placeholder="Altura"
                      value={patientData.altura || ''}
                      onChange={(e) => handleInputChange('altura', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Sexo</Label>
                    <select
                      value={patientData.sexo || 'M'}
                      onChange={(e) => handleInputChange('sexo', e.target.value)}
                      className="w-full rounded-[1rem] border border-white/20 bg-white/10 px-3 py-2 text-white text-sm"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">PaO2</Label>
                    <Input
                      type="number"
                      value={patientData.gasoPaO2 || ''}
                      onChange={(e) => handleInputChange('gasoPaO2', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">FiO2</Label>
                    <Input
                      type="number"
                      value={patientData.gasoFiO2 || ''}
                      onChange={(e) => handleInputChange('gasoFiO2', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">FR</Label>
                    <Input
                      type="number"
                      value={patientData.fr || ''}
                      onChange={(e) => handleInputChange('fr', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">VT</Label>
                    <Input
                      type="number"
                      value={patientData.vt || ''}
                      onChange={(e) => handleInputChange('vt', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">PEEP</Label>
                    <Input
                      type="number"
                      value={patientData.peep || ''}
                      onChange={(e) => handleInputChange('peep', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Pplato</Label>
                    <Input
                      type="number"
                      value={patientData.pplato || ''}
                      onChange={(e) => handleInputChange('pplato', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">VC</Label>
                    <Input
                      type="number"
                      value={patientData.vc || ''}
                      onChange={(e) => handleInputChange('vc', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Glasgow O</Label>
                    <Input
                      type="number"
                      value={patientData.glasgowO || ''}
                      onChange={(e) => handleInputChange('glasgowO', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Glasgow V</Label>
                    <Input
                      value={patientData.glasgowV || ''}
                      onChange={(e) => handleInputChange('glasgowV', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-xs">Glasgow M</Label>
                    <Input
                      type="number"
                      value={patientData.glasgowM || ''}
                      onChange={(e) => handleInputChange('glasgowM', e.target.value)}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <GlassPanel className="min-h-[8.5rem]">
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Peso ideal</p>
                      <p className="text-2xl font-bold text-white">{calculations.pesoIdeal.toFixed(1)} kg</p>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="min-h-[8.5rem]">
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider">P/F</p>
                      <p className="text-2xl font-bold text-white">{calculations.pf?.toFixed(0) || '—'}</p>
                      <p className="text-white/50 text-xs">{calculations.pfInterp?.t}</p>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="min-h-[8.5rem]">
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider">RSBI</p>
                      <p className="text-2xl font-bold text-white">{calculations.rsbi?.toFixed(1) || '—'}</p>
                      <p className="text-white/50 text-xs">{calculations.rsbiInterp?.t}</p>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="min-h-[8.5rem]">
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Compliance / Glasgow</p>
                      <p className="text-2xl font-bold text-white">
                        {calculations.cest?.toFixed(1) || '—'}
                        {calculations.cest ? ' mL/cmH2O' : ''}
                      </p>
                      <p className="text-white/50 text-xs">
                        {calculations.glasgow ? `GCS ${calculations.glasgow.total} - ${calculations.glasgow.interp}` : `DP ${calculations.dp ?? '—'}`}
                      </p>
                    </div>
                  </GlassPanel>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
