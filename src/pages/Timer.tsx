import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { getColor } from '../constants/theme'
import TimerDisplay from '../components/TimerDisplay'
import PersonaPresence from '../components/PersonaPresence'
import EndSessionCard from '../components/EndSessionCard'
import styles from './Timer.module.css'

export default function Timer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { personas, addSession } = useApp()
  const { palette, isDark } = useTheme()

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showEndCard, setShowEndCard] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const persona = personas.find(p => p.id === id)
  const color = persona ? getColor(persona.color) : getColor('amber')

  // Bloom alpha: felt, not flashy
  const bloomAlpha = isDark ? '22' : '16'
  const bloom = `radial-gradient(ellipse at center, ${color.accent}${bloomAlpha} 0%, transparent 70%)`

  // --- WakeLock ---
  async function acquireWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {
      // Not supported or denied — silent fail
    }
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release()
    wakeLockRef.current = null
  }

  // --- Interval ---
  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1)
    }, 1000)
  }

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Mount: start timer + wake lock
  useEffect(() => {
    startInterval()
    acquireWakeLock()

    // Reacquire wake lock if tab regains visibility (browsers revoke on tab switch)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        acquireWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopInterval()
      releaseWakeLock()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePauseResume() {
    if (isPaused) {
      startInterval()
      setIsPaused(false)
    } else {
      stopInterval()
      setIsPaused(true)
    }
  }

  function handleEndTap() {
    stopInterval()
    setIsPaused(true)
    setShowEndCard(true)
  }

  function handleSave(note: string) {
    releaseWakeLock()
    addSession({
      personaId: persona!.id,
      duration: elapsedSeconds / 60,
      note,
    })
    navigate('/')
  }

  function handleKeepGoing() {
    setShowEndCard(false)
    setIsPaused(false)
    startInterval()
  }

  function handleDiscard() {
    releaseWakeLock()
    navigate('/')
  }

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

  return (
    <div
      className={styles.page}
      style={{
        backgroundColor: palette.bg,
        backgroundImage: bloom,
        color: palette.textSecondary,
      }}
    >
      {/* Top: persona presence */}
      <div className={styles.top}>
        <PersonaPresence persona={persona} accent={color.accent} />
      </div>

      {/* Center: timer */}
      <div className={styles.center}>
        <TimerDisplay
          totalSeconds={elapsedSeconds}
          isPaused={isPaused}
          accent={color.accent}
          palette={palette}
        />
      </div>

      {/* Bottom: controls or end card */}
      <div className={styles.bottom}>
        {showEndCard ? (
          <EndSessionCard
            totalSeconds={elapsedSeconds}
            accent={color.accent}
            palette={palette}
            onSave={handleSave}
            onKeepGoing={handleKeepGoing}
            onDiscard={handleDiscard}
          />
        ) : (
          <div className={styles.controls}>
            <button
              className={styles.pauseBtn}
              style={{ borderColor: color.accent + '66', color: color.accent }}
              onClick={handlePauseResume}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              className={styles.endBtn}
              style={{ backgroundColor: color.accent, color: '#fff' }}
              onClick={handleEndTap}
            >
              End Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
