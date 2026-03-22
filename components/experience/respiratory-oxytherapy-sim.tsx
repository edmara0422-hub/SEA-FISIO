'use client'

import { useState } from 'react'

/* ─── Device data ─── */

interface Device {
  id: string
  name: string
  type: 'low' | 'high'
  flow: string
  fio2: string
  fio2Range: [number, number]
  characteristics: string[]
  indications: string[]
  icon: string
}

const DEVICES: Device[] = [
  {
    id: 'canula', name: 'Cânula Nasal', type: 'low', flow: '1-6 L/min', fio2: '24-44%',
    fio2Range: [24, 44], icon: '👃',
    characteristics: ['2 tubos inseridos nas narinas', 'Conforto e economia', 'Até 4L/min sem umidificação', '≤5L não exige umidificação', 'Cada 1L/min ≈ +4% FiO₂'],
    indications: ['Hipoxemia leve a moderada', 'Uso prolongado/domiciliar', 'Mais tolerado em lactentes e crianças'],
  },
  {
    id: 'mascara_simples', name: 'Máscara Facial Simples', type: 'low', flow: '5-10 L/min', fio2: '40-60%',
    fio2Range: [40, 60], icon: '😷',
    characteristics: ['Cobre nariz e boca', 'Fluxo mínimo 5L/min (evitar reinalação CO₂)', 'Orifícios laterais para expiração', 'FiO₂ variável com padrão respiratório'],
    indications: ['Hipoxemia moderada', 'Curta duração', 'Emergências iniciais'],
  },
  {
    id: 'reservatorio', name: 'Máscara com Reservatório', type: 'low', flow: '10-15 L/min', fio2: '60-100%',
    fio2Range: [60, 100], icon: '🎭',
    characteristics: ['Bolsa reservatório de 600-1000mL', 'Válvulas unidirecionais (não-reinalação)', 'Maior FiO₂ dos dispositivos de baixo fluxo', 'Bolsa deve permanecer inflada (>2/3)'],
    indications: ['Hipoxemia grave', 'Emergências', 'Pré-intubação', 'Insuficiência respiratória aguda'],
  },
  {
    id: 'ambu', name: 'Bolsa Reanimadora (AMBÚ)', type: 'low', flow: '15 L/min', fio2: '21-100%',
    fio2Range: [21, 100], icon: '🫁',
    characteristics: ['Ventilação manual', 'Com reservatório: até 100% FiO₂', 'Sem reservatório: ~21% (ar ambiente)', 'Uso em emergências e transporte'],
    indications: ['PCR (parada cardiorrespiratória)', 'Ventilação de resgate', 'Transporte de pacientes graves'],
  },
  {
    id: 'venturi', name: 'Máscara de Venturi', type: 'high', flow: 'Variável', fio2: '24-50%',
    fio2Range: [24, 50], icon: '🎯',
    characteristics: ['FiO₂ PRECISA e controlada', 'Princípio Venturi: mescla O₂ com ar ambiente', 'Peças coloridas com concentração específica', 'Cada peça = 1 FiO₂ fixa', 'Troca de peça conforme evolução'],
    indications: ['DPOC com retenção de CO₂ (PRINCIPAL)', 'Necessidade de FiO₂ precisa', 'Hipercapnia — evita supressão do drive hipóxico'],
  },
  {
    id: 'alto_fluxo', name: 'Cateter Nasal de Alto Fluxo', type: 'high', flow: 'Até 60 L/min', fio2: '21-100%',
    fio2Range: [21, 100], icon: '💨',
    characteristics: ['Fluxo aquecido e umidificado', 'FiO₂ ajustável de 21-100%', 'Gera pressão positiva (PEEP ~2-5 cmH₂O)', 'Reduz espaço morto anatômico', 'Melhora mucociliar'],
    indications: ['Insuficiência respiratória hipoxêmica', 'Pós-extubação', 'Alternativa à VNI em casos selecionados'],
  },
]

const VENTURI_COLORS = [
  { color: '#3B82F6', fio2: 24, flow: 3, label: 'Azul' },
  { color: '#FBBF24', fio2: 28, flow: 6, label: 'Amarelo' },
  { color: '#F97316', fio2: 31, flow: 8, label: 'Laranja' },
  { color: '#EF4444', fio2: 35, flow: 10, label: 'Vermelho' },
  { color: '#EC4899', fio2: 40, flow: 12, label: 'Rosa' },
  { color: '#A855F7', fio2: 50, flow: 15, label: 'Roxo' },
]

/* ─── Component ─── */

