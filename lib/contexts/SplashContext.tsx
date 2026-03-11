'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type SplashContextValue = {
  isSplashVisible: boolean
  setSplashVisible: (visible: boolean) => void
}

const SplashContext = createContext<SplashContextValue | null>(null)

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isSplashVisible, setSplashVisible] = useState(false)
  const setSplashVisibleStable = useCallback((visible: boolean) => setSplashVisible(visible), [])
  return (
    <SplashContext.Provider value={{ isSplashVisible, setSplashVisible: setSplashVisibleStable }}>
      {children}
    </SplashContext.Provider>
  )
}

export function useSplash() {
  const ctx = useContext(SplashContext)
  return ctx ?? { isSplashVisible: false, setSplashVisible: () => { } }
}
