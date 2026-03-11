'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatDate(date: Date): string {
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
  const months = ['JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
  const day = days[date.getDay()]
  const dateNum = date.getDate().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day}, ${dateNum} DE ${month} DE ${year}`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

interface GreetingHeaderProps {
  userName?: string
}

export function GreetingHeader({ userName = 'Usuario' }: GreetingHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="px-4 pt-4 pb-2">
        <div className="h-16" />
      </div>
    )
  }

  const greeting = getGreeting(currentTime.getHours())

  return (
    <header className="px-4 pt-4 pb-2">
      {/* Top bar with glassmorphism */}
      <div className="flex items-center justify-between mb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-md border border-white/10 hover:border-white/20">
          <Menu className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
        </button>
        
        <span className="text-[10px] tracking-[0.15em] text-white/50 uppercase font-medium">
          SEA Sistema de Estudo Avançado
        </span>
        
        <div className="flex items-center gap-3">
          <div className="text-right px-3 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium text-white drop-shadow-sm">{formatTime(currentTime)}</p>
            <p className="text-[8px] tracking-[0.1em] text-white/50 uppercase">
              {formatDate(currentTime)}
            </p>
          </div>
          <Avatar className="w-9 h-9 border-2 border-white/20 shadow-lg shadow-white/10">
            <AvatarImage src="/placeholder-user.jpg" alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white text-xs font-semibold">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Greeting with gradient */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-1">
          {greeting}, <span className="text-white/80">{userName}</span>
        </h1>
        <p className="text-sm text-white/50">Bem-vindo ao SEA — Sistema de Estudo Avançado</p>
      </div>
    </header>
  )
}
