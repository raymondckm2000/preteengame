import { useEffect, useMemo, useRef, useState } from 'react'
import { CategoryCard } from '../components/CategoryCard'
import { ResetGameButton } from '../components/ResetGameButton'
import { enabledQuestions } from '../data/questions'
import type { Category } from '../types/game'
import { isCategoryComplete } from '../utils/gameRules'

interface CategoryPageProps {
  categories: Category[]
  usedQuestionIds: string[]
  onSelectCategory: (categoryId: string) => void
  onReset: () => void
}

export function CategoryPage({
  categories,
  usedQuestionIds,
  onSelectCategory,
  onReset,
}: CategoryPageProps) {
  const [rollingCategoryId, setRollingCategoryId] = useState<string | null>(null)
  const [selectedRandomCategoryId, setSelectedRandomCategoryId] = useState<string | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const timersRef = useRef<number[]>([])

  const availableCategories = useMemo(
    () =>
      categories.filter((category) => {
        const hasQuestion = enabledQuestions.some((question) => question.categoryId === category.id)
        const completed = isCategoryComplete(category.id, enabledQuestions, usedQuestionIds)

        return hasQuestion && !completed
      }),
    [categories, usedQuestionIds],
  )

  const hasAnyQuestion = categories.some((category) =>
    enabledQuestions.some((question) => question.categoryId === category.id),
  )

  const clearRollTimers = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    timersRef.current = []
  }

  useEffect(
    () => () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      timersRef.current = []
    },
    [],
  )

  const handleRandomCategory = () => {
    if (availableCategories.length === 0) return

    clearRollTimers()
    setIsRolling(true)
    setSelectedRandomCategoryId(null)

    const winner = availableCategories[Math.floor(Math.random() * availableCategories.length)]
    const totalSteps = Math.max(availableCategories.length * 3, 16) + Math.floor(Math.random() * 6)
    let elapsed = 0
    let cursor = Math.floor(Math.random() * availableCategories.length)

    for (let step = 0; step <= totalSteps; step += 1) {
      const slowDownStep = Math.max(totalSteps - 6, 1)
      const baseDelay = step < slowDownStep ? 90 : 90 + (step - slowDownStep) * 70
      const isFinalStep = step === totalSteps
      const category = isFinalStep ? winner : availableCategories[cursor % availableCategories.length]

      elapsed += baseDelay

      const timerId = window.setTimeout(() => {
        setRollingCategoryId(category.id)

        if (isFinalStep) {
          setSelectedRandomCategoryId(winner.id)
          setIsRolling(false)
        }
      }, elapsed)

      timersRef.current.push(timerId)
      cursor += 1
    }
  }

  return (
    <main className="category-page" aria-label="分類主頁">
      <ResetGameButton onReset={onReset} />
      <header className="category-hero">
        <h1>今日玩邊個分類？</h1>
        <button
          type="button"
          className="random-start-button"
          disabled={isRolling || availableCategories.length === 0}
          onClick={handleRandomCategory}
        >
          {isRolling ? '抽緊分類...' : '開新局'}
        </button>
      </header>
      {!hasAnyQuestion ? <p className="empty-message">暫時沒有可用題目。</p> : null}
      <div className="category-grid" aria-live="polite">
        {categories.map((category) => {
          const disabled = isCategoryComplete(category.id, enabledQuestions, usedQuestionIds)
          const isRandomActive = rollingCategoryId === category.id
          const isRandomSelected = selectedRandomCategoryId === category.id

          return (
            <CategoryCard
              key={category.id}
              category={category}
              disabled={disabled}
              isRandomActive={isRandomActive}
              isRandomSelected={isRandomSelected}
              onSelect={onSelectCategory}
            />
          )
        })}
      </div>
    </main>
  )
}
