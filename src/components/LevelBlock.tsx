import { useEffect, useRef, useState } from 'react'
import { getLevel, getXPInLevel, getMinsToNext } from '../lib/utils'
import type { Palette } from '../types'
import styles from './LevelBlock.module.css'

interface Props {
  totalXP: number
  accent: string
  palette: Palette
}

export default function LevelBlock({ totalXP, accent, palette }: Props) {
  const level = getLevel(totalXP)
  const xpInLevel = getXPInLevel(totalXP)
  const minsToNext = getMinsToNext(totalXP)
  const pct = (xpInLevel / 30) * 100

  // Animate bar from 0 → actual% after mount
  const [barWidth, setBarWidth] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const raf = requestAnimationFrame(() => {
      setBarWidth(pct)
    })
    return () => cancelAnimationFrame(raf)
  }, [pct])

  return (
    <div
      className={styles.block}
      style={{ backgroundColor: palette.surface, borderColor: palette.border }}
    >
      <div className={styles.top}>
        <span
          className={styles.level}
          style={{ color: accent, fontFamily: 'var(--font-mono)' }}
        >
          Level {level}
        </span>
        <span className={styles.toNext} style={{ color: palette.textMuted }}>
          {level < 99 ? `${minsToNext} min to Level ${level + 1}` : 'Max level'}
        </span>
      </div>

      <div
        className={styles.track}
        style={{ backgroundColor: palette.surface2, borderColor: palette.border }}
      >
        <div
          className={styles.fill}
          style={{
            width: `${barWidth}%`,
            backgroundColor: accent,
          }}
        />
      </div>

      <div className={styles.xpLabel} style={{ color: palette.textMuted }}>
        {Math.round(xpInLevel)} / 30 XP
      </div>
    </div>
  )
}
