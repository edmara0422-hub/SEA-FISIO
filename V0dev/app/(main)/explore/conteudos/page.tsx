'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock, BookOpen, Video, FileText, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function ConteudosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/explore">
          <motion.div 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Conteudos</h1>
          <p className="text-white/50 text-sm">Videos, cursos e artigos</p>
        </div>
      </div>

      {/* Em breve message */}
      <motion.div
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-blue-400" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Em Breve</h2>
        <p className="text-white/50 text-center max-w-xs mb-8">
          Estamos preparando conteudos exclusivos para voce. Fique atento as novidades!
        </p>

        {/* Preview cards */}
        <div className="w-full space-y-3">
          <motion.div 
            className="bg-white/5 rounded-xl p-4 border border-white/5 opacity-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm font-medium">Ventilacao Mecanica</p>
                <p className="text-white/30 text-xs">12 videos • 4h 30min</p>
              </div>
              <Lock className="w-4 h-4 text-white/30" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-xl p-4 border border-white/5 opacity-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm font-medium">Neuroplasticidade Avancada</p>
                <p className="text-white/30 text-xs">8 modulos • Certificado</p>
              </div>
              <Lock className="w-4 h-4 text-white/30" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-xl p-4 border border-white/5 opacity-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm font-medium">Marketing para Saude</p>
                <p className="text-white/30 text-xs">15 artigos • Atualizacoes semanais</p>
              </div>
              <Lock className="w-4 h-4 text-white/30" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
