import { gameData } from './gameData'

export const questions = gameData.questions

export const enabledQuestions = questions
  .filter((question) => question.enabled)
  .sort((questionA, questionB) => questionA.sortOrder - questionB.sortOrder)
