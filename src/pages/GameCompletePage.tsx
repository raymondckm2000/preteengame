interface GameCompletePageProps {
  onNewGame: () => void
}

export function GameCompletePage({ onNewGame }: GameCompletePageProps) {
  return (
    <main className="complete-page" aria-label="完成頁">
      <h1>本局遊戲已完成</h1>
      <button type="button" className="home-start-button" onClick={onNewGame}>
        開始新遊戲
      </button>
    </main>
  )
}
