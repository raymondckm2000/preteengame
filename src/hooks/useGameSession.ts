import { useCallback, useEffect, useMemo, useState } from 'react'
import { sortedCategories } from '../data/categories'
import { enabledQuestions } from '../data/questions'
import type { GameSession } from '../types/game'
import {
  GAME_SECONDS,
  createFreshSession,
  getAvailableQuestions,
  isGameComplete,
  normalizeRunningTimer,
  pickRandomQuestion,
} from '../utils/gameRules'
import { clearStoredSession, loadStoredSession, saveStoredSession } from '../utils/storage'

export function useGameSession() {
  const [session, setSession] = useState<GameSession>(() => loadStoredSession())

  useEffect(() => {
    saveStoredSession(session)
  }, [session])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSession((currentSession) => {
        const nextSession = normalizeRunningTimer(currentSession)
        return nextSession === currentSession ? currentSession : nextSession
      })
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [])

  const resetSession = useCallback(() => {
    const freshSession = createFreshSession()
    clearStoredSession()
    setSession(freshSession)
    return freshSession
  }, [])

  const startNewGame = useCallback(() => {
    const freshSession = createFreshSession()
    clearStoredSession()
    setSession(freshSession)
  }, [])

  const chooseQuestion = useCallback((categoryId: string): GameSession | null => {
    let selectedSession: GameSession | null = null

    setSession((currentSession) => {
      const normalizedSession = normalizeRunningTimer(currentSession)
      const availableQuestions = getAvailableQuestions(
        categoryId,
        enabledQuestions,
        normalizedSession.usedQuestionIds,
      )
      const selectedQuestion = pickRandomQuestion(availableQuestions)

      if (!selectedQuestion) {
        return normalizedSession
      }

      selectedSession = {
        ...normalizedSession,
        usedQuestionIds: [...normalizedSession.usedQuestionIds, selectedQuestion.id],
        currentCategoryId: categoryId,
        currentQuestionId: selectedQuestion.id,
        status: 'ready',
        remainingSeconds: GAME_SECONDS,
        endTimestamp: null,
        updatedAt: Date.now(),
      }

      return selectedSession
    })

    return selectedSession
  }, [])

  const startTimer = useCallback(() => {
    setSession((currentSession) => {
      if (!currentSession.currentQuestionId || currentSession.status === 'expired') {
        return currentSession
      }

      const endTimestamp = Date.now() + currentSession.remainingSeconds * 1000

      return {
        ...currentSession,
        status: 'running',
        endTimestamp,
        updatedAt: Date.now(),
      }
    })
  }, [])

  const pauseTimer = useCallback(() => {
    setSession((currentSession) => {
      const normalizedSession = normalizeRunningTimer(currentSession)

      if (normalizedSession.status !== 'running') {
        return normalizedSession
      }

      return {
        ...normalizedSession,
        status: 'paused',
        endTimestamp: null,
        updatedAt: Date.now(),
      }
    })
  }, [])

  const resumeTimer = useCallback(() => {
    setSession((currentSession) => {
      if (currentSession.status !== 'paused') {
        return currentSession
      }

      return {
        ...currentSession,
        status: 'running',
        endTimestamp: Date.now() + currentSession.remainingSeconds * 1000,
        updatedAt: Date.now(),
      }
    })
  }, [])

  const returnToCategories = useCallback(() => {
    setSession((currentSession) => ({
      ...normalizeRunningTimer(currentSession),
      currentCategoryId: null,
      currentQuestionId: null,
      status: 'idle',
      remainingSeconds: GAME_SECONDS,
      endTimestamp: null,
      updatedAt: Date.now(),
    }))
  }, [])

  const completeQuestion = useCallback(() => {
    returnToCategories()
  }, [returnToCategories])

  const gameIsComplete = useMemo(
    () => isGameComplete(sortedCategories, enabledQuestions, session.usedQuestionIds),
    [session.usedQuestionIds],
  )

  return {
    session,
    startNewGame,
    resetSession,
    chooseQuestion,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeQuestion,
    returnToCategories,
    gameIsComplete,
  }
}
