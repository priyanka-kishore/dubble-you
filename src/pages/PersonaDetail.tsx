import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { getColor } from '../constants/theme'
import { getTotalXP, fmtMins } from '../lib/utils'
import LevelBlock from '../components/LevelBlock'
import SessionRow from '../components/SessionRow'
import styles from './PersonaDetail.module.css'

export default function PersonaDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { personas, sessions, deletePersona } = useApp()
  const { palette, isDark } = useTheme()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const persona = personas.find(p => p.id === id)

  if (!persona) {
    return (
      <div style={{ padding: 20, color: palette.textMuted }}>
        Persona not found.{' '}
        <button onClick={() => navigate('/')} style={{ color: palette.textPrimary }}>
          Go home
        </button>
      </div>
    )
  }

  const color = getColor(persona.color)
  const cardBg = isDark ? color.darkCardBg : color.lightCardBg
  const personaSessions = sessions
    .filter(s => s.personaId === persona.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentSessions = personaSessions.slice(0, 5)
  const totalXP = getTotalXP(sessions, persona.id)
  const sessionCount = personaSessions.length

  function handleDelete() {
    deletePersona(persona!.id)
    navigate('/')
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className={styles.page} style={{ backgroundColor: palette.bg }}>
      {/* Back nav */}
      <button
        className={styles.back}
        style={{ color: color.accent }}
        onClick={handleBack}
      >
        ← Back
      </button>

      {/* Header card */}
      <div
        className={styles.headerCard}
        style={{ backgroundColor: cardBg, borderColor: color.accent + '33' }}
      >
        <div className={styles.emoji}>{persona.emoji}</div>
        <h1
          className={styles.name}
          style={{ color: palette.textPrimary, fontFamily: 'var(--font-serif)' }}
        >
          {persona.name}
        </h1>
        {persona.goal && (
          <p className={styles.goal} style={{ color: palette.textSecondary }}>
            {persona.goal}
          </p>
        )}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: color.accent }}>
              {fmtMins(totalXP)}
            </span>
            <span className={styles.statLabel} style={{ color: palette.textMuted }}>
              total focus
            </span>
          </div>
          <div className={styles.statDivider} style={{ backgroundColor: palette.border }} />
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: color.accent }}>
              {sessionCount}
            </span>
            <span className={styles.statLabel} style={{ color: palette.textMuted }}>
              {sessionCount === 1 ? 'session' : 'sessions'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Level block */}
        <LevelBlock totalXP={totalXP} accent={color.accent} palette={palette} />

        {/* Recent sessions */}
        <div>
          <h2 className={styles.sectionTitle} style={{ color: palette.textMuted }}>
            RECENT SESSIONS
          </h2>
          <div
            className={styles.sessionList}
            style={{ backgroundColor: palette.surface, borderColor: palette.border }}
          >
            {recentSessions.length === 0 ? (
              <p className={styles.noSessions} style={{ color: palette.textMuted }}>
                no sessions yet — start your first
              </p>
            ) : (
              recentSessions.map(session => (
                <SessionRow key={session.id} session={session} palette={palette} />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          className={styles.focusBtn}
          style={{ backgroundColor: color.accent, color: '#fff' }}
          onClick={() => navigate(`/timer/${persona.id}`)}
        >
          Focus Now
        </button>

        {/* Delete */}
        <div className={styles.deleteWrap}>
          {!confirmDelete ? (
            <button
              className={styles.deleteLink}
              style={{ color: palette.textMuted }}
              onClick={() => setConfirmDelete(true)}
            >
              Delete Persona
            </button>
          ) : (
            <div className={styles.confirmDelete}>
              <p className={styles.confirmText} style={{ color: palette.textSecondary }}>
                This will delete {persona.name} and all their sessions. Sure?
              </p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.confirmYes}
                  style={{ color: '#c04a22' }}
                  onClick={handleDelete}
                >
                  Yes, delete
                </button>
                <button
                  className={styles.confirmNo}
                  style={{ color: palette.textMuted }}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
