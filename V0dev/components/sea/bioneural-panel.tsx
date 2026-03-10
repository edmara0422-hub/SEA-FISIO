'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

// Mock VM data
const vmData = [
  { time: 0, pressure: 5, volume: 0, flow: 50 },
  { time: 1, pressure: 20, volume: 200, flow: 40 },
  { time: 2, pressure: 25, volume: 400, flow: 10 },
  { time: 3, pressure: 22, volume: 450, flow: -20 },
  { time: 4, pressure: 10, volume: 300, flow: -40 },
  { time: 5, pressure: 5, volume: 100, flow: -30 },
  { time: 6, pressure: 5, volume: 0, flow: 0 },
]

// Brain SVG component
function BrainVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent rounded-full" />
      
      {/* Brain SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main brain shape */}
        <motion.path
          d="M50 15 C30 15 20 30 20 45 C20 55 25 60 25 65 C25 75 35 85 50 85 C65 85 75 75 75 65 C75 60 80 55 80 45 C80 30 70 15 50 15"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        
        {/* Brain details - left hemisphere */}
        <motion.path
          d="M35 30 Q25 40 30 55 Q35 65 40 70"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        
        {/* Brain details - right hemisphere */}
        <motion.path
          d="M65 30 Q75 40 70 55 Q65 65 60 70"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        {/* Center line */}
        <motion.path
          d="M50 20 L50 80"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.3"
          strokeDasharray="2 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        
        {/* Pulsing nodes */}
        {[
          { cx: 35, cy: 40 },
          { cx: 65, cy: 40 },
          { cx: 40, cy: 60 },
          { cx: 60, cy: 60 },
          { cx: 50, cy: 50 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="2"
            fill="rgba(255,255,255,0.4)"
            animate={{
              r: [2, 3, 2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.svg>

      {/* Labels around brain */}
      <div className="absolute top-2 right-0 text-[8px] text-silver-light/60">
        <p>Neuro-Estado:</p>
        <p className="text-white/80">Receptiva</p>
      </div>
      <div className="absolute top-1/4 left-0 text-[8px] text-silver-light/60 text-right">
        <p>Fisioterapia</p>
        <p className="text-white/80">Adaptativa</p>
      </div>
      <div className="absolute bottom-1/4 right-0 text-[8px] text-silver-light/60">
        <p>Fisioterapia</p>
        <p className="text-white/80">Adaptativa</p>
      </div>
      <div className="absolute bottom-4 left-1/4 text-[8px] text-silver-light/60">
        <p>Fisioterapia</p>
        <p className="text-white/80">Adoptativa</p>
      </div>
    </div>
  )
}

// VM Charts mini component
function VMCharts() {
  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] tracking-wider text-silver-light/60 uppercase">Mechanical Ventilation (VM)</span>
        <div className="flex gap-3 text-[8px] text-silver-light/50">
          <span>FR: <span className="text-white">14</span></span>
          <span>Vol: <span className="text-white">450</span></span>
          <span>FIO2: <span className="text-white">40%</span></span>
          <span>PEEP: <span className="text-white">8</span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Pressure */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vmData}>
              <YAxis hide domain={[0, 30]} />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[7px] text-silver-light/40 text-center mt-0.5">Pressao</p>
        </div>
        
        {/* Volume */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vmData}>
              <YAxis hide domain={[0, 500]} />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[7px] text-silver-light/40 text-center mt-0.5">Volume</p>
        </div>
        
        {/* Flow */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vmData}>
              <YAxis hide domain={[-50, 60]} />
              <Line
                type="monotone"
                dataKey="flow"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[7px] text-silver-light/40 text-center mt-0.5">Fluxo</p>
        </div>
      </div>
    </div>
  )
}

export function BioneuralPanel() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs tracking-wider text-silver-light/80 uppercase font-medium">
          Analise Bioneural (6D)
        </h3>
      </div>
      
      <BrainVisual />
      <VMCharts />
    </GlassCard>
  )
}
