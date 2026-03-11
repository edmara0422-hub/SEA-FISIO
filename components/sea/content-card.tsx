'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'
import { Play, FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface ContentCardProps {
  id: string
  title: string
  type: 'video' | 'article' | 'course'
  area: 'fisioterapia' | 'marketing' | 'neurologia'
  duration?: string
  thumbnail?: string
}

const typeIcons = {
  video: Play,
  article: FileText,
  course: BookOpen,
}

const typeLabels = {
  video: 'Video',
  article: 'Artigo',
  course: 'Curso',
}

const areaLabels = {
  fisioterapia: 'Fisioterapia',
  marketing: 'Marketing',
  neurologia: 'Neurologia',
}

const areaColors = {
  fisioterapia: 'bg-blue-500/20 text-blue-300',
  marketing: 'bg-purple-500/20 text-purple-300',
  neurologia: 'bg-emerald-500/20 text-emerald-300',
}

export function ContentCard({ id, title, type, area, duration }: ContentCardProps) {
  const Icon = typeIcons[type]

  return (
    <Link href={`/area/${area}`}>
      <GlassCard
        className="p-3 h-full cursor-pointer hover:bg-white/[0.04] transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Thumbnail placeholder */}
        <div className="aspect-video rounded-lg bg-white/[0.03] mb-3 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <Icon className="w-8 h-8 text-silver-light/30 group-hover:text-silver-light/50 transition-colors" />
          {duration && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white">
              {duration}
            </span>
          )}
        </div>
        
        {/* Badges */}
        <div className="flex gap-2 mb-2">
          <span className={`text-[9px] px-2 py-0.5 rounded-full ${areaColors[area]}`}>
            {areaLabels[area]}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            {typeLabels[type]}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm text-white font-medium line-clamp-2 group-hover:text-silver-light transition-colors">
          {title}
        </h3>
      </GlassCard>
    </Link>
  )
}
