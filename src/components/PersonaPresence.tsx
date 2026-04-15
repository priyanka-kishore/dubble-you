import { useEffect, useState } from 'react'
import { HINTS } from '../constants/data'
import type { Persona } from '../types'
import styles from './PersonaPresence.module.css'

interface Props {
  persona: Persona
  accent: string
}

export default function PersonaPresence({ persona, accent }: Props) {
  const [hintIndex, setHintIndex] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)

  // Rotate hint text every 10s with a fade
  useEffect(() => {
    const interval = setInterval(() => {
      setHintVisible(false)
      setTimeout(() => {
        setHintIndex(i => (i + 1) % HINTS.length)
        setHintVisible(true)
      }, 400)
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  const hintText = HINTS[hintIndex].replace('[Name]', persona.name)

  return (
    <div className={styles.presence}>
      <div
        className={styles.ring}
        style={{
          '--accent': accent,
          borderColor: accent,
        } as React.CSSProperties}
      >
        <span className={styles.emoji}>{persona.emoji}</span>
      </div>

      <div className={styles.name} style={{ color: 'inherit' }}>
        {persona.name}
      </div>

      <p
        className={styles.hint}
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        {hintText}
      </p>
    </div>
  )
}
