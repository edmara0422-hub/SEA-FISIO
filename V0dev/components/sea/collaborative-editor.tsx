'use client'

import { useState, useEffect } from 'react'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Users, Save } from 'lucide-react'
import { motion } from 'framer-motion'

interface Collaborator {
  id: string
  name: string
  color: string
  isActive: boolean
}

export function CollaborativeEditor() {
  const [content, setContent] = useState('')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', name: 'You', color: 'bg-blue-500', isActive: true },
    { id: '2', name: 'Dr. Maria', color: 'bg-purple-500', isActive: true },
    { id: '3', name: 'Dr. João', color: 'bg-green-500', isActive: false },
  ])
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <GlassPanel title="Editor Colaborativo" subtitle="Edite prontuários em tempo real">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">Colaboradores ativos</span>
          <div className="flex gap-1 ml-auto">
            {collaborators.map((collab) => (
              <motion.div
                key={collab.id}
                className={`w-8 h-8 rounded-full ${collab.color} flex items-center justify-center text-xs text-white font-bold`}
                animate={{ opacity: collab.isActive ? 1 : 0.5 }}
                title={collab.name}
              >
                {collab.name.charAt(0)}
              </motion.div>
            ))}
          </div>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conteúdo do prontuário sincronizado..."
          className="bg-white/10 border-white/20 min-h-48 text-white placeholder:text-white/40"
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            Desfazer
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        <div className="text-xs text-white/40 text-right">
          Último salvamento: agora
        </div>
      </div>
    </GlassPanel>
  )
}
