import type { GameSession } from '../types/game'
import { createFreshSession, normalizeRunningTimer } from './gameRules'

const SESSION_KEY = 'preteen-game-session-v1'

function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function isValidSession(value: unknown): value is GameSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<GameSession>
  const validStatuses = ['idle', 'ready', 'running', 'paused', 'expired']

  return (
    Array.isArray(candidate.usedQuestionIds) &&
    candidate.usedQuestionIds.every((id) => typeof id === 'string') &&
    (typeof candidate.currentCategoryId === 'string' || candidate.currentCategoryId === null) &&
    (typeof candidate.currentQuestionId === 'string' || candidate.currentQuestionId === null) &&
    typeof candidate.status === 'string' &&
    validStatuses.includes(candidate.status) &&
    typeof candidate.remainingSeconds === 'number' &&
    (typeof candidate.endTimestamp === 'number' || candidate.endTimestamp === null) &&
    typeof candidate.updatedAt === 'number'
  )
}

export function loadStoredSession(): GameSession {
  const storage = getSessionStorage()

  if (!storage) {
    return createFreshSession()
  }

  try {
    const rawSession = storage.getItem(SESSION_KEY)

    if (!rawSession) {
      return createFreshSession()
    }

    const parsedSession: unknown = JSON.parse(rawSession)

    if (!isValidSession(parsedSession)) {
      storage.removeItem(SESSION_KEY)
      return createFreshSession()
    }

    return normalizeRunningTimer(parsedSession)
  } catch {
    storage.removeItem(SESSION_KEY)
    return createFreshSession()
  }
}

export function saveStoredSession(session: GameSession): void {
  const storage = getSessionStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    return
  }
}

export function clearStoredSession(): void {
  const storage = getSessionStorage()

  if (!storage) {
    return
  }

  try {
    storage.removeItem(SESSION_KEY)
  } catch {
    return
  }
}
