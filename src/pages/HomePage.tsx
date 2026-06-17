interface HomePageProps {
  onNewGame: () => void
}

export function HomePage({ onNewGame }: HomePageProps) {
  return (
    <main className="home-page" aria-label="首頁">
      <button type="button" className="home-start-button" onClick={onNewGame}>
        新遊戲
      </button>
    </main>
  )
}
