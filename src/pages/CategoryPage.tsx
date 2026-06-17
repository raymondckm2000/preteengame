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
  const hasAnyQuestion = categories.some((category) =>
    enabledQuestions.some((question) => question.categoryId === category.id),
  )

  return (
    <main className="category-page" aria-label="分類主頁">
      <ResetGameButton onReset={onReset} />
      <h1>選擇下一個挑戰</h1>
      {!hasAnyQuestion ? <p className="empty-message">暫時沒有可用題目。</p> : null}
      <div className="category-grid">
        {categories.map((category) => {
          const disabled = isCategoryComplete(category.id, enabledQuestions, usedQuestionIds)

          return (
            <CategoryCard
              key={category.id}
              category={category}
              disabled={disabled}
              onSelect={onSelectCategory}
            />
          )
        })}
      </div>
    </main>
  )
}
