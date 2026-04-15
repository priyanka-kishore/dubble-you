export const KEYS = {
  personas: 'dby_v1_personas',
  sessions: 'dby_v1_sessions',
  theme: 'dby_v1_theme',
} as const

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail (e.g. private browsing storage quota)
  }
}
