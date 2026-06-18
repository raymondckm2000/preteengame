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

type BrowserAudioContextConstructor = new () => AudioContext

type GlobalWithWebAudio = typeof globalThis & {
  AudioContext?: BrowserAudioContextConstructor
  webkitAudioContext?: BrowserAudioContextConstructor
}

let sharedAudioContext: AudioContext | null = null

function getAudioContext() {
  if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
    return sharedAudioContext
  }

  const audioGlobal = globalThis as GlobalWithWebAudio
  const AudioContextConstructor = audioGlobal.AudioContext ?? audioGlobal.webkitAudioContext

  if (!AudioContextConstructor) return null

  sharedAudioContext = new AudioContextConstructor()
  return sharedAudioContext
}

function playTone(frequency: number, volume: number, durationSeconds: number) {
  const audioContext = getAudioContext()

  if (!audioContext) return

  audioContext.resume().catch(() => undefined)

  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const now = audioContext.currentTime

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start(now)
  oscillator.stop(now + durationSeconds + 0.02)
}

function unlockCountdownAudio() {
  playTone(620, 0.12, 0.12)
}

function playCountdownBeep(remainingSeconds: number) {
  const isFinalSecond = remainingSeconds === 1

  playTone(isFinalSecond ? 980 : 740, isFinalSecond ? 0.28 : 0.18, isFinalSecond ? 0.24 : 0.13)
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

  const handleStart = () => {
    unlockCountdownAudio()
    onStart()
  }

  const handleResume = () => {
    unlockCountdownAudio()
    onResume()
  }

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
        onStart={handleStart}
        onPause={onPause}
        onResume={handleResume}
        onComplete={onComplete}
        onSkip={onSkip}
        onBack={onBack}
      />
    </main>
  )
}
