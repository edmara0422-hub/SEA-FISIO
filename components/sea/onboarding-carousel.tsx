'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Brain, BarChart3, Zap, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    icon: Brain,
    title: 'Simulacoes Reais',
    subtitle: '6D Imersivo',
    description: 'Explore cerebro, coracao e pulmao com simulacoes baseadas em fisiologia real. Interaja com modelos 3D avancados.',
    gradient: 'from-white/5 to-white/0',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Ferramentas Avancadas',
    subtitle: 'Clinicas & Marketing',
    description: 'Calculadoras de VM, analise bioneural, funil de conversao e neuroestrategia de marketing integrados.',
    gradient: 'from-white/5 to-white/0',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Domine na Pratica',
    subtitle: 'Aprendizado Ativo',
    description: 'Aprenda fazendo. Simulacoes interativas, feedback em tempo real e trilhas personalizadas pelo seu nivel.',
    gradient: 'from-white/5 to-white/0',
  },
]

export function OnboardingCarousel() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push('/auth')
    }
  }

  const handleSkip = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-sm text-white/50 hover:text-white/70 transition-colors tracking-wide"
        >
          Pular
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="rounded-3xl p-8 relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} pointer-events-none`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {(() => {
                    const Icon = slides[currentSlide].icon
                    return <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  })()}
                </motion.div>

                {/* Content */}
                <motion.p
                  className="text-xs tracking-[0.2em] text-white/60 uppercase mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                
                <motion.h2
                  className="text-3xl font-semibold text-white mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slides[currentSlide].title}
                </motion.h2>
                
                <motion.p
                  className="text-white/70 leading-relaxed text-balance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {slides[currentSlide].description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-6 pb-10">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full h-14 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-center gap-2 text-white font-medium shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-[0.98]"
        >
          {currentSlide === slides.length - 1 ? 'Comecar' : 'Continuar'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
