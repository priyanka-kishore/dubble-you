export type ColorTheme = 'amber' | 'forest' | 'ocean' | 'plum' | 'rust' | 'jade'
export type ColorScheme = 'light' | 'dark' | 'system'

export interface Persona {
  id: string
  name: string     // max 24 chars, required
  goal: string     // max 60 chars, optional (empty string = not set)
  emoji: string
  color: ColorTheme
  createdAt: string  // ISO 8601
}

export interface Session {
  id: string
  personaId: string
  duration: number   // minutes as float (e.g. 24.5)
  note: string       // max 120 chars, optional
  date: string       // ISO 8601
}

export interface NewPersonaData {
  name: string
  goal: string
  emoji: string
  color: ColorTheme
}

export interface ColorEntry {
  id: ColorTheme
  label: string
  accent: string
  lightCardBg: string
  darkCardBg: string
}

export interface Palette {
  bg: string
  surface: string
  surface2: string
  border: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  textFaint: string
}
