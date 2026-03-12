'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChartNoAxesColumn, MessageSquareQuote } from 'lucide-react'

export function PerformanceBar() {
  return (
    <motion.section
      className="sea-dark-glass rounded-[2rem] p-5 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.14 }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/12 bg-black/24">
            <MessageSquareQuote className="h-5 w-5 text-white/76" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46">
              Feedback + NPS
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white md:text-[1.6rem]">
              Painel unico de percepcao
            </h3>
          </div>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-white/12 px-4 py-3 text-sm font-semibold text-white/84 transition hover:text-white"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(18,18,20,0.84) 60%, rgba(8,8,10,0.98) 100%)',
          }}
        >
          <span>Abrir painel</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[1.55rem] border border-white/10 bg-black/18 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/[0.06]">
              <ChartNoAxesColumn className="h-4 w-4 text-white/74" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">
                Estado
              </p>
              <p className="text-sm text-white/78">Sem coleta ativa</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.55rem] border border-white/10 bg-black/18 p-4">
          <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
            <span>Feedback + NPS</span>
            <span>Sem baseline</span>
          </div>
          <div className="grid h-24 grid-cols-3 gap-2">
            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.04]" />
            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.06]" />
            <div className="rounded-[1.1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
