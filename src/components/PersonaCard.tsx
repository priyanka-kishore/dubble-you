import { useTheme } from '../context/ThemeContext'
import { getColor } from '../constants/theme'
import { getTotalXP, getLevel, getXPInLevel } from '../lib/utils'
import type { Persona, Session } from '../types'
import styles from './PersonaCard.module.css'

interface Props {
  persona: Persona
  sessions: Session[]
  isNew?: boolean
  onFocus: () => void
  onView: () => void
}

export default function PersonaCard({ persona, sessions, isNew, onFocus, onView }: Props) {
  const { palette, isDark } = useTheme()
  const color = getColor(persona.color)
  const totalXP = getTotalXP(sessions, persona.id)
  const level = getLevel(totalXP)
  const xpInLevel = getXPInLevel(totalXP)
  const pct = (xpInLevel / 30) * 100
  const cardBg = isDark ? color.darkCardBg : color.lightCardBg

  return (
    <div
      className={styles.card}
      data-new={isNew ? 'true' : undefined}
      style={{
        backgroundColor: cardBg,
        borderColor: color.accent + '44',
        '--accent': color.accent,
      } as React.CSSProperties}
    >
      {/* Level badge */}
      <div
        className={styles.badge}
        style={{ backgroundColor: color.accent, color: '#fff' }}
      >
        LVL {level}
      </div>

      {/* Emoji */}
      <div className={styles.emoji}>{persona.emoji}</div>

      {/* Name & goal */}
      <div className={styles.name} style={{ color: palette.textPrimary, fontFamily: 'var(--font-serif)' }}>
        {persona.name}
      </div>
      {persona.goal && (
        <div className={styles.goal} style={{ color: palette.textSecondary }}>
          {persona.goal}
        </div>
      )}

      {/* XP bar */}
      <div
        className={styles.track}
        style={{ backgroundColor: palette.surface2 }}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, backgroundColor: color.accent }}
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.focusBtn}
          style={{ backgroundColor: color.accent, color: '#fff' }}
          onClick={e => { e.stopPropagation(); onFocus() }}
        >
          Focus Now
        </button>
        <button
          className={styles.viewBtn}
          style={{ borderColor: color.accent + '66', color: color.accent }}
          onClick={e => { e.stopPropagation(); onView() }}
        >
          View
        </button>
      </div>
    </div>
  )
}
