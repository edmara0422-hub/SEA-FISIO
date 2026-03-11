'use client'

import { motion } from 'framer-motion'
import { CardioExperience } from '@/components/sea/cardio-experience'
import { PneumoExperience } from '@/components/sea/pneumo-experience'
import { NeuroExperience } from '@/components/sea/neuro-experience'
import { GlassPanel } from '@/components/sea/glass-panel'

export function SimulationsGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* ECG Simulation */}
      <GlassPanel
        title="Simulação Cardíaca"
        subtitle="ECG em Tempo Real"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <CardioExperience bpm={72} isActive={true} />
      </GlassPanel>

      {/* Ventilation Simulation */}
      <GlassPanel
        title="Ventilação Mecânica"
        subtitle="Pressão das Vias Aéreas"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PneumoExperience respiratoryRate={16} peep={5} peakPressure={25} isActive={true} />
      </GlassPanel>

      {/* Neural Activity */}
      <GlassPanel
        title="Atividade Neural"
        subtitle="Ritmo Alfa (10 Hz)"
        className="md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <NeuroExperience frequency={10} duration={3} isActive={true} />
      </GlassPanel>
    </motion.div>
  )
}
