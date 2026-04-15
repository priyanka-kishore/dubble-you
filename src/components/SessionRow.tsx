import { fmtDate, fmtMins } from '../lib/utils'
import type { Session, Palette } from '../types'
import styles from './SessionRow.module.css'

interface Props {
  session: Session
  palette: Palette
}

export default function SessionRow({ session, palette }: Props) {
  return (
    <div
      className={styles.row}
      style={{ borderBottomColor: palette.border }}
    >
      <div className={styles.left}>
        <span className={styles.date} style={{ color: palette.textMuted }}>
          {fmtDate(session.date)}
        </span>
        {session.note && (
          <span className={styles.note} style={{ color: palette.textSecondary }}>
            {session.note}
          </span>
        )}
      </div>
      <span className={styles.duration} style={{ color: palette.textPrimary }}>
        {fmtMins(session.duration)}
      </span>
    </div>
  )
}
