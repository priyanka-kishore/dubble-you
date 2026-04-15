import type { Session } from '../types'

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

// MM:SS below 1 hour, H:MM:SS at or above
export function fmtTime(totalSeconds: number): string {
  const s = Math.floor(totalSeconds)
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  if (hours > 0) return `${hours}:${mm}:${ss}`
  return `${mm}:${ss}`
}

// Human-readable duration from minutes (float)
export function fmtMins(minutes: number): string {
  if (minutes < 1) return '< 1m'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

export function getTotalXP(sessions: Session[], personaId: string): number {
  return sessions
    .filter(s => s.personaId === personaId)
    .reduce((total, s) => total + s.duration, 0)
}

export function getLevel(totalXP: number): number {
  return Math.min(99, Math.floor(totalXP / 30) + 1)
}

export function getXPInLevel(totalXP: number): number {
  return totalXP % 30
}

export function getMinsToNext(totalXP: number): number {
  return Math.ceil(30 - (totalXP % 30))
}

// Format a date string (ISO 8601) to "Mon, Apr 14"
export function fmtDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
