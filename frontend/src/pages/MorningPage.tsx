import { MORNING_QUESTIONS } from '../data/morningQuestions'
import type { MorningAnswer } from '../types/morning'
import { formatMinutes, getMorningRoutineMinutes } from '../utils/time'

type MorningPageProps = {
  answers: Record<string, MorningAnswer>
  onAnswersChange: (answers: Record<string, MorningAnswer>) => void
}

export function MorningPage({ answers, onAnswersChange }: MorningPageProps) {
  const totalMinutes = getMorningRoutineMinutes(answers)

  return (
    <div className="morning-page">
      <button type="button" className="alarm-set-button">
        Estimated routine: {formatMinutes(totalMinutes)}
      </button>

      <form className="morning-actions" aria-label="Morning routine questions">
        {MORNING_QUESTIONS.map((question) => (
          <section key={question.id} className="morning-question">
            <p className="morning-question__label">{question.label}</p>
            <div className="morning-toggle-group" role="group" aria-label={question.label}>
              <button
                type="button"
                className={`morning-toggle-button${
                  answers[question.id] === 'yes'
                    ? ' morning-toggle-button--active'
                    : ''
                }`}
                onClick={() => onAnswersChange({ ...answers, [question.id]: 'yes' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`morning-toggle-button${
                  answers[question.id] === 'no'
                    ? ' morning-toggle-button--active'
                    : ''
                }`}
                onClick={() => onAnswersChange({ ...answers, [question.id]: 'no' })}
              >
                No
              </button>
            </div>
          </section>
        ))}
      </form>
    </div>
  )
}
