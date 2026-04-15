import { useState } from 'react'
import type { Palette } from '../types'
import styles from './EndSessionCard.module.css'

interface Props {
  totalSeconds: number
  accent: string
  palette: Palette
  onSave: (note: string) => void
  onKeepGoing: () => void
  onDiscard: () => void
}

export default function EndSessionCard({
  totalSeconds,
  accent,
  palette,
  onSave,
  onKeepGoing,
  onDiscard,
}: Props) {
  const [note, setNote] = useState('')
  const isTooShort = totalSeconds < 30

  if (isTooShort) {
    return (
      <div className={styles.card}>
        <p className={styles.tooShort} style={{ color: palette.textMuted }}>
          too short to save
        </p>
        <div className={styles.actions}>
          <button
            className={styles.keepGoing}
            style={{ borderColor: accent + '66', color: accent }}
            onClick={onKeepGoing}
          >
            Keep Going
          </button>
          <button
            className={styles.discard}
            style={{ color: palette.textMuted }}
            onClick={onDiscard}
          >
            Discard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <input
        className={styles.noteInput}
        style={{
          backgroundColor: palette.surface2,
          borderColor: palette.border,
          color: palette.textPrimary,
        }}
        placeholder="what did you work on?"
        maxLength={120}
        value={note}
        onChange={e => setNote(e.target.value)}
        autoFocus
      />
      <div className={styles.actions}>
        <button
          className={styles.save}
          style={{ backgroundColor: accent, color: '#fff' }}
          onClick={() => onSave(note)}
        >
          Save Session
        </button>
        <button
          className={styles.keepGoing}
          style={{ borderColor: accent + '66', color: accent }}
          onClick={onKeepGoing}
        >
          Keep Going
        </button>
      </div>
    </div>
  )
}
