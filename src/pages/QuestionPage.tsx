import { useEffect, useRef } from 'react'
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

type AudioContextConstructor = new () => AudioContext

type WindowWithWebAudio = Window & {
  webkitAudioContext?: AudioContextConstructor
}

function playCountdownBeep(remainingSeconds: number) {
  const browserWindow = window as WindowWithWebAudio
  const AudioContextConstructor = browserWindow.AudioContext ?? browserWindow.webkitAudioContext

  if (!AudioContextConstructor) return

  const audioContext = new AudioContextConstructor()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const now = audioContext.currentTime
  const isFinalSecond = remainingSeconds === 1

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(isFinalSecond ? 980 : 740, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(isFinalSecond ? 0.24 : 0.16, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (isFinalSecond ? 0.22 : 0.12))

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start(now)
  oscillator.stop(now + (isFinalSecond ? 0.24 : 0.14))

  window.setTimeout(() => {
    audioContext.close().catch(() => undefined)
  }, 320)
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
  const lastBeepSecondRef = useRef<number | null>(null)

  useEffect(() => {
    if (session.status !== 'running') {
      lastBeepSecondRef.current = null
      return
    }

    if (session.remainingSeconds > 0 && session.remainingSeconds <= 10) {
      if (lastBeepSecondRef.current !== session.remainingSeconds) {
        playCountdownBeep(session.remainingSeconds)
        lastBeepSecondRef.current = session.remainingSeconds
      }
    }
  }, [session.remainingSeconds, session.status])

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
