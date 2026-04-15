import { createContext, useContext, useEffect, useState } from 'react'
import type { ColorScheme, Palette } from '../types'
import { LIGHT, DARK } from '../constants/theme'
import { load, save, KEYS } from '../lib/storage'

interface ThemeContextValue {
  palette: Palette
  colorScheme: ColorScheme
  isDark: boolean
  setColorScheme: (s: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() =>
    load<ColorScheme>(KEYS.theme, 'system')
  )
  const [systemDark, setSystemDark] = useState<boolean>(getSystemDark)

  // Listen for system preference changes when colorScheme === 'system'
  useEffect(() => {
    if (colorScheme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [colorScheme])

  const isDark =
    colorScheme === 'dark' || (colorScheme === 'system' && systemDark)

  const palette = isDark ? DARK : LIGHT

  function setColorScheme(s: ColorScheme) {
    setColorSchemeState(s)
    save(KEYS.theme, s)
  }

  return (
    <ThemeContext.Provider value={{ palette, colorScheme, isDark, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
