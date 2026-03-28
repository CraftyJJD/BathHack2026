import { MORNING_QUESTIONS } from '../data/morningQuestions'
import type { MorningAnswer } from '../types/morning'

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function getMorningRoutineMinutes(
  answers: Record<string, MorningAnswer>,
) {
  return MORNING_QUESTIONS.reduce((sum, question) => {
    const answer = answers[question.id]

    return sum + (answer === 'yes' ? question.yesMinutes : question.noMinutes)
  }, 0)
}
