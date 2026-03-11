'use client'

import { GlassCard } from './glass-card'
import { Calculator, Brain, Heart, Activity, BarChart3, Target, LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface SystemCardProps {
  id: string
  title: string
  description: string
  icon: string
  area: 'fisioterapia' | 'marketing' | 'neurologia'
  href?: string
}

const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  brain: Brain,
  heart: Heart,
  activity: Activity,
  chart: BarChart3,
  target: Target,
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

export function SystemCard({ id, title, description, icon, area, href }: SystemCardProps) {
  const Icon = iconMap[icon] || Calculator
  const finalHref = href || `/area/${area}`

  return (
    <Link href={finalHref}>
      <GlassCard
        className="p-4 h-full cursor-pointer hover:bg-white/[0.04] transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mb-3 group-hover:bg-white/[0.08] transition-colors">
          <Icon className="w-6 h-6 text-silver-light/60 group-hover:text-silver-light transition-colors" />
        </div>
        
        {/* Badge */}
        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full mb-2 ${areaColors[area]}`}>
          {areaLabels[area]}
        </span>
        
        {/* Title */}
        <h3 className="text-sm text-white font-medium mb-1 group-hover:text-silver-light transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[11px] text-silver-light/50 line-clamp-2">
          {description}
        </p>
      </GlassCard>
    </Link>
  )
}
