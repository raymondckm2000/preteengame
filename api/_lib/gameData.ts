import rawGameData from '../../src/data/game-data.json'

export interface ApiCategory {
  id: string
  name: string
  icon: string
  color: string
  sortOrder: number
}

export interface ApiQuestion {
  id: string
  categoryId: string
  text: string
  sortOrder: number
  enabled: boolean
}

export interface ApiGameData {
  categories: ApiCategory[]
  questions: ApiQuestion[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown, fieldPath: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldPath} must be a non-empty string.`)
  }

  return value
}

function readNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldPath} must be a finite number.`)
  }

  return value
}

function readBoolean(value: unknown, fieldPath: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${fieldPath} must be a boolean.`)
  }

  return value
}

function findDuplicateId(items: Array<{ id: string }>): string | null {
  const seen = new Set<string>()

  for (const item of items) {
    if (seen.has(item.id)) return item.id
    seen.add(item.id)
  }

  return null
}

export function validateApiGameData(value: unknown): ApiGameData {
  if (!isRecord(value)) throw new Error('Game data must be an object.')
  if (!Array.isArray(value.categories)) throw new Error('categories must be an array.')
  if (!Array.isArray(value.questions)) throw new Error('questions must be an array.')

  const categories = value.categories.map((item, index): ApiCategory => {
    if (!isRecord(item)) throw new Error(`categories[${index}] must be an object.`)
    return {
      id: readString(item.id, `categories[${index}].id`),
      name: readString(item.name, `categories[${index}].name`),
      icon: readString(item.icon, `categories[${index}].icon`),
      color: readString(item.color, `categories[${index}].color`),
      sortOrder: readNumber(item.sortOrder, `categories[${index}].sortOrder`),
    }
  })

  const questions = value.questions.map((item, index): ApiQuestion => {
    if (!isRecord(item)) throw new Error(`questions[${index}] must be an object.`)
    return {
      id: readString(item.id, `questions[${index}].id`),
      categoryId: readString(item.categoryId, `questions[${index}].categoryId`),
      text: readString(item.text, `questions[${index}].text`),
      sortOrder: readNumber(item.sortOrder, `questions[${index}].sortOrder`),
      enabled: readBoolean(item.enabled, `questions[${index}].enabled`),
    }
  })

  const duplicateCategoryId = findDuplicateId(categories)
  if (duplicateCategoryId) throw new Error(`Duplicate category id: ${duplicateCategoryId}`)

  const duplicateQuestionId = findDuplicateId(questions)
  if (duplicateQuestionId) throw new Error(`Duplicate question id: ${duplicateQuestionId}`)

  const categoryIds = new Set(categories.map((category) => category.id))
  for (const question of questions) {
    if (!categoryIds.has(question.categoryId)) {
      throw new Error(`Question ${question.id} references unknown categoryId: ${question.categoryId}`)
    }
  }

  return { categories, questions }
}

export const bundledGameData = validateApiGameData(rawGameData)
