'use client'

import { cn } from '@/lib/utils'

interface ExploreFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'fisioterapia', label: 'Fisioterapia' },
  { id: 'marketing', label: 'Marketing & Branding' },
  { id: 'neurologia', label: 'Neurologia & Ciencia' },
  { id: 'conteudos', label: 'Conteudos' },
  { id: 'sistemas', label: 'Sistemas' },
]

export function ExploreFilters({ activeFilter, onFilterChange }: ExploreFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200',
            activeFilter === filter.id
              ? 'bg-white/10 text-white border border-white/20'
              : 'glass text-silver-light/60 hover:text-silver-light hover:bg-white/[0.04]'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
