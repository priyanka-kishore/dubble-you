import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { COLORS } from '../constants/theme'
import PersonaCard from '../components/PersonaCard'
import CreatePersonaSheet from '../components/CreatePersonaSheet'
import type { ColorScheme } from '../types'
import styles from './Home.module.css'

export default function Home() {
  const { personas, sessions } = useApp()
  const { palette, colorScheme, setColorScheme } = useTheme()
  const navigate = useNavigate()

  const [showSheet, setShowSheet] = useState(false)
  const [newPersonaId, setNewPersonaId] = useState<string | null>(null)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const gearRef = useRef<HTMLButtonElement>(null)

  // Default FAB accent: first persona's color, or amber fallback
  const fabAccent = personas.length > 0
    ? COLORS.find(c => c.id === personas[0].color)?.accent ?? '#d4901c'
    : '#d4901c'

  function handlePersonaCreated(id: string) {
    setNewPersonaId(id)
    setShowSheet(false)
    // Clear "new" flag after animation completes
    setTimeout(() => setNewPersonaId(null), 400)
  }

  const schemeOptions: { label: string; value: ColorScheme }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ]

  return (
    <div className={styles.page} style={{ backgroundColor: palette.bg }}>
      {/* Header */}
      <header className={styles.header} style={{ borderBottomColor: palette.border }}>
        <div>
          <h1 className={styles.appName} style={{ color: palette.textPrimary, fontFamily: 'var(--font-serif)' }}>
            dubbleYOU
          </h1>
          <p className={styles.tagline} style={{ color: palette.textMuted }}>
            focus with who you're becoming
          </p>
        </div>

        {/* Theme toggle */}
        <div className={styles.gearWrap}>
          <button
            ref={gearRef}
            className={styles.gear}
            style={{ color: palette.textMuted }}
            onClick={() => setShowThemePicker(v => !v)}
            aria-label="Theme settings"
          >
            ⚙
          </button>
          {showThemePicker && (
            <>
              <div
                className={styles.pickerBackdrop}
                onClick={() => setShowThemePicker(false)}
              />
              <div
                className={styles.themePicker}
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                }}
              >
                {schemeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={styles.themeOption}
                    style={{
                      color: colorScheme === opt.value ? fabAccent : palette.textSecondary,
                      fontWeight: colorScheme === opt.value ? 700 : 400,
                    }}
                    onClick={() => {
                      setColorScheme(opt.value)
                      setShowThemePicker(false)
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className={styles.main}>
        {personas.length === 0 ? (
          /* Empty state */
          <div className={styles.empty} onClick={() => setShowSheet(true)}>
            <div className={styles.emptyEmoji}>🌱</div>
            <h2 className={styles.emptyHeadline} style={{ color: palette.textPrimary, fontFamily: 'var(--font-serif)' }}>
              who do you want to become?
            </h2>
            <p className={styles.emptySubtext} style={{ color: palette.textMuted }}>
              create your first self to begin
            </p>
          </div>
        ) : (
          <div
            className={styles.grid}
            style={{ '--grid-cols': personas.length === 1 ? '1fr' : '1fr 1fr' } as React.CSSProperties}
          >
            {personas.map(persona => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                sessions={sessions}
                isNew={persona.id === newPersonaId}
                onFocus={() => navigate(`/timer/${persona.id}`)}
                onView={() => navigate(`/persona/${persona.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        className={styles.fab}
        style={{ backgroundColor: fabAccent, color: '#fff' }}
        onClick={() => setShowSheet(true)}
        aria-label="Create persona"
      >
        +
      </button>

      {/* Create persona sheet */}
      {showSheet && (
        <CreatePersonaSheet
          onClose={() => setShowSheet(false)}
          onCreated={handlePersonaCreated}
        />
      )}
    </div>
  )
}
