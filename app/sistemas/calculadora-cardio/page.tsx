'use client'

import { motion } from 'framer-motion'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { BottomNav } from '@/components/sea/bottom-nav'
import { CardioExperience } from '@/components/sea/cardio-experience'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CardioCalculatorPage() {
  return (
    <div className="min-h-screen pb-20">
      <GreetingHeader userName="Usuário" />
      
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-2">
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
          <h1 className="text-3xl font-bold text-white mb-2">Calculadora Cardíaca</h1>
          <p className="text-white/60">
            Simule eletrocardiogramas (ECG) com diferentes frequências cardíacas. Aprenda sobre os componentes do batimento cardíaco: onda P, complexo QRS e onda T.
          </p>
        </motion.div>

        {/* Interactive ECG Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <CardioExperience bpm={72} isActive={true} />
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Componentes do ECG</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <strong className="text-white">Onda P:</strong> Despolarização atrial
              </li>
              <li>
                <strong className="text-white">QRS:</strong> Despolarização ventricular
              </li>
              <li>
                <strong className="text-white">Onda T:</strong> Repolarização ventricular
              </li>
              <li>
                <strong className="text-white">Intervalo PR:</strong> Tempo AV {'>0.12s'}
              </li>
              <li>
                <strong className="text-white">Intervalo QT:</strong> Tempo de repolarização
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Interpretação Clínica</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <strong className="text-white">FC Normal:</strong> 60-100 bpm
              </li>
              <li>
                <strong className="text-white">Taquicardia:</strong> {'>100 bpm'}
              </li>
              <li>
                <strong className="text-white">Bradicardia:</strong> {'<60 bpm'}
              </li>
              <li>
                <strong className="text-white">Derivação DII:</strong> Mais comum
              </li>
              <li>
                <strong className="text-white">Sensibilidade:</strong> 1 mV = 10 mm
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
