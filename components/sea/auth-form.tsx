'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'

export function AuthForm() {
  const router = useRouter()
  const { signIn, signUp, resetPassword, isLoading } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'forgot') {
      if (!formData.email) { setError('Informe seu email.'); return }
      const result = await resetPassword(formData.email)
      if (result.error) { setError(result.error); return }
      setSuccess('Email de recuperacao enviado. Verifique sua caixa de entrada.')
      return
    }

    if (!formData.email || !formData.password) { setError('Preencha todos os campos.'); return }

    if (mode === 'login') {
      const result = await signIn(formData.email, formData.password)
      if (result.error) { setError(result.error); return }
      router.push('/sea')
    } else {
      if (!formData.name) { setError('Informe seu nome.'); return }
      if (formData.password.length < 6) { setError('Senha deve ter no minimo 6 caracteres.'); return }
      const result = await signUp(formData.email, formData.password, formData.name)
      if (result.error) { setError(result.error); return }
      setSuccess('Conta criada com sucesso. Verifique seu email para confirmar.')
    }
  }

  return (
    <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-center px-6 py-10">
      {/* Logo */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white tracking-wider">SEA</h1>
        <p className="text-[8px] tracking-[0.2em] text-white/40 mt-1 uppercase">
          Sistema de Estudo Avancado
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="glass rounded-2xl p-6">
          {/* Mode toggle */}
          {mode !== 'forgot' ? (
            <div className="flex gap-1 p-0.5 glass-strong rounded-lg mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-md text-[8px] font-semibold uppercase tracking-[0.14em] transition-all ${mode === 'login' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-md text-[8px] font-semibold uppercase tracking-[0.14em] transition-all ${mode === 'signup' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Cadastrar
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className="mb-4 flex items-center gap-1 text-[8px] text-white/50 hover:text-white/70"
            >
              <ArrowLeft className="h-3 w-3" />
              Voltar ao login
            </button>
          )}

          {/* Error/Success messages */}
          {error && (
            <div className="mb-4 rounded-lg border border-[#f8717130] bg-[#f8717108] px-3 py-2">
              <p className="text-[8px] text-[#fca5a5]">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-[#4ade8030] bg-[#4ade8008] px-3 py-2">
              <p className="text-[8px] text-[#86efac]">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-10 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>

            {/* Password (not in forgot mode) */}
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-10 pl-9 pr-9 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Forgot password link */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                  className="text-[7px] text-white/40 hover:text-white/60 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 glass-strong rounded-lg flex items-center justify-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white glow-silver-sm hover:glow-silver transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar email'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
