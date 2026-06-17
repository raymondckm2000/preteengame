interface QuestionTextProps {
  text: string
}

export function QuestionText({ text }: QuestionTextProps) {
  const lengthClass =
    text.length > 40 ? 'question-text--compact' : text.length > 20 ? 'question-text--medium' : ''

  return <p className={`question-text ${lengthClass}`}>{text}</p>
}
