'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Activity, Heart, FileText, Brain, TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const sistemas = [
  {
    id: '1',
    title: 'Calculadora VM',
    description: 'Simulacao completa de ventilacao mecanica com graficos em tempo real, calculos automaticos de indices respiratorios e alarmes inteligentes',
    icon: Activity,
    color: 'blue',
    href: '/sistemas/calculadora-vm',
    status: 'ativo',
    features: ['ECG em tempo real', 'Calculos automaticos', 'Alarmes inteligentes']
  },
  {
    id: '2',
    title: 'Analise Cardiaca',
    description: 'Simulador interativo de eletrocardiogramas com deteccao de arritmias, analise de intervalos e interpretacao automatica',
    icon: Heart,
    color: 'red',
    href: '/sistemas/calculadora-cardio',
    status: 'ativo',
    features: ['12 derivacoes', 'Deteccao de arritmias', 'Laudo automatico']
  },
  {
    id: '3',
    title: 'Prontuario Eletronico',
    description: 'Sistema completo de gestao de pacientes com historico clinico, evolucoes, prescricoes e exportacao de relatorios',
    icon: FileText,
    color: 'emerald',
    href: '/sistemas/prontuario',
    status: 'ativo',
    features: ['Historico completo', 'Evolucoes diarias', 'Exportar PDF']
  },
  {
    id: '4',
    title: 'Analise Bioneural',
    description: 'Mapeamento de atividade neural, avaliacao de neuroplasticidade e protocolos de reabilitacao cognitiva',
    icon: Brain,
    color: 'purple',
    href: '#',
    status: 'breve',
    features: ['Mapeamento cerebral', 'Neuroplasticidade', 'Protocolos']
  },
  {
    id: '5',
    title: 'MKT Vortex',
    description: 'Funil de conversao e estrategia de neuromercado para profissionais de saude com metricas avancadas',
    icon: TrendingUp,
    color: 'orange',
    href: '#',
    status: 'breve',
    features: ['Funil de vendas', 'Metricas', 'Automacoes']
  },
]

const colorMap: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  red: { bg: 'from-red-500/20 to-red-600/10', text: 'text-red-400', border: 'border-red-500/30' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  orange: { bg: 'from-orange-500/20 to-orange-600/10', text: 'text-orange-400', border: 'border-orange-500/30' },
}

export default function SistemasPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, sistemas.length - 1))
    setActiveIndex(newIndex)
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85
      carouselRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth)
      setActiveIndex(newIndex)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-6 pb-24">
      {/* Header */}
      <div className="px-4 flex items-center gap-4 mb-6">
        <Link href="/explore">
          <motion.div 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Sistemas</h1>
          <p className="text-white/50 text-sm">Ferramentas interativas</p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mb-6">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sistemas.map((sistema, index) => {
            const colors = colorMap[sistema.color]
            const Icon = sistema.icon
            const isActive = sistema.status === 'ativo'
            
            return (
              <motion.div
                key={sistema.id}
                className="flex-shrink-0 w-[85%] snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={isActive ? sistema.href : '#'}>
                  <div className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-6 min-h-[320px] ${!isActive && 'opacity-60'}`}>
                    {/* Glow effect */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${colors.bg}`} />
                    
                    <div className="relative z-10">
                      {/* Status badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 ${colors.text}`} />
                        </div>
                        {isActive ? (
                          <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full">
                            Em breve
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-2xl font-bold text-white mb-2">{sistema.title}</h2>
                      <p className="text-white/60 text-sm mb-6 line-clamp-3">{sistema.description}</p>

                      {/* Features */}
                      <div className="space-y-2">
                        {sistema.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                            <span className="text-white/50 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      {isActive && (
                        <motion.div 
                          className={`mt-6 py-3 rounded-xl bg-white/10 text-center`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-white text-sm font-medium">Abrir Sistema</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => scrollTo(activeIndex - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-20"
          style={{ display: activeIndex === 0 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-20"
          style={{ display: activeIndex === sistemas.length - 1 ? 'none' : 'flex' }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {sistemas.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Quick access list */}
      <div className="px-4">
        <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Acesso Rapido</h3>
        <div className="space-y-2">
          {sistemas.filter(s => s.status === 'ativo').map((sistema) => {
            const colors = colorMap[sistema.color]
            const Icon = sistema.icon
            
            return (
              <Link key={sistema.id} href={sistema.href}>
                <motion.div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{sistema.title}</p>
                    <p className="text-white/40 text-xs">{sistema.features[0]}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
