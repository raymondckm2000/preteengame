import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import './randomCategory.css'
import { sortedCategories } from './data/categories'
import { enabledQuestions } from './data/questions'
import { useGameSession } from './hooks/useGameSession'
import { AdminPage } from './pages/AdminPage'
import { CategoryPage } from './pages/CategoryPage'
import { GameCompletePage } from './pages/GameCompletePage'
import { QuestionPage } from './pages/QuestionPage'
import { getAvailableQuestions } from './utils/gameRules'

type RoutePath = '/' | '/admin' | '/game' | '/game/question' | '/game/complete'

type WakeLockSentinelLike = {
  released: boolean
  release: () => Promise<void>
  addEventListener: (type: 'release', listener: () => void) => void
}

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
}

function getCurrentRoute(): RoutePath {
  const currentPath = window.location.pathname

  if (
    currentPath === '/' ||
    currentPath === '/admin' ||
    currentPath === '/game' ||
    currentPath === '/game/question' ||
    currentPath === '/game/complete'
  ) {
    return currentPath
  }

  return '/'
}

function requestFullscreen() {
  const rootElement = document.documentElement

  if (!document.fullscreenElement && rootElement.requestFullscreen) {
    rootElement.requestFullscreen().catch(() => undefined)
  }
}

function App() {
  const [route, setRoute] = useState<RoutePath>(() => getCurrentRoute())
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null)
  const {
    session,
    resetSession,
    chooseQuestion,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeQuestion,
    returnToCategories,
    gameIsComplete,
  } = useGameSession()

  const requestWakeLock = useCallback(async () => {
    const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock

    if (!wakeLock || document.visibilityState !== 'visible') return

    try {
      if (wakeLockRef.current && !wakeLockRef.current.released) return

      const wakeLockSentinel = await wakeLock.request('screen')
      wakeLockRef.current = wakeLockSentinel
      wakeLockSentinel.addEventListener('release', () => {
        if (wakeLockRef.current === wakeLockSentinel) {
          wakeLockRef.current = null
        }
      })
    } catch {
      wakeLockRef.current = null
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    if (!wakeLockRef.current) return

    wakeLockRef.current.release().catch(() => undefined)
    wakeLockRef.current = null
  }, [])

  const navigate = useCallback((path: RoutePath) => {
    window.history.pushState(null, '', path)
    setRoute(path)
  }, [])

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (window.location.pathname !== route) {
      window.history.replaceState(null, '', route)
    }
  }, [route])

  const currentCategory = useMemo(
    () => sortedCategories.find((category) => category.id === session.currentCategoryId) ?? null,
    [session.currentCategoryId],
  )
  const currentQuestion = useMemo(
    () => enabledQuestions.find((question) => question.id === session.currentQuestionId) ?? null,
    [session.currentQuestionId],
  )

  const effectiveRoute = route === '/admin' ? '/admin' : gameIsComplete ? '/game/complete' : route

  useEffect(() => {
    if (route !== '/admin' && gameIsComplete && window.location.pathname !== '/game/complete') {
      window.history.replaceState(null, '', '/game/complete')
    }
  }, [gameIsComplete, route])

  useEffect(() => {
    if (effectiveRoute !== '/admin') {
      requestFullscreen()
      requestWakeLock()
    } else {
      releaseWakeLock()
    }
  }, [effectiveRoute, releaseWakeLock, requestWakeLock])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && effectiveRoute !== '/admin') {
        requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [effectiveRoute, requestWakeLock])

  const handleResetInGame = () => {
    requestFullscreen()
    requestWakeLock()
    resetSession()
    navigate('/game')
  }

  const handleSelectCategory = (categoryId: string) => {
    requestFullscreen()
    requestWakeLock()
    chooseQuestion(categoryId)
    navigate('/game/question')
  }

  const handleCompleteQuestion = () => {
    completeQuestion()
    navigate('/game')
  }

  const handleSkipQuestion = () => {
    if (session.currentCategoryId) {
      const availableQuestions = getAvailableQuestions(
        session.currentCategoryId,
        enabledQuestions,
        session.usedQuestionIds,
      )

      if (availableQuestions.length > 0) {
        requestWakeLock()
        chooseQuestion(session.currentCategoryId)
      } else {
        returnToCategories()
        navigate('/game')
      }
    }
  }

  const handleBackToCategories = () => {
    returnToCategories()
    navigate('/game')
  }

  if (effectiveRoute === '/admin') {
    return <AdminPage />
  }

  if (effectiveRoute === '/game/complete') {
    return <GameCompletePage onNewGame={handleResetInGame} />
  }

  if (effectiveRoute === '/game/question' && currentCategory && currentQuestion) {
    return (
      <QuestionPage
        session={session}
        category={currentCategory}
        question={currentQuestion}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onComplete={handleCompleteQuestion}
        onSkip={handleSkipQuestion}
        onBack={handleBackToCategories}
      />
    )
  }

  return (
    <CategoryPage
      categories={sortedCategories}
      usedQuestionIds={session.usedQuestionIds}
      onSelectCategory={handleSelectCategory}
      onReset={handleResetInGame}
      onFullscreen={() => {
        requestFullscreen()
        requestWakeLock()
      }}
    />
  )
}

export default App
