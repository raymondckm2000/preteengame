export type GameStatus = 'idle' | 'ready' | 'running' | 'paused' | 'expired'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  sortOrder: number
}

export interface Question {
  id: string
  categoryId: string
  text: string
  sortOrder: number
  enabled: boolean
}

export interface GameSession {
  usedQuestionIds: string[]
  currentCategoryId: string | null
  currentQuestionId: string | null
  status: GameStatus
  remainingSeconds: number
  endTimestamp: number | null
  updatedAt: number
}
