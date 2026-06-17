import type { CSSProperties } from 'react'
import type { GameStatus } from '../types/game'

interface GameControlsProps {
  status: GameStatus
  color: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onSkip: () => void
  onBack: () => void
}

export function GameControls({
  status,
  color,
  onStart,
  onPause,
  onResume,
  onComplete,
  onSkip,
  onBack,
}: GameControlsProps) {
  const isExpired = status === 'expired'
  const canComplete = status === 'running' || status === 'paused' || status === 'expired'

  return (
    <div className="game-controls" style={{ '--category-color': color } as CSSProperties}>
      {canComplete ? (
        <button type="button" className="primary-button category-tone" onClick={onComplete}>
          完成
        </button>
      ) : null}

      {!isExpired ? (
        <button
          type="button"
          className="primary-button"
          onClick={status === 'running' ? onPause : status === 'paused' ? onResume : onStart}
        >
          {status === 'running' ? '暫停' : status === 'paused' ? '繼續' : '開始'}
        </button>
      ) : null}

      <div className="secondary-actions">
        {!isExpired ? (
          <button type="button" className="secondary-button" onClick={onSkip}>
            跳過
          </button>
        ) : null}
        <button type="button" className="secondary-button" onClick={onBack}>
          返回分類
        </button>
      </div>
    </div>
  )
}
