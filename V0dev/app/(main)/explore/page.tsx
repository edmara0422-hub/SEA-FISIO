'use client'

import { motion } from 'framer-motion'
import { BookOpen, Cpu, ChevronRight, Sparkles, Lock } from 'lucide-react'
import Link from 'next/link'

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pt-8 pb-24">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Explorar</h1>
        <p className="text-white/50">Escolha sua experiencia de aprendizado</p>
      </motion.div>

      {/* Experiencia Cards */}
      <div className="space-y-4">
        {/* Conteudos Card */}
        <Link href="/explore/conteudos">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background effect */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-blue-400" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/40" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Conteudos</h2>
              <p className="text-white/60 text-sm mb-4">
                Videos, cursos e artigos para aprofundar seu conhecimento em saude e negocios
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Em breve
                </span>
                <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">12 videos</span>
                <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">8 cursos</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Sistemas Card */}
        <Link href="/explore/sistemas">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background effect */}
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-emerald-400" />
                </div>
                <ChevronRight className="w-6 h-6 text-white/40" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Sistemas</h2>
              <p className="text-white/60 text-sm mb-4">
                Ferramentas interativas, calculadoras e simuladores clinicos em tempo real
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ativo
                </span>
                <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">5 ferramentas</span>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="mt-8 grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-white/40 text-xs">Areas</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-white/40 text-xs">Sistemas</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
          <p className="text-2xl font-bold text-white">20+</p>
          <p className="text-white/40 text-xs">Conteudos</p>
        </div>
      </motion.div>
    </div>
  )
}
