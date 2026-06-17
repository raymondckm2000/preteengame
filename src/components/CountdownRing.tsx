import type { CSSProperties } from 'react'
import { GAME_SECONDS } from '../utils/gameRules'

interface CountdownRingProps {
  remainingSeconds: number
  status: string
  color: string
}

export function CountdownRing({ remainingSeconds, status, color }: CountdownRingProps) {
  const progress = Math.max(0, Math.min(1, remainingSeconds / GAME_SECONDS))
  const angle = progress * 360
  const isUrgent = remainingSeconds <= 10 && remainingSeconds > 0 && status === 'running'
  const label = status === 'expired' || remainingSeconds === 0 ? '時間到' : remainingSeconds

  return (
    <div
      className={`countdown-ring${isUrgent ? ' countdown-ring--urgent' : ''}`}
      style={
        {
          '--timer-color': color,
          '--timer-angle': `${angle}deg`,
        } as CSSProperties
      }
      aria-live="polite"
      aria-label={`剩餘時間 ${remainingSeconds} 秒`}
    >
      <div className="countdown-ring__inner">
        <span className="countdown-ring__value">{label}</span>
        {remainingSeconds > 0 ? <span className="countdown-ring__unit">秒</span> : null}
      </div>
    </div>
  )
}
