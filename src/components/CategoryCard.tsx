import type { CSSProperties } from 'react'
import type { Category } from '../types/game'

interface CategoryCardProps {
  category: Category
  disabled: boolean
  isRandomActive?: boolean
  isRandomSelected?: boolean
  onSelect: (categoryId: string) => void
}

export function CategoryCard({
  category,
  disabled,
  isRandomActive = false,
  isRandomSelected = false,
  onSelect,
}: CategoryCardProps) {
  const classNames = [
    'category-card',
    isRandomActive ? 'category-card--random-active' : '',
    isRandomSelected ? 'category-card--random-selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classNames}
      style={{ '--category-color': category.color } as CSSProperties}
      disabled={disabled}
      aria-label={`${category.name}${disabled ? '已完成' : ''}${isRandomSelected ? '，今局分類' : ''}`}
      onClick={() => onSelect(category.id)}
    >
      <span className="category-card__icon" aria-hidden="true">
        {category.icon}
      </span>
      <span className="category-card__name">{category.name}</span>
      {isRandomSelected ? <span className="category-card__badge">今局分類</span> : null}
    </button>
  )
}
