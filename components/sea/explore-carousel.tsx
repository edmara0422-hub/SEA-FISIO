'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Play, BookOpen, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface CarouselItem {
  id: string
  title: string
  description: string
  type: 'video' | 'course' | 'article' | 'system'
  area: 'fisioterapia' | 'neurologia' | 'marketing'
  image?: string
  duration?: string
  href?: string
}

const areaColors = {
  fisioterapia: 'from-blue-500/20 to-cyan-500/20',
  neurologia: 'from-purple-500/20 to-pink-500/20',
  marketing: 'from-orange-500/20 to-amber-500/20',
}

const areaAccents = {
  fisioterapia: 'bg-blue-500',
  neurologia: 'bg-purple-500',
  marketing: 'bg-orange-500',
}

const typeIcons = {
  video: Play,
  course: BookOpen,
  article: FileText,
  system: Play,
}

function CarouselCard({ 
  item, 
  index, 
  currentIndex,
  totalItems,
}: { 
  item: CarouselItem
  index: number
  currentIndex: number
  totalItems: number
}) {
  const distance = index - currentIndex
  const isActive = distance === 0
  const Icon = typeIcons[item.type]

  // Calcular transformacoes baseado na distancia
  const scale = isActive ? 1 : 0.85
  const opacity = Math.abs(distance) > 2 ? 0 : 1 - Math.abs(distance) * 0.3
  const x = distance * 85 // porcentagem de deslocamento
  const zIndex = totalItems - Math.abs(distance)

  return (
    <motion.div
      className="absolute left-1/2 top-0 w-[85%] h-full"
      style={{ zIndex }}
      animate={{
        x: `calc(-50% + ${x}%)`,
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link href={item.href || '#'} className="block h-full">
        <div 
          className={`relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br ${areaColors[item.area]} border border-white/10 backdrop-blur-xl`}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${areaAccents[item.area]}`} />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            {/* Type badge */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${areaAccents[item.area]} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {item.duration && (
                <span className="text-xs text-white/50 font-medium">{item.duration}</span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-white leading-tight">
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-white/60 line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Active indicator glow */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: '0 0 60px rgba(255,255,255,0.1)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export function ExploreCarousel({ items, title }: { items: CarouselItem[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragX = useMotionValue(0)

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -threshold && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goTo = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === items.length - 1}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <motion.div
        ref={containerRef}
        className="relative h-[280px] overflow-hidden cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        {items.map((item, index) => (
          <CarouselCard
            key={item.id}
            item={item}
            index={index}
            currentIndex={currentIndex}
            totalItems={items.length}
          />
        ))}
      </motion.div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 px-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
