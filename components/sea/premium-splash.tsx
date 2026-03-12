'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type PremiumSplashProps = {
  redirectTo?: string | null
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type NeuralNode = {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

type NeuralLink = {
  id: number
  from: number
  to: number
  delay: number
}

const statusMessages = [
  'Mapeando cortex neural...',
  'Sincronizando vias aferentes...',
  'Estabilizando nucleo sensorial...',
  'Calibrando resposta clinica...',
  'Abrindo ambiente SEA...',
]

const hudStats = [
  { label: 'Latencia neural', value: '02 ms' },
  { label: 'Densidade sinaptica', value: '184' },
  { label: 'Estado do nucleo', value: 'ESTAVEL' },
]

function buildNodes(): NeuralNode[] {
  return [
    { id: 0, x: 14, y: 18, size: 8, delay: 0.0 },
    { id: 1, x: 28, y: 32, size: 10, delay: 0.2 },
    { id: 2, x: 46, y: 18, size: 7, delay: 0.4 },
    { id: 3, x: 66, y: 24, size: 9, delay: 0.15 },
    { id: 4, x: 82, y: 18, size: 8, delay: 0.35 },
    { id: 5, x: 18, y: 52, size: 9, delay: 0.25 },
    { id: 6, x: 36, y: 44, size: 11, delay: 0.1 },
    { id: 7, x: 52, y: 50, size: 8, delay: 0.3 },
    { id: 8, x: 70, y: 46, size: 10, delay: 0.45 },
    { id: 9, x: 86, y: 54, size: 8, delay: 0.55 },
    { id: 10, x: 24, y: 78, size: 8, delay: 0.5 },
    { id: 11, x: 42, y: 70, size: 10, delay: 0.6 },
    { id: 12, x: 58, y: 78, size: 8, delay: 0.7 },
    { id: 13, x: 76, y: 72, size: 9, delay: 0.8 },
  ]
}

function buildLinks(): NeuralLink[] {
  return [
    { id: 0, from: 0, to: 1, delay: 0.2 },
    { id: 1, from: 1, to: 2, delay: 0.45 },
    { id: 2, from: 2, to: 3, delay: 0.25 },
    { id: 3, from: 3, to: 4, delay: 0.5 },
    { id: 4, from: 0, to: 5, delay: 0.35 },
    { id: 5, from: 1, to: 6, delay: 0.25 },
    { id: 6, from: 2, to: 6, delay: 0.55 },
    { id: 7, from: 2, to: 7, delay: 0.3 },
    { id: 8, from: 3, to: 8, delay: 0.4 },
    { id: 9, from: 4, to: 9, delay: 0.6 },
    { id: 10, from: 5, to: 6, delay: 0.35 },
    { id: 11, from: 6, to: 7, delay: 0.5 },
    { id: 12, from: 7, to: 8, delay: 0.3 },
    { id: 13, from: 8, to: 9, delay: 0.55 },
    { id: 14, from: 5, to: 10, delay: 0.25 },
    { id: 15, from: 6, to: 11, delay: 0.45 },
    { id: 16, from: 7, to: 11, delay: 0.3 },
    { id: 17, from: 7, to: 12, delay: 0.55 },
    { id: 18, from: 8, to: 13, delay: 0.35 },
    { id: 19, from: 10, to: 11, delay: 0.65 },
    { id: 20, from: 11, to: 12, delay: 0.4 },
    { id: 21, from: 12, to: 13, delay: 0.75 },
  ]
}

function NeuralGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.12]">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_48%)]" />
    </div>
  )
}

function NeuralNodeView({ node }: { node: NeuralNode }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0.25, 0.9, 0.45], scale: [0.92, 1.08, 0.96] }}
      transition={{
        duration: 2.8,
        delay: node.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        style={{
          width: node.size * 3.1,
          height: node.size * 3.1,
          background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
          boxShadow: '0 0 24px rgba(255,255,255,0.12)',
        }}
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          width: node.size,
          height: node.size,
          boxShadow: '0 0 14px rgba(255,255,255,0.6)',
        }}
      />
    </motion.div>
  )
}

function SynapseLink({ link, nodes }: { link: NeuralLink; nodes: NeuralNode[] }) {
  const from = nodes[link.from]
  const to = nodes[link.to]
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <div
      className="absolute origin-left"
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent">
        <motion.div
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white"
          style={{ boxShadow: '0 0 12px rgba(255,255,255,0.75)' }}
          animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.8,
            delay: link.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  )
}

