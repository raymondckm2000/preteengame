import { CountdownRing } from '../components/CountdownRing'
import { GameControls } from '../components/GameControls'
import { QuestionText } from '../components/QuestionText'
import type { Category, GameSession, Question } from '../types/game'

interface QuestionPageProps {
  session: GameSession
  category: Category
  question: Question
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onSkip: () => void
  onBack: () => void
}

export function QuestionPage({
  session,
  category,
  question,
  onStart,
  onPause,
  onResume,
  onComplete,
  onSkip,
  onBack,
}: QuestionPageProps) {
  return (
    <main className="question-page" aria-label="題目頁">
      <section className="question-stage">
        <div className="question-category" style={{ color: category.color }}>
          <span aria-hidden="true">{category.icon}</span>
          <span>{category.name}</span>
        </div>
        <CountdownRing
          remainingSeconds={session.remainingSeconds}
          status={session.status}
          color={category.color}
        />
        <QuestionText text={question.text} />
      </section>
      <GameControls
        status={session.status}
        color={category.color}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onComplete={onComplete}
        onSkip={onSkip}
        onBack={onBack}
      />
    </main>
  )
}
