import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CadernoState {
  notes: Record<string, string>     // topicId → nota
  progress: Record<string, boolean> // topicId → lido
  setNote: (topicId: string, note: string) => void
  markRead: (topicId: string) => void
  markUnread: (topicId: string) => void
}

export const useCadernoStore = create<CadernoState>()(
  persist(
    (set) => ({
      notes: {},
      progress: {},
      setNote: (topicId, note) =>
        set((s) => ({ notes: { ...s.notes, [topicId]: note } })),
      markRead: (topicId) =>
        set((s) => ({ progress: { ...s.progress, [topicId]: true } })),
      markUnread: (topicId) =>
        set((s) => ({ progress: { ...s.progress, [topicId]: false } })),
    }),
    { name: 'sea-caderno' }
  )
)
