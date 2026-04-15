import type { ColorEntry, ColorTheme, Palette } from '../types'

export const LIGHT: Palette = {
  bg: '#faf8f4',
  surface: '#ffffff',
  surface2: '#f3f0ea',
  border: '#e6dfd2',
  textPrimary: '#1c1812',
  textSecondary: '#6b5e4e',
  textMuted: '#9c8c78',
  textFaint: '#c8bfb0',
}

export const DARK: Palette = {
  bg: '#0d0c09',
  surface: '#181510',
  surface2: '#201c14',
  border: '#2a2418',
  textPrimary: '#e8dfc8',
  textSecondary: '#7a6e5e',
  textMuted: '#5c5040',
  textFaint: '#3a3028',
}

export const COLORS: ColorEntry[] = [
  { id: 'amber', label: 'Amber', accent: '#d4901c', lightCardBg: '#fef8ed', darkCardBg: '#22180a' },
  { id: 'forest', label: 'Forest', accent: '#4a9458', lightCardBg: '#f0f8f2', darkCardBg: '#0b1e0e' },
  { id: 'ocean', label: 'Ocean', accent: '#3878c0', lightCardBg: '#eef5fd', darkCardBg: '#081620' },
  { id: 'plum', label: 'Plum', accent: '#8048c0', lightCardBg: '#f4f0fc', darkCardBg: '#140c28' },
  { id: 'rust', label: 'Rust', accent: '#c04a22', lightCardBg: '#fdf0eb', darkCardBg: '#220c06' },
  { id: 'jade', label: 'Jade', accent: '#28988a', lightCardBg: '#edf8f6', darkCardBg: '#061e16' },
]

export function getColor(id: ColorTheme): ColorEntry {
  return COLORS.find(c => c.id === id) ?? COLORS[0]
}
