{/* Índices Calculados */ }
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <GlassPanel>
  </GlassPanel>
  ...existing code...
</div>
{/* Botões menores em uma linha após área de pacientes/referência clínica */ }
<div className="flex flex-row gap-2 mb-4">
  <Button variant="outline" size="xs" className="text-xs px-2 py-1">Arquivo</Button>
  <Button variant="outline" size="xs" className="text-xs px-2 py-1">Referência Clínica</Button>
  <Button variant="outline" size="xs" className="text-xs px-2 py-1">Adicionar</Button>
</div>
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { BottomNav } from '@/components/sea/bottom-nav'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import {
  calcPesoIdeal,
  calcPF,
  interpPF,
  calcDP,
  calcCest,
  calcGlasgow,
  calcRSBI,
  interpRSBI,
  emptyPatient,
  type PatientData,
} from '@/lib/icu-calcs'

const mockProntuarios = [
  {
    id: 1,
    patientName: 'João Silva',
    recordNumber: 'REC-001-2024',
    diagnosis: 'Insuficiência Respiratória',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    patientName: 'Maria Santos',
    recordNumber: 'REC-002-2024',
    diagnosis: 'Síndrome do Desconforto Respiratório',
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    patientName: 'Pedro Oliveira',
    recordNumber: 'REC-003-2024',
    diagnosis: 'Pneumonia Viral',
    createdAt: '2024-01-13',
  },
]

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState('lista')
  const [patientData, setPatientData] = useState<PatientData>(emptyPatient())

  // Cálculos clínicos
  const calculations = useMemo(() => {
    const pesoIdeal = patientData.altura ? calcPesoIdeal(parseFloat(patientData.altura) || 0, patientData.sexo || 'M') : 0
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

  return (
    <div className="min-h-screen pb-20 bg-[#0a0a0a]">
      <GreetingHeader userName="Usuário" />

      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">
                Prontuários Eletrônicos e Calculadora ICU
              </h1>
              <p className="text-white/60">
                Gerencie registros clínicos e calcule índices de gravidade em tempo real.
              </p>
            </div>
            <Button className="gap-2 bg-white/10 hover:bg-white/20 text-white">
              <Plus className="w-4 h-4" />
              Novo
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'lista' ? 'text-white border-b-2 border-white' : 'text-white/50'
              }`}
          >
            Prontuários
          </button>
          <button
            onClick={() => setActiveTab('calculadora')}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'calculadora' ? 'text-white border-b-2 border-white' : 'text-white/50'
              }`}
          >
            Calculadora ICU
          </button>
        </div>

        {/* Lista de Prontuários */}
        {activeTab === 'lista' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {mockProntuarios.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-md"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <FileText className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">{record.patientName}</h3>
                    <p className="text-sm text-white/70">ID: {record.recordNumber}</p>
                    <p className="text-sm text-white/60 mt-1">{record.diagnosis}</p>
                    <p className="text-xs text-white/40 mt-2">Criado em: {record.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Visualizar
                    </Button>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Calculadora ICU */}
        {activeTab === 'calculadora' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Dados Demográficos */}
            <GlassPanel
              title="Dados Demográficos"
              subtitle="Informações do paciente"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <Label className="text-white/70 text-xs">Idade (anos)</Label>
                  <Input
                    type="number"
                    placeholder="Idade"
                    value={patientData.idade || ''}
                    onChange={(e) => handleInputChange('idade', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">Altura (cm)</Label>
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
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>
            </GlassPanel>

            {/* Gasometria */}
            <GlassPanel
              title="Gasometria Arterial"
              subtitle="Dados laboratoriais"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">PaO₂ (mmHg)</Label>
                  <Input
                    type="number"
                    placeholder="PaO₂"
                    value={patientData.gasoPaO2 || ''}
                    onChange={(e) => handleInputChange('gasoPaO2', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">FiO₂ (%)</Label>
                  <Input
                    type="number"
                    placeholder="FiO₂"
                    value={patientData.gasoFiO2 || ''}
                    onChange={(e) => handleInputChange('gasoFiO2', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">PaCO₂ (mmHg)</Label>
                  <Input
                    type="number"
                    placeholder="PaCO₂"
                    value={patientData.gasoPaCO2 || ''}
                    onChange={(e) => handleInputChange('gasoPaCO2', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">pH</Label>
                  <Input
                    type="number"
                    placeholder="pH"
                    step="0.01"
                    value={patientData.gasoPH || ''}
                    onChange={(e) => handleInputChange('gasoPH', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </div>
            </GlassPanel>

            {/* Ventilação */}
            <GlassPanel
              title="Parâmetros de Ventilação"
              subtitle="Dados de VM"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">FR (ciclos/min)</Label>
                  <Input
                    type="number"
                    placeholder="FR"
                    value={patientData.fr || ''}
                    onChange={(e) => handleInputChange('fr', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">VT (mL)</Label>
                  <Input
                    type="number"
                    placeholder="VT"
                    value={patientData.vt || ''}
                    onChange={(e) => handleInputChange('vt', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">PEEP (cmH₂O)</Label>
                  <Input
                    type="number"
                    placeholder="PEEP"
                    value={patientData.peep || ''}
                    onChange={(e) => handleInputChange('peep', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">Platô (cmH₂O)</Label>
                  <Input
                    type="number"
                    placeholder="Platô"
                    value={patientData.pplato || ''}
                    onChange={(e) => handleInputChange('pplato', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">VC (mL)</Label>
                  <Input
                    type="number"
                    placeholder="VC"
                    value={patientData.vc || ''}
                    onChange={(e) => handleInputChange('vc', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </div>
            </GlassPanel>

            {/* Escala Glasgow */}
            <GlassPanel
              title="Escala de Glasgow"
              subtitle="Estado neurológico"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">Olhos (1-4)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    placeholder="O"
                    value={patientData.glasgowO || ''}
                    onChange={(e) => handleInputChange('glasgowO', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">Verbal (1-5/T)</Label>
                  <Input
                    placeholder="V"
                    value={patientData.glasgowV || ''}
                    onChange={(e) => handleInputChange('glasgowV', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs">Motor (1-6)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="M"
                    value={patientData.glasgowM || ''}
                    onChange={(e) => handleInputChange('glasgowM', e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </div>
              {calculations.glasgow && (
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-white/70 text-xs">Total: <span className="text-white font-semibold">{calculations.glasgow.total}</span></p>
                  <p className="text-white/70 text-xs">
                    Interpretação: <span style={{ color: calculations.glasgow.cor }} className="font-semibold">{calculations.glasgow.interp}</span>
                  </p>
                </div>
              )}
            </GlassPanel>

            {/* Índices Calculados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassPanel>
                <div className="space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">Peso Ideal</p>
                  <p className="text-2xl font-bold text-white">{calculations.pesoIdeal.toFixed(1)} kg</p>
                </div>
              </GlassPanel>

              <GlassPanel>
                <div className="space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">P/F Ratio</p>
                  <p className="text-2xl font-bold text-white">{calculations.pf?.toFixed(0) || '—'}</p>
                  <p className="text-white/50 text-xs">{calculations.pfInterp?.t}</p>
                </div>
              </GlassPanel>

              <GlassPanel>
                <div className="space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">RSBI</p>
                  <p className="text-2xl font-bold text-white">{calculations.rsbi?.toFixed(1) || '—'}</p>
                  <p className="text-white/50 text-xs">{calculations.rsbiInterp?.t}</p>
                </div>
              </GlassPanel>

              <GlassPanel>
                <div className="space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">Compliance</p>
                  <p className="text-2xl font-bold text-white">{calculations.cest?.toFixed(1) || '—'} mL/cmH₂O</p>
                </div>
              </GlassPanel>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <GlassPanel title="Segurança" subtitle="Conformidade regulatória">
            <ul className="space-y-2 text-xs text-white/70">
              <li>Criptografia de ponta a ponta</li>
              <li>HIPAA / LGPD compliant</li>
              <li>Backup automático</li>
              <li>Auditoria de acesso</li>
            </ul>
          </GlassPanel>
          <GlassPanel title="Recursos" subtitle="Funcionalidades">
            <ul className="space-y-2 text-xs text-white/70">
              <li>Cálculos automáticos de índices</li>
              <li>Histórico completo de alterações</li>
              <li>Exportar em PDF/Excel</li>
              <li>Integração com sistema de alerta</li>
            </ul>
          </GlassPanel>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