function NeuralCore() {
  return (
    <div className="relative flex h-[15rem] w-[15rem] items-center justify-center md:h-[18rem] md:w-[18rem]">
      <motion.div
        className="absolute inset-0 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[10%] rounded-full border border-white/12"
        style={{ transform: 'rotateX(65deg)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[20%] rounded-full border border-white/15"
        animate={{ scale: [0.98, 1.04, 0.98], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-[28%] rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),rgba(255,255,255,0.05)_55%,transparent_70%)] shadow-[0_0_60px_rgba(255,255,255,0.08)]" />
      <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.92),rgba(214,214,214,0.45)_45%,rgba(90,90,90,0.18)_72%,transparent_100%)]" />
      <div className="absolute inset-[42%] rounded-full border border-white/20" />
      <motion.div
        className="absolute inset-[46%] rounded-full bg-white"
        animate={{ scale: [0.92, 1.08, 0.94], opacity: [0.7, 1, 0.72] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 24px rgba(255,255,255,0.68)' }}
      />
    </div>
  )
}

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 5200,
  onComplete,
  exitHoldMs = 1100,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const nodes = useMemo(() => buildNodes(), [])
  const links = useMemo(() => buildLinks(), [])
  const statusIndex = Math.min(
    Math.floor((progress / 100) * statusMessages.length),
    statusMessages.length - 1
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const tickMs = 80
    const totalSteps = Math.max(1, Math.ceil(durationMs / tickMs))
    const increment = 100 / totalSteps
    let completed = false

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + increment, 100)

        if (next >= 100 && !completed) {
          completed = true
          window.clearInterval(interval)
          window.setTimeout(() => {
            if (redirectTo) {
              router.push(redirectTo)
            }
            onComplete?.()
          }, exitHoldMs)
        }

        return next
      })
    }, tickMs)

    return () => window.clearInterval(interval)
  }, [durationMs, exitHoldMs, onComplete, redirectTo, router])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#040404]" suppressHydrationWarning>
      <NeuralGrid />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(4,4,4,0.3)_48%,rgba(4,4,4,0.94)_100%)]" />

      {mounted ? (
        <div className="absolute inset-0" suppressHydrationWarning>
          {links.map((link) => (
            <SynapseLink key={link.id} link={link} nodes={nodes} />
          ))}
          {nodes.map((node) => (
            <NeuralNodeView key={node.id} node={node} />
          ))}
        </div>
      ) : null}

      <div className="relative flex h-full flex-col justify-between px-4 py-6 md:px-8 md:py-8">
        <div className="flex items-start justify-between">
          <motion.div
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/55 backdrop-blur-xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Neural Gateway
          </motion.div>

          <motion.div
            className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:block"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">SEA Kernel</p>
            <p className="mt-2 text-sm font-medium text-white">Pronto para estudo imersivo</p>
          </motion.div>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div className="absolute inset-0 mx-auto max-w-6xl">
            <div className="absolute left-[8%] top-[24%] hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/38">Estado neural</p>
              <p className="mt-2 text-sm font-medium text-white">Rede cortical ativa</p>
              <p className="mt-1 text-xs text-white/46">Sinais síncronos e núcleo estável</p>
            </div>

            <div className="absolute right-[8%] top-[28%] hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/38">Ambiente</p>
              <p className="mt-2 text-sm font-medium text-white">Preto, prata e branco</p>
              <p className="mt-1 text-xs text-white/46">Cor restrita aos módulos clínicos</p>
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <NeuralCore />
          </motion.div>

          <motion.div
            className="relative z-10 mt-8 max-w-3xl text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25 }}
          >
            <p className="text-[11px] uppercase tracking-[0.36em] text-white/45">SEA Neural Experience</p>
            <h1 className="mt-4 bg-gradient-to-b from-white via-[#d8d8d8] to-[#7e7e7e] bg-clip-text text-6xl font-semibold tracking-[-0.06em] text-transparent md:text-8xl">
              SEA
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/52 md:text-base">
              Interface de entrada com comportamento neural, rede sináptica viva e atmosfera
              clínica monocromática.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto w-full max-w-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                    Inicializacao
                  </p>
                  <p className="mt-2 text-base font-medium text-white">{statusMessages[statusIndex]}</p>
                </div>
                <p className="text-xs font-medium tracking-[0.22em] text-white/45">
                  {Math.round(progress)}%
                </p>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#6f6f6f_0%,#f2f2f2_50%,#7d7d7d_100%)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {hudStats.map((item, index) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/34">{item.label}</p>
                    <motion.p
                      className="mt-2 text-sm font-medium text-white"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + index * 0.08 }}
                    >
                      {item.value}
                    </motion.p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">Topologia ativa</p>
              <div className="mt-4 space-y-3">
                <SignalRow label="Rede sináptica" value="ONLINE" />
                <SignalRow label="Matriz cortical" value="FOCO" />
                <SignalRow label="Simulação clínica" value="PRONTA" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <p className="text-sm text-white/55">{label}</p>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <span className="text-[11px] font-medium tracking-[0.18em] text-white/72">{value}</span>
      </div>
    </div>
  )
}
