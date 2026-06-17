import { gameData } from './gameData'

export const categories = gameData.categories

export const sortedCategories = [...categories].sort(
  (categoryA, categoryB) => categoryA.sortOrder - categoryB.sortOrder,
)
