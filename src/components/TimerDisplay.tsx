import { fmtTime } from '../lib/utils'
import type { Palette } from '../types'
import styles from './TimerDisplay.module.css'

interface Props {
  totalSeconds: number
  isPaused: boolean
  accent: string
  palette: Palette
}

export default function TimerDisplay({ totalSeconds, isPaused, accent, palette }: Props) {
  return (
    <div
      className={styles.clock}
      style={{
        color: isPaused ? palette.textMuted : accent,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {fmtTime(totalSeconds)}
    </div>
  )
}
