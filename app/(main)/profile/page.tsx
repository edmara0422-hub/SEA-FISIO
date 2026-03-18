'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlassCard } from '@/components/sea/glass-card'
import { ProfileStats } from '@/components/sea/profile-stats'
import { Settings, HelpCircle, LogOut, ChevronRight, Bell, Moon } from 'lucide-react'

const menuItems = [
  { icon: Bell, label: 'Notificacoes', href: '#' },
  { icon: Moon, label: 'Tema', href: '#' },
  { icon: Settings, label: 'Configuracoes', href: '#' },
  { icon: HelpCircle, label: 'Ajuda e Suporte', href: '#' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({ name: 'Usuario', email: 'usuario@sea.com' })

  useEffect(() => {
    const userData = localStorage.getItem('sea_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sea_user')
    }
    router.push('/auth')
  }

  return (
    <div className="min-h-screen px-4 pt-6">
      {/* Profile Header */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Avatar className="w-24 h-24 border-2 border-white/10 mb-4">
          <AvatarImage src="/avatar.png" alt={user.name} />
          <AvatarFallback className="bg-white/10 text-white text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold text-white mb-1">{user.name}</h1>
        <p className="text-sm text-silver-light/50">{user.email}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xs tracking-wider text-silver-light/60 uppercase mb-3">Estatisticas</h2>
        <ProfileStats />
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xs tracking-wider text-silver-light/60 uppercase mb-3">Conquistas Recentes</h2>
        <GlassCard className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['Iniciante', 'Consistente', 'Expert VM', 'Neuro Pro'].map((badge, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-16 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-1 border border-white/10">
                  <span className="text-lg">
                    {['🎯', '🔥', '💨', '🧠'][i]}
                  </span>
                </div>
                <span className="text-[9px] text-silver-light/60 text-center">{badge}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xs tracking-wider text-silver-light/60 uppercase mb-3">Configuracoes</h2>
        <GlassCard className="overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors border-b border-white/[0.05] last:border-0"
              >
                <Icon className="w-5 h-5 text-silver-light/60" />
                <span className="flex-1 text-left text-sm text-white">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-silver-light/40" />
              </button>
            )
          })}
        </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 glass rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair da conta</span>
        </button>
      </motion.div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  )
}
