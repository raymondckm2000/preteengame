interface ResetGameButtonProps {
  onReset: () => void
}

export function ResetGameButton({ onReset }: ResetGameButtonProps) {
  return (
    <button type="button" className="reset-button" onClick={onReset} aria-label="重設新遊戲">
      重設
    </button>
  )
}