export function RespiratoryOxytherapySim({ className }: { className?: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const device = selected ? DEVICES.find(d => d.id === selected) : null

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(2, 6, 12, 0.94)' }}>
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest">OXYTHERAPY.DEVICES</span>
            <span className="text-[8px] font-mono text-teal-400/50">▸ INTERATIVO</span>
          </div>
        </div>

        {/* Device Grid */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Low Flow */}
            <div>
              <div className="text-[8px] font-mono font-bold text-cyan-400/50 uppercase tracking-wider mb-1.5">⬇ Baixo Fluxo — FiO₂ Variável</div>
              <div className="space-y-1.5">
                {DEVICES.filter(d => d.type === 'low').map(d => (
                  <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition-all border ${
                      selected === d.id
                        ? 'bg-white/[0.06] border-cyan-500/30'
                        : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{d.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-mono font-semibold truncate ${selected === d.id ? 'text-white/80' : 'text-white/45'}`}>{d.name}</div>
                        <div className="flex gap-3 mt-0.5">
                          <span className="text-[8px] font-mono text-white/25">{d.flow}</span>
                          <span className={`text-[8px] font-mono font-bold ${selected === d.id ? 'text-cyan-400/70' : 'text-cyan-400/30'}`}>{d.fio2}</span>
                        </div>
                      </div>
                      {/* FiO2 bar */}
                      <div className="w-12 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-400/30" style={{ width: `${d.fio2Range[1]}%` }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* High Flow */}
            <div>
              <div className="text-[8px] font-mono font-bold text-yellow-400/50 uppercase tracking-wider mb-1.5">⬆ Alto Fluxo — FiO₂ Controlada</div>
              <div className="space-y-1.5">
                {DEVICES.filter(d => d.type === 'high').map(d => (
                  <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition-all border ${
                      selected === d.id
                        ? 'bg-white/[0.06] border-yellow-500/30'
                        : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{d.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-mono font-semibold truncate ${selected === d.id ? 'text-white/80' : 'text-white/45'}`}>{d.name}</div>
                        <div className="flex gap-3 mt-0.5">
                          <span className="text-[8px] font-mono text-white/25">{d.flow}</span>
                          <span className={`text-[8px] font-mono font-bold ${selected === d.id ? 'text-yellow-400/70' : 'text-yellow-400/30'}`}>{d.fio2}</span>
                        </div>
                      </div>
                      <div className="w-12 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-yellow-400/30" style={{ width: `${d.fio2Range[1]}%` }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Venturi Colors */}
              <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                <div className="text-[8px] font-mono font-bold text-yellow-400/40 uppercase tracking-wider mb-2">Peças Venturi</div>
                <div className="grid grid-cols-3 gap-1">
                  {VENTURI_COLORS.map(v => (
                    <div key={v.fio2} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/[0.02]">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.color, opacity: 0.7 }} />
                      <div>
                        <div className="text-[7px] font-mono text-white/40 font-semibold">{v.fio2}%</div>
                        <div className="text-[6px] font-mono text-white/20">{v.flow}L/min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {device && (
          <div className="mx-4 mb-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{device.icon}</span>
              <div>
                <div className="text-[11px] font-mono font-bold text-white/85">{device.name}</div>
                <div className="flex gap-3">
                  <span className="text-[9px] font-mono text-white/35">{device.flow}</span>
                  <span className={`text-[9px] font-mono font-bold ${device.type === 'high' ? 'text-yellow-400/60' : 'text-cyan-400/60'}`}>FiO₂: {device.fio2}</span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${device.type === 'high' ? 'bg-yellow-400/10 text-yellow-400/50' : 'bg-cyan-400/10 text-cyan-400/50'}`}>
                    {device.type === 'high' ? 'ALTO FLUXO' : 'BAIXO FLUXO'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[7px] font-mono text-white/25 uppercase tracking-wider mb-1">Características</div>
                {device.characteristics.map((c, i) => (
                  <div key={i} className="text-[8px] font-mono text-white/40 leading-relaxed">▸ {c}</div>
                ))}
              </div>
              <div>
                <div className="text-[7px] font-mono text-white/25 uppercase tracking-wider mb-1">Indicações</div>
                {device.indications.map((ind, i) => (
                  <div key={i} className="text-[8px] font-mono text-white/40 leading-relaxed">✓ {ind}</div>
                ))}
              </div>
            </div>
            {/* FiO2 range bar */}
            <div className="mt-2 pt-2 border-t border-white/[0.04]">
              <div className="text-[7px] font-mono text-white/20 mb-1">Range FiO₂</div>
              <div className="w-full h-2 rounded-full bg-white/[0.04] relative overflow-hidden">
                <div className="absolute top-0 h-full rounded-full"
                  style={{
                    left: `${device.fio2Range[0]}%`,
                    width: `${device.fio2Range[1] - device.fio2Range[0]}%`,
                    background: device.type === 'high'
                      ? 'linear-gradient(90deg, rgba(250,204,21,0.3), rgba(250,204,21,0.5))'
                      : 'linear-gradient(90deg, rgba(34,211,238,0.3), rgba(34,211,238,0.5))',
                  }} />
                {/* 21% marker */}
                <div className="absolute top-0 h-full w-px bg-white/10" style={{ left: '21%' }} />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[6px] font-mono text-white/15">21% (ar ambiente)</span>
                <span className="text-[6px] font-mono text-white/15">100%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
