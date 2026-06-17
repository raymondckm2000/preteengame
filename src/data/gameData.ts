import rawGameData from './game-data.json'
import type { Category, GameData, Question } from '../types/game'

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

function validateCategory(value: unknown, index: number): Category {
  const fieldPath = `categories[${index}]`

  if (!isRecord(value)) {
    throw new Error(`${fieldPath} must be an object.`)
  }

  return {
    id: readString(value.id, `${fieldPath}.id`),
    name: readString(value.name, `${fieldPath}.name`),
    icon: readString(value.icon, `${fieldPath}.icon`),
    color: readString(value.color, `${fieldPath}.color`),
    sortOrder: readNumber(value.sortOrder, `${fieldPath}.sortOrder`),
  }
}

function validateQuestion(value: unknown, index: number): Question {
  const fieldPath = `questions[${index}]`

  if (!isRecord(value)) {
    throw new Error(`${fieldPath} must be an object.`)
  }

  return {
    id: readString(value.id, `${fieldPath}.id`),
    categoryId: readString(value.categoryId, `${fieldPath}.categoryId`),
    text: readString(value.text, `${fieldPath}.text`),
    sortOrder: readNumber(value.sortOrder, `${fieldPath}.sortOrder`),
    enabled: readBoolean(value.enabled, `${fieldPath}.enabled`),
  }
}

function findDuplicateId(items: Array<{ id: string }>): string | null {
  const seenIds = new Set<string>()

  for (const item of items) {
    if (seenIds.has(item.id)) {
      return item.id
    }

    seenIds.add(item.id)
  }

  return null
}

export function validateGameData(value: unknown): GameData {
  if (!isRecord(value)) {
    throw new Error('Game data must be an object.')
  }

  if (!Array.isArray(value.categories)) {
    throw new Error('categories must be an array.')
  }

  if (!Array.isArray(value.questions)) {
    throw new Error('questions must be an array.')
  }

  const categories = value.categories.map(validateCategory)
  const questions = value.questions.map(validateQuestion)
  const duplicateCategoryId = findDuplicateId(categories)
  const duplicateQuestionId = findDuplicateId(questions)

  if (duplicateCategoryId) {
    throw new Error(`Duplicate category id: ${duplicateCategoryId}`)
  }

  if (duplicateQuestionId) {
    throw new Error(`Duplicate question id: ${duplicateQuestionId}`)
  }

  const categoryIds = new Set(categories.map((category) => category.id))

  for (const question of questions) {
    if (!categoryIds.has(question.categoryId)) {
      throw new Error(
        `Question ${question.id} references unknown categoryId: ${question.categoryId}`,
      )
    }
  }

  return { categories, questions }
}

function loadGameData(): GameData {
  try {
    return validateGameData(rawGameData)
  } catch (error) {
    console.error('[Preteen Game] Invalid game-data.json:', error)
    throw error
  }
}

export const gameData = loadGameData()
