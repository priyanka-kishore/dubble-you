import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { COLORS } from '../constants/theme'
import { EMOJIS } from '../constants/data'
import type { ColorTheme } from '../types'
import PersonaCard from './PersonaCard'
import styles from './CreatePersonaSheet.module.css'

interface Props {
  onClose: () => void
  onCreated: (id: string) => void
}

const DEFAULT_EMOJI = EMOJIS[0]
const DEFAULT_COLOR: ColorTheme = 'amber'

export default function CreatePersonaSheet({ onClose, onCreated }: Props) {
  const { addPersona, sessions } = useApp()
  const { palette } = useTheme()

  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI)
  const [color, setColor] = useState<ColorTheme>(DEFAULT_COLOR)
  const [visible, setVisible] = useState(false)

  // Trigger spring-in on next frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  function handleSave() {
    if (!name.trim()) return
    const persona = addPersona({ name: name.trim(), goal: goal.trim(), emoji, color })
    setVisible(false)
    setTimeout(() => onCreated(persona.id), 300)
  }

  const canSave = name.trim().length > 0

  // Preview persona (not stored)
  const previewPersona = {
    id: '__preview__',
    name: name || 'Your Name',
    goal,
    emoji,
    color,
    createdAt: new Date().toISOString(),
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={styles.sheet}
        style={{
          backgroundColor: palette.surface,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Drag handle */}
        <div className={styles.handle} style={{ backgroundColor: palette.border }} />

        <div className={styles.inner}>
          {/* Live preview */}
          <div className={styles.previewWrap}>
            <PersonaCard
              persona={previewPersona}
              sessions={sessions}
              onFocus={() => {}}
              onView={() => {}}
            />
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label} style={{ color: palette.textMuted }}>
              NAME
            </label>
            <input
              className={styles.input}
              style={{
                backgroundColor: palette.surface2,
                borderColor: palette.border,
                color: palette.textPrimary,
              }}
              placeholder="App Builder"
              maxLength={24}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Goal */}
          <div className={styles.field}>
            <label className={styles.label} style={{ color: palette.textMuted }}>
              GOAL <span style={{ opacity: 0.6 }}>(optional)</span>
            </label>
            <input
              className={styles.input}
              style={{
                backgroundColor: palette.surface2,
                borderColor: palette.border,
                color: palette.textPrimary,
              }}
              placeholder="Ship side projects"
              maxLength={60}
              value={goal}
              onChange={e => setGoal(e.target.value)}
            />
          </div>

          {/* Emoji picker */}
          <div className={styles.field}>
            <label className={styles.label} style={{ color: palette.textMuted }}>
              EMOJI
            </label>
            <div className={styles.emojiGrid}>
              {EMOJIS.map(e => (
                <button
                  key={e}
                  className={styles.emojiBtn}
                  style={{
                    backgroundColor: emoji === e
                      ? COLORS.find(c => c.id === color)?.accent + '22'
                      : palette.surface2,
                    borderColor: emoji === e
                      ? COLORS.find(c => c.id === color)?.accent
                      : 'transparent',
                  }}
                  onClick={() => setEmoji(e)}
                  aria-label={e}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className={styles.field}>
            <label className={styles.label} style={{ color: palette.textMuted }}>
              COLOR
            </label>
            <div className={styles.colorRow}>
              {COLORS.map(c => (
                <button
                  key={c.id}
                  className={styles.colorDot}
                  style={{
                    backgroundColor: c.accent,
                    boxShadow: color === c.id
                      ? `0 0 0 2px ${palette.surface}, 0 0 0 4px ${c.accent}`
                      : 'none',
                  }}
                  onClick={() => setColor(c.id)}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            className={styles.saveBtn}
            style={{
              backgroundColor: canSave
                ? COLORS.find(c => c.id === color)?.accent
                : palette.surface2,
              color: canSave ? '#fff' : palette.textFaint,
            }}
            disabled={!canSave}
            onClick={handleSave}
          >
            Create
          </button>
        </div>
      </div>
    </>
  )
}
