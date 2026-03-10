'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AreaCarousel } from '@/components/sea/area-carousel'

const areaData = {
  fisioterapia: {
    title: 'Fisioterapia',
    description: 'Simulacoes e ferramentas clinicas avancadas',
    contents: [
      { id: '1', title: 'Ventilacao Mecanica: Modos Basicos', type: 'video' as const, duration: '15:32' },
      { id: '2', title: 'Desmame: Protocolos e Indicadores', type: 'video' as const, duration: '22:15' },
      { id: '3', title: 'Avaliacao Cardiopulmonar', type: 'article' as const },
      { id: '4', title: 'Reabilitacao em UTI', type: 'course' as const },
      { id: '5', title: 'Manobras de Higiene Bronquica', type: 'video' as const, duration: '18:47' },
      { id: '6', title: 'Gasometria Arterial: Interpretacao', type: 'article' as const },
    ],
    systems: [
      { id: '1', title: 'Calculadora VM', description: 'Calculos completos de ventilacao mecanica', icon: 'calculator' },
      { id: '2', title: 'ICU Prontuario', description: 'Prontuario completo de UTI', icon: 'activity' },
      { id: '3', title: 'Cardio Simulator', description: 'Simulacao cardiovascular avancada', icon: 'heart' },
      { id: '4', title: 'Resp Analytics', description: 'Analise de mecanica respiratoria', icon: 'activity' },
    ],
  },
  marketing: {
    title: 'Marketing & Branding',
    description: 'Neuroestrategia e conversao',
    contents: [
      { id: '1', title: 'Funil de Conversao: Do Lead ao Cliente', type: 'video' as const, duration: '22:15' },
      { id: '2', title: 'Posicionamento de Marca na Saude', type: 'video' as const, duration: '18:47' },
      { id: '3', title: 'Copywriting para Profissionais de Saude', type: 'course' as const },
      { id: '4', title: 'Neurociencia do Consumidor', type: 'article' as const },
    ],
    systems: [
      { id: '1', title: 'MKT Vortex', description: 'Funil de conversao e neuroestrategia', icon: 'chart' },
      { id: '2', title: 'Brand Strategy', description: 'Ferramenta de estrategia de marca', icon: 'target' },
      { id: '3', title: 'Lead Analyzer', description: 'Analise de qualificacao de leads', icon: 'chart' },
    ],
  },
  neurologia: {
    title: 'Neurologia & Ciencia',
    description: 'Neurociencia aplicada e simulacoes',
    contents: [
      { id: '1', title: 'Neuroplasticidade e Reabilitacao', type: 'course' as const },
      { id: '2', title: 'Anatomia Funcional do SNC', type: 'course' as const },
      { id: '3', title: 'Avaliacoes Neuromotoras', type: 'video' as const, duration: '25:00' },
      { id: '4', title: 'Escalas de Avaliacao Neurologica', type: 'article' as const },
    ],
    systems: [
      { id: '1', title: 'Analise Bioneural', description: 'Mapeamento de neuro-estados adaptativos', icon: 'brain' },
      { id: '2', title: 'Neuro Mapper', description: 'Visualizacao de vias neurais', icon: 'brain' },
      { id: '3', title: 'Glasgow Calculator', description: 'Calculadora de escala de Glasgow', icon: 'calculator' },
    ],
  },
}

export default function AreaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const area = areaData[slug as keyof typeof areaData]

  if (!area) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-silver-light/50">Area nao encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <motion.header
        className="px-4 pt-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-silver-light" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{area.title}</h1>
            <p className="text-sm text-silver-light/50">{area.description}</p>
          </div>
        </div>
      </motion.header>

      {/* Carousel */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AreaCarousel
          area={slug as 'fisioterapia' | 'marketing' | 'neurologia'}
          contents={area.contents}
          systems={area.systems}
        />
      </motion.div>
    </div>
  )
}
