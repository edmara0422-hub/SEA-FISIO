import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface PatientRecord {
  id: string
  name: string
  recordNumber: string
  diagnosis: string
  createdAt: string
  vmParams: {
    fr: number
    peep: number
    peakPressure: number
    platoPressure: number
    tidalVolume: number
    fio2: number
  }
  gasometry: {
    pao2: number
    paco2: number
    pH: number
  }
  glasgow?: {
    eyes: number
    verbal: string | number
    motor: number
  }
  calculations?: {
    dp: number
    cest: number
    cdyn: number
    raw: number
    pf: number
    rsbi: number
    rox: number
    mecPower: number
  }
}

export interface AppStore {
  patients: PatientRecord[]
  currentPatientId: string | null
  isLoading: boolean
  notifications: Array<{
    id: string
    message: string
    type: 'info' | 'warning' | 'error' | 'success'
    timestamp: number
  }>

  // Patient actions
  addPatient: (patient: PatientRecord) => void
  updatePatient: (id: string, updates: Partial<PatientRecord>) => void
  deletePatient: (id: string) => void
  setCurrentPatient: (id: string) => void

  // UI actions
  setLoading: (loading: boolean) => void
  addNotification: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        patients: [],
        currentPatientId: null,
        isLoading: false,
        notifications: [],

        addPatient: (patient) =>
          set((state) => ({
            patients: [...state.patients, patient],
            currentPatientId: patient.id,
          })),

        updatePatient: (id, updates) =>
          set((state) => ({
            patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          })),

        deletePatient: (id) =>
          set((state) => ({
            patients: state.patients.filter((p) => p.id !== id),
            currentPatientId: state.currentPatientId === id ? null : state.currentPatientId,
          })),

        setCurrentPatient: (id) => set({ currentPatientId: id }),

        setLoading: (loading) => set({ isLoading: loading }),

        addNotification: (message, type = 'info') =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                id: `notif-${Date.now()}`,
                message,
                type,
                timestamp: Date.now(),
              },
            ],
          })),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
      }),
      {
        name: 'sea-app-store',
      }
    )
  )
)
