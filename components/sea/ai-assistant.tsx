'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/lib/stores/appStore'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Send, Bot, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const { notifications } = useAppStore()

  const sendMessage = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context: 'clinical' }),
      })

      if (!response.ok) throw new Error('Falha ao consultar IA')
      return response.json()
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ])
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    sendMessage.mutate(input)
    setInput('')
  }

  return (
    <GlassPanel title="Assistente Clínico IA" subtitle="Consulte a IA para análises">
      <div className="flex flex-col h-96 space-y-4">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40 text-sm">
              <Bot className="w-4 h-4 mr-2" />
              Faça uma pergunta para começar
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user'
                      ? 'bg-blue-500/30 text-white'
                      : 'bg-white/10 text-white/90'
                    }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-white/70">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre protocolos clínicos..."
            className="bg-white/10 border-white/20"
            disabled={sendMessage.isPending}
          />
          <Button
            type="submit"
            disabled={sendMessage.isPending}
            size="sm"
            className="bg-blue-500/20 hover:bg-blue-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </GlassPanel>
  )
}
