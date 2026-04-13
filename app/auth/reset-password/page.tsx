'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Senha deve ter no minimo 6 caracteres.'); return }
    if (password !== confirm) { setError('As senhas nao coincidem.'); return }
    if (!supabase) { setError('Supabase nao configurado.'); return }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/auth'), 2000)
  }

  return (
    <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Nova senha
          </h2>

          {success ? (
            <div className="rounded-lg border border-[#4ade8030] bg-[#4ade8008] px-3 py-3 text-center">
              <p className="text-[8px] text-[#86efac]">Senha alterada com sucesso. Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="rounded-lg border border-[#f8717130] bg-[#f8717108] px-3 py-2">
                  <p className="text-[8px] text-[#fca5a5]">{error}</p>
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="password"
                  placeholder="Nova senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 glass-strong rounded-lg flex items-center justify-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Alterar senha <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
