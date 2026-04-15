import { useTheme } from '../context/ThemeContext'
import { getColor } from '../constants/theme'
import { getTotalXP, getLevel, getXPInLevel } from '../lib/utils'
import type { Persona, Session } from '../types'
import styles from './PersonaCard.module.css'

const RING_SIZE = 88
const STROKE = 5
const RADIUS = (RING_SIZE - STROKE * 2) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

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
  const pct = xpInLevel / 30
  const offset = CIRCUMFERENCE * (1 - pct)
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

      {/* Progress ring with emoji inside */}
      <div className={styles.ringWrap}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className={styles.ring}
        >
          {/* Track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color.accent + '22'}
            strokeWidth={STROKE}
          />
          {/* Filled arc */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color.accent}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={styles.ringArc}
          />
        </svg>
        <span className={styles.ringEmoji}>{persona.emoji}</span>
      </div>

      {/* Total minutes */}
      <div className={styles.totalWrap}>
        <span className={styles.totalNum} style={{ color: palette.textPrimary }}>
          {Math.floor(totalXP)}
        </span>
        <span className={styles.totalLabel} style={{ color: palette.textMuted }}>min</span>
      </div>

      {/* Name & goal */}
      <div className={styles.name} style={{ color: palette.textPrimary }}>
        {persona.name}
      </div>
      {persona.goal && (
        <div className={styles.goal} style={{ color: palette.textSecondary }}>
          {persona.goal}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.focusBtn}
          style={{ backgroundColor: color.accent, color: '#fff' }}
          onClick={e => { e.stopPropagation(); onFocus() }}
        >
          <span className={styles.focusBtnMain}>Focus Now</span>
          <span className={styles.focusBtnSub}>{Math.ceil(30 - xpInLevel)} min to next level</span>
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
