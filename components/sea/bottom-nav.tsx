'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/sea', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explorar', icon: Search },
  { href: '/profile', label: 'Perfil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav data-sea-bottom-nav="true" className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Glass background */}
      <div className="absolute inset-0 bg-[#0a0a0a]/85 backdrop-blur-2xl border-t border-white/[0.08]" />
      
      {/* Safe area padding for iOS */}
      <div className="relative flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'w-5 h-5 transition-all duration-200',
                  isActive && 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                )} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </div>
              <span className={cn(
                'text-[10px] tracking-wide transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-60'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
