import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { sortedCategories } from './data/categories'
import { enabledQuestions } from './data/questions'
import { useGameSession } from './hooks/useGameSession'
import { AdminPage } from './pages/AdminPage'
import { CategoryPage } from './pages/CategoryPage'
import { GameCompletePage } from './pages/GameCompletePage'
import { QuestionPage } from './pages/QuestionPage'
import { getAvailableQuestions } from './utils/gameRules'

type RoutePath = '/' | '/admin' | '/game' | '/game/question' | '/game/complete'

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

  const handleResetInGame = () => {
    requestFullscreen()
    resetSession()
    navigate('/game')
  }

  const handleSelectCategory = (categoryId: string) => {
    requestFullscreen()
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
    />
  )
}

export default App
