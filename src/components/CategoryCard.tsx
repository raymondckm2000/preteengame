import type { CSSProperties } from 'react'
import type { Category } from '../types/game'

interface CategoryCardProps {
  category: Category
  disabled: boolean
  onSelect: (categoryId: string) => void
}

export function CategoryCard({ category, disabled, onSelect }: CategoryCardProps) {
  return (
    <button
      type="button"
      className="category-card"
      style={{ '--category-color': category.color } as CSSProperties}
      disabled={disabled}
      aria-label={`${category.name}${disabled ? '已完成' : ''}`}
      onClick={() => onSelect(category.id)}
    >
      <span className="category-card__icon" aria-hidden="true">
        {category.icon}
      </span>
      <span className="category-card__name">{category.name}</span>
    </button>
  )
}
