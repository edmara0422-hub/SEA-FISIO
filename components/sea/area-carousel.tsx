'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ContentCard } from './content-card'
import { SystemCard } from './system-card'

interface AreaCarouselProps {
  area: 'fisioterapia' | 'marketing' | 'neurologia'
  contents: Array<{
    id: string
    title: string
    type: 'video' | 'article' | 'course'
    duration?: string
  }>
  systems: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
}

export function AreaCarousel({ area, contents, systems }: AreaCarouselProps) {
  const [activeTab, setActiveTab] = useState<'conteudos' | 'sistemas'>('conteudos')

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-strong rounded-xl mx-4 mb-6">
        <button
          onClick={() => setActiveTab('conteudos')}
          className={cn(
            'flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300',
            activeTab === 'conteudos'
              ? 'bg-white/10 text-white'
              : 'text-silver-light/50 hover:text-silver-light/70'
          )}
        >
          Conteudos
        </button>
        <button
          onClick={() => setActiveTab('sistemas')}
          className={cn(
            'flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300',
            activeTab === 'sistemas'
              ? 'bg-white/10 text-white'
              : 'text-silver-light/50 hover:text-silver-light/70'
          )}
        >
          Sistemas
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'conteudos' ? (
            <motion.div
              key="conteudos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {contents.map((content) => (
                <ContentCard
                  key={content.id}
                  {...content}
                  area={area}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="sistemas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {systems.map((system) => (
                <SystemCard
                  key={system.id}
                  {...system}
                  area={area}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe indicator */}
      <div className="flex justify-center gap-2 py-4">
        <div
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            activeTab === 'conteudos' ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
          )}
        />
        <div
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            activeTab === 'sistemas' ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
          )}
        />
      </div>
    </div>
  )
}
