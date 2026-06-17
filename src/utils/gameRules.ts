import type { Category, GameSession, Question } from '../types/game'

export const GAME_SECONDS = 60

export function createFreshSession(): GameSession {
  return {
    usedQuestionIds: [],
    currentCategoryId: null,
    currentQuestionId: null,
    status: 'idle',
    remainingSeconds: GAME_SECONDS,
    endTimestamp: null,
    updatedAt: Date.now(),
  }
}

export function getAvailableQuestions(
  categoryId: string,
  allQuestions: Question[],
  usedQuestionIds: string[],
): Question[] {
  const usedQuestionIdSet = new Set(usedQuestionIds)

  return allQuestions.filter(
    (question) =>
      question.enabled &&
      question.categoryId === categoryId &&
      !usedQuestionIdSet.has(question.id),
  )
}

export function pickRandomQuestion(availableQuestions: Question[]): Question | null {
  if (availableQuestions.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * availableQuestions.length)
  return availableQuestions[randomIndex]
}

export function isCategoryComplete(
  categoryId: string,
  allQuestions: Question[],
  usedQuestionIds: string[],
): boolean {
  const categoryQuestions = allQuestions.filter(
    (question) => question.enabled && question.categoryId === categoryId,
  )

  if (categoryQuestions.length === 0) {
    return true
  }

  const usedQuestionIdSet = new Set(usedQuestionIds)
  return categoryQuestions.every((question) => usedQuestionIdSet.has(question.id))
}

export function isGameComplete(
  allCategories: Category[],
  allQuestions: Question[],
  usedQuestionIds: string[],
): boolean {
  const categoriesWithQuestions = allCategories.filter((category) =>
    allQuestions.some((question) => question.enabled && question.categoryId === category.id),
  )

  if (categoriesWithQuestions.length === 0) {
    return false
  }

  return categoriesWithQuestions.every((category) =>
    isCategoryComplete(category.id, allQuestions, usedQuestionIds),
  )
}

export function normalizeRunningTimer(session: GameSession, now = Date.now()): GameSession {
  if (session.status !== 'running' || session.endTimestamp === null) {
    return session
  }

  const remainingSeconds = Math.max(0, Math.ceil((session.endTimestamp - now) / 1000))

  if (remainingSeconds === 0) {
    return {
      ...session,
      status: 'expired',
      remainingSeconds: 0,
      endTimestamp: null,
      updatedAt: now,
    }
  }

  return {
    ...session,
    remainingSeconds,
    updatedAt: now,
  }
}
