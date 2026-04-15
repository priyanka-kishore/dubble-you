import { createContext, useContext, useState } from 'react'
import type { Persona, Session, NewPersonaData } from '../types'
import { load, save, KEYS } from '../lib/storage'
import { uid } from '../lib/utils'

interface AppContextValue {
  personas: Persona[]
  sessions: Session[]
  addPersona: (data: NewPersonaData) => Persona
  addSession: (data: Omit<Session, 'id' | 'date'>) => Session
  deletePersona: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [personas, setPersonas] = useState<Persona[]>(() =>
    load<Persona[]>(KEYS.personas, [])
  )
  const [sessions, setSessions] = useState<Session[]>(() =>
    load<Session[]>(KEYS.sessions, [])
  )

  function addPersona(data: NewPersonaData): Persona {
    const persona: Persona = {
      id: uid(),
      name: data.name,
      goal: data.goal,
      emoji: data.emoji,
      color: data.color,
      createdAt: new Date().toISOString(),
    }
    const next = [...personas, persona]
    setPersonas(next)
    save(KEYS.personas, next)
    return persona
  }

  function addSession(data: Omit<Session, 'id' | 'date'>): Session {
    const session: Session = {
      id: uid(),
      date: new Date().toISOString(),
      ...data,
    }
    const next = [...sessions, session]
    setSessions(next)
    save(KEYS.sessions, next)
    return session
  }

  function deletePersona(id: string): void {
    const nextPersonas = personas.filter(p => p.id !== id)
    const nextSessions = sessions.filter(s => s.personaId !== id)
    setPersonas(nextPersonas)
    setSessions(nextSessions)
    save(KEYS.personas, nextPersonas)
    save(KEYS.sessions, nextSessions)
  }

  return (
    <AppContext.Provider value={{ personas, sessions, addPersona, addSession, deletePersona }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
