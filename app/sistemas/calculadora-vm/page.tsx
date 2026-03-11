'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PneumoExperience } from '@/components/sea/pneumo-experience'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  calcDP,
  calcCest,
  calcRSBI,
  interpRSBI,
  calcPF,
  interpPF,
  calcROX,
  calcMechanicalPower,
  calcCdyn,
  calcRaw,
} from '@/lib/vm-calcs'

export default function VMCalculatorPage() {
  const [fr, setFr] = useState(16)
  const [peep, setPeep] = useState(5)
  const [peakPressure, setPeakPressure] = useState(25)
  const [platoPressure, setPlatoPressure] = useState(20)
  const [tidalVolume, setTidalVolume] = useState(500)
  const [fio2, setFio2] = useState(40)
  const [pao2, setPao2] = useState(90)
  const [spo2, setSpo2] = useState(95)
  const [vc, setVc] = useState(400)
  const [flow, setFlow] = useState(40)

  // Cálculos derivados
  const calculations = useMemo(() => {
    const dp = calcDP(platoPressure, peep)
    const cest = calcCest(tidalVolume, dp || 0)
    const rsbi = calcRSBI(fr, vc)
    const rsbInterp = rsbi ? interpRSBI(rsbi) : null
    const pf = calcPF(pao2, fio2)
    const pfInterp = pf ? interpPF(pf) : null
    const rox = calcROX(spo2, fio2, fr)
    const mecPower = calcMechanicalPower(tidalVolume, dp || 0, fr)
    const cdyn = calcCdyn(tidalVolume, peakPressure, peep)
    const raw = calcRaw(peakPressure, platoPressure, flow)

    return {
      dp,
      cest,
      rsbi,
      rsbInterp,
      pf,
      pfInterp,
      rox,
      mecPower,
      cdyn,
      raw,
    }
  }, [platoPressure, peep, tidalVolume, fr, vc, fio2, pao2, spo2, peakPressure, flow])

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">
            Calculadora Avançada de Ventilação Mecânica
          </h1>
          <p className="text-white/60">
            Simulação clínica completa com cálculos de parâmetros hemodinâmicos, oxigenação e avaliação de desmame.
          </p>
        </motion.div>

        {/* Primary Controls - Ventilatório */}
        <GlassPanel
          title="Parâmetros Ventilatórios"
          subtitle="Ajuste os parâmetros de VM"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fr" className="text-white/70 text-xs">
                FR (ciclos/min)
              </Label>
              <Input
                id="fr"
                type="range"
                min="6"
                max="40"
                value={fr}
                onChange={(e) => setFr(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{fr}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peep" className="text-white/70 text-xs">
                PEEP (cmH₂O)
              </Label>
              <Input
                id="peep"
                type="range"
                min="0"
                max="20"
                value={peep}
                onChange={(e) => setPeep(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{peep}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peakPressure" className="text-white/70 text-xs">
                Pico (cmH₂O)
              </Label>
              <Input
                id="peakPressure"
                type="range"
                min="15"
                max="50"
                value={peakPressure}
                onChange={(e) => setPeakPressure(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{peakPressure}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plato" className="text-white/70 text-xs">
                Platô (cmH₂O)
              </Label>
              <Input
                id="plato"
                type="range"
                min="10"
                max="40"
                value={platoPressure}
                onChange={(e) => setPlatoPressure(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{platoPressure}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vt" className="text-white/70 text-xs">
                VT (mL)
              </Label>
              <Input
                id="vt"
                type="range"
                min="300"
                max="800"
                value={tidalVolume}
                onChange={(e) => setTidalVolume(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{tidalVolume}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flow" className="text-white/70 text-xs">
                Fluxo (L/min)
              </Label>
              <Input
                id="flow"
                type="range"
                min="20"
                max="100"
                value={flow}
                onChange={(e) => setFlow(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{flow}</p>
            </div>
          </div>
        </GlassPanel>

        {/* Secondary Controls - Oxigenação */}
        <GlassPanel
          title="Parâmetros de Oxigenação"
          subtitle="Dados gasométricos e saturation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fio2" className="text-white/70 text-xs">
                FiO₂ (%)
              </Label>
              <Input
                id="fio2"
                type="range"
                min="21"
                max="100"
                value={fio2}
                onChange={(e) => setFio2(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{fio2}%</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pao2" className="text-white/70 text-xs">
                PaO₂ (mmHg)
              </Label>
              <Input
                id="pao2"
                type="range"
                min="40"
                max="150"
                value={pao2}
                onChange={(e) => setPao2(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{pao2}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spo2" className="text-white/70 text-xs">
                SpO₂ (%)
              </Label>
              <Input
                id="spo2"
                type="range"
                min="60"
                max="100"
                value={spo2}
                onChange={(e) => setSpo2(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{spo2}%</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vc" className="text-white/70 text-xs">
                VC (mL)
              </Label>
              <Input
                id="vc"
                type="range"
                min="200"
                max="800"
                value={vc}
                onChange={(e) => setVc(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-white font-semibold text-sm">{vc}</p>
            </div>
          </div>
        </GlassPanel>

        {/* VM Visualization */}
        <GlassPanel
          title="Curva de Pressão em Tempo Real"
          subtitle="Visualização das vias aéreas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PneumoExperience
            respiratoryRate={fr}
            peep={peep}
            peakPressure={peakPressure}
            isActive={true}
          />
        </GlassPanel>

        {/* Calculated Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* DP / Compliance */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Diferença de Pressão</p>
              <p className="text-2xl font-bold text-white">
                {calculations.dp !== null ? `${calculations.dp} cmH₂O` : '—'}
              </p>
              <p className="text-white/50 text-xs">Plato - PEEP</p>
            </div>
          </GlassPanel>

          {/* Compliance Estática */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Compliance Estática</p>
              <p className="text-2xl font-bold text-white">
                {calculations.cest !== null ? `${calculations.cest.toFixed(1)} mL/cmH₂O` : '—'}
              </p>
              <p className="text-white/50 text-xs">Indicador de Lesão Pulmonar</p>
            </div>
          </GlassPanel>

          {/* Compliance Dinâmica */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Compliance Dinâmica</p>
              <p className="text-2xl font-bold text-white">
                {calculations.cdyn !== null ? `${calculations.cdyn.toFixed(1)} mL/cmH₂O` : '—'}
              </p>
              <p className="text-white/50 text-xs">Pico - PEEP</p>
            </div>
          </GlassPanel>

          {/* Resistência de Vias Aéreas */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Resistência (Raw)</p>
              <p className="text-2xl font-bold text-white">
                {calculations.raw !== null ? `${calculations.raw.toFixed(2)} cmH₂O/(L/s)` : '—'}
              </p>
              <p className="text-white/50 text-xs">(Pico - Platô) / Fluxo</p>
            </div>
          </GlassPanel>

          {/* P/F Ratio */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Índice P/F</p>
              <p className="text-2xl font-bold text-white">
                {calculations.pf !== null ? `${calculations.pf.toFixed(0)}` : '—'}
              </p>
              <p className={`text-xs font-semibold ${calculations.pfInterp?.c === '#4ade80' ? 'text-green-400' : calculations.pfInterp?.c === '#facc15' ? 'text-yellow-400' : 'text-orange-400'}`}>
                {calculations.pfInterp?.t}
              </p>
            </div>
          </GlassPanel>

          {/* RSBI (Rapid Shallow Breathing Index) */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Índice RSBI</p>
              <p className="text-2xl font-bold text-white">
                {calculations.rsbi !== null ? `${calculations.rsbi.toFixed(1)}` : '—'}
              </p>
              <p className={`text-xs font-semibold ${calculations.rsbInterp?.c === '#4ade80' ? 'text-green-400' : calculations.rsbInterp?.c === '#facc15' ? 'text-yellow-400' : 'text-red-400'}`}>
                {calculations.rsbInterp?.t}
              </p>
            </div>
          </GlassPanel>

          {/* ROX Index */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Índice ROX</p>
              <p className="text-2xl font-bold text-white">
                {calculations.rox !== null ? `${calculations.rox.toFixed(2)}` : '—'}
              </p>
              <p className="text-white/50 text-xs">(SpO₂/FiO₂) / FR</p>
            </div>
          </GlassPanel>

          {/* Potência Mecânica */}
          <GlassPanel className="col-span-1">
            <div className="space-y-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Potência Mecânica</p>
              <p className="text-2xl font-bold text-white">
                {calculations.mecPower !== null ? `${calculations.mecPower.toFixed(2)} J/min` : '—'}
              </p>
              <p className="text-white/50 text-xs">Indicador de Lesão</p>
            </div>
          </GlassPanel>
        </div>

        {/* Educational Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassPanel title="Interpretação Clínica" subtitle="Valores de referência">
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <strong className="text-white">Compliance Estática:</strong> Normal {'>'} 25 mL/cmH₂O
              </li>
              <li>
                <strong className="text-white">RSBI:</strong> {'<'} 80 favorável ao desmame
              </li>
              <li>
                <strong className="text-white">ROX:</strong> {'>'} 4.88 sucesso com CPAP
              </li>
              <li>
                <strong className="text-white">Potência:</strong> {'<'} 17-20 J/min ideal
              </li>
              <li>
                <strong className="text-white">P/F:</strong> Avalia gravidade de SDRA
              </li>
            </ul>
          </GlassPanel>

          <GlassPanel title="Estratégia Protetora" subtitle="Lung Protective Ventilation">
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <strong className="text-white">VT:</strong> 6-8 mL/kg de peso ideal
              </li>
              <li>
                <strong className="text-white">Platô:</strong> {'<'} 30 cmH₂O
              </li>
              <li>
                <strong className="text-white">PEEP:</strong> Ajustar conforme SatO₂
              </li>
              <li>
                <strong className="text-white">Drivingpressure:</strong> {'<'} 15 cmH₂O
              </li>
              <li>
                <strong className="text-white">Objetivo:</strong> Oxigenação + Proteção
              </li>
            </ul>
          </GlassPanel>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
