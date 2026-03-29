'use client'

import { motion } from 'framer-motion'
import { Bell, User } from 'lucide-react'
import BusinessClock from '@/components/sea/greeting-clock-card'

export function TopBarSEA() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-2.5 pt-5 md:px-8 md:pt-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-2xl">
        <BusinessClock variant="hero" showGreeting />
      </div>
    </motion.header>
  )
}
