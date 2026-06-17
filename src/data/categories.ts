import type { Category } from '../types/game'

export const categories: Category[] = [
  {
    id: 'action',
    name: '動作',
    icon: '🏃',
    color: '#d9533f',
    sortOrder: 1,
  },
  {
    id: 'english',
    name: '英文',
    icon: '🔤',
    color: '#2f6fd6',
    sortOrder: 2,
  },
  {
    id: 'mandarin',
    name: '國語',
    icon: '💬',
    color: '#7d4bc2',
    sortOrder: 3,
  },
  {
    id: 'cantonese',
    name: '廣東話',
    icon: '🗣️',
    color: '#118765',
    sortOrder: 4,
  },
  {
    id: 'teamwork',
    name: '二人合作',
    icon: '🤝',
    color: '#b97800',
    sortOrder: 5,
  },
]

export const sortedCategories = [...categories].sort(
  (categoryA, categoryB) => categoryA.sortOrder - categoryB.sortOrder,
)
