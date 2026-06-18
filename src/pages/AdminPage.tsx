import { useEffect, useMemo, useState } from 'react'
import '../styles/AdminPage.css'
import { gameData, validateGameData } from '../data/gameData'
import type { Category, GameData, Question } from '../types/game'

const DEFAULT_STYLES = [
  { color: '#d9533f', icon: '🎯' },
  { color: '#2f6fd6', icon: '🧩' },
  { color: '#7d4bc2', icon: '⭐' },
  { color: '#118765', icon: '🚀' },
  { color: '#b97800', icon: '🎮' },
]

function cloneInitialData(): GameData {
  return {
    categories: gameData.categories.map((category) => ({ ...category })),
    questions: gameData.questions.map((question) => ({ ...question })),
  }
}

function makeId(prefix: string, existingIds: string[]): string {
  const normalizedPrefix = prefix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item'
  let counter = 1
  let id = `${normalizedPrefix}-${String(counter).padStart(3, '0')}`

  while (existingIds.includes(id)) {
    counter += 1
    id = `${normalizedPrefix}-${String(counter).padStart(3, '0')}`
  }

  return id
}

function resequenceCategories(categories: Category[]): Category[] {
  return categories.map((category, index) => ({ ...category, sortOrder: index + 1 }))
}

function resequenceQuestions(questions: Question[], categoryId: string): Question[] {
  let order = 0

  return questions.map((question) => {
    if (question.categoryId !== categoryId) return question
    order += 1
    return { ...question, sortOrder: order }
  })
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json() as { error?: unknown }
    return typeof body.error === 'string' ? body.error : '操作失敗。'
  } catch {
    return '操作失敗。'
  }
}

export function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [data, setData] = useState<GameData>(() => cloneInitialData())
  const [selectedCategoryId, setSelectedCategoryId] = useState(gameData.categories[0]?.id ?? '')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newQuestionText, setNewQuestionText] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [message, setMessage] = useState('')
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null)
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)

  const sortedCategories = useMemo(
    () => [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [data.categories],
  )
  const selectedCategory = sortedCategories.find((category) => category.id === selectedCategoryId)
  const selectedQuestions = useMemo(
    () => data.questions
      .filter((question) => question.categoryId === selectedCategoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.questions, selectedCategoryId],
  )

  const loadServerData = async (): Promise<boolean> => {
    const response = await fetch('/api/admin/game-data', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })

    if (response.status === 401) {
      setAuthenticated(false)
      return false
    }

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    const serverData = validateGameData(await response.json())
    setData(serverData)
    setSelectedCategoryId((current) =>
      serverData.categories.some((category) => category.id === current)
        ? current
        : serverData.categories[0]?.id ?? '',
    )
    setAuthenticated(true)
    return true
  }

  useEffect(() => {
    loadServerData()
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : '無法檢查登入狀態。')
        setAuthenticated(false)
      })
      .finally(() => setCheckingSession(false))
  }, [])

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        setLoginError(await readErrorMessage(response))
        return
      }

      setPassword('')
      await loadServerData()
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : '登入失敗。')
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
    } finally {
      setAuthenticated(false)
      setPassword('')
      setMessage('')
    }
  }

  const publish = async () => {
    try {
      validateGameData(data)
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        setMessage(await readErrorMessage(response))
        return
      }

      setMessage('已發布。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '發布失敗。')
    }
  }

  const updateCategoryName = (categoryId: string, name: string) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
      ),
    }))
  }

  const addCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    const style = DEFAULT_STYLES[data.categories.length % DEFAULT_STYLES.length]
    const id = makeId(name, data.categories.map((category) => category.id))
    const category: Category = {
      id,
      name,
      color: style.color,
      icon: style.icon,
      sortOrder: data.categories.length + 1,
    }
    setData((current) => ({ ...current, categories: [...current.categories, category] }))
    setSelectedCategoryId(id)
    setNewCategoryName('')
  }

  const deleteCategory = (categoryId: string) => {
    if (data.questions.some((question) => question.categoryId === categoryId)) {
      setMessage('分類內仍有題目，不能刪除。')
      return
    }

    const remaining = resequenceCategories(
      data.categories.filter((category) => category.id !== categoryId),
    )
    setData((current) => ({ ...current, categories: remaining }))
    if (selectedCategoryId === categoryId) setSelectedCategoryId(remaining[0]?.id ?? '')
    setMessage('')
  }

  const reorderCategories = (targetId: string) => {
    if (!draggedCategoryId || draggedCategoryId === targetId) return
    const items = [...sortedCategories]
    const from = items.findIndex((item) => item.id === draggedCategoryId)
    const to = items.findIndex((item) => item.id === targetId)
    const [moved] = items.splice(from, 1)
    items.splice(to, 0, moved)
    setData((current) => ({ ...current, categories: resequenceCategories(items) }))
    setDraggedCategoryId(null)
  }

  const addQuestion = (text = newQuestionText) => {
    const cleanText = text.trim()
    if (!selectedCategoryId || !cleanText) return false
    const duplicate = data.questions.some(
      (question) => question.categoryId === selectedCategoryId && question.text.trim() === cleanText,
    )
    if (duplicate) return false

    const id = makeId(selectedCategoryId, data.questions.map((question) => question.id))
    const question: Question = {
      id,
      categoryId: selectedCategoryId,
      text: cleanText,
      sortOrder: selectedQuestions.length + 1,
      enabled: true,
    }
    setData((current) => ({ ...current, questions: [...current.questions, question] }))
    setNewQuestionText('')
    return true
  }

  const updateQuestionText = (questionId: string, text: string) => {
    setData((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId ? { ...question, text } : question,
      ),
    }))
  }

  const deleteQuestion = (questionId: string) => {
    setData((current) => ({
      ...current,
      questions: resequenceQuestions(
        current.questions.filter((question) => question.id !== questionId),
        selectedCategoryId,
      ),
    }))
  }

  const reorderQuestions = (targetId: string) => {
    if (!draggedQuestionId || draggedQuestionId === targetId) return
    const ordered = [...selectedQuestions]
    const from = ordered.findIndex((item) => item.id === draggedQuestionId)
    const to = ordered.findIndex((item) => item.id === targetId)
    const [moved] = ordered.splice(from, 1)
    ordered.splice(to, 0, moved)
    const otherQuestions = data.questions.filter(
      (question) => question.categoryId !== selectedCategoryId,
    )
    const resequenced = ordered.map((question, index) => ({
      ...question,
      sortOrder: index + 1,
    }))
    setData((current) => ({ ...current, questions: [...otherQuestions, ...resequenced] }))
    setDraggedQuestionId(null)
  }

  const bulkAdd = () => {
    const lines = bulkText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    const existing = new Set(
      data.questions
        .filter((question) => question.categoryId === selectedCategoryId)
        .map((question) => question.text.trim()),
    )
    const uniqueLines = [...new Set(lines)].filter((line) => !existing.has(line))

    if (uniqueLines.length === 0) {
      setMessage('沒有可新增的題目。')
      return
    }

    const existingIds = data.questions.map((question) => question.id)
    const additions = uniqueLines.map((text, index) => {
      const id = makeId(`${selectedCategoryId}-${Date.now()}-${index + 1}`, existingIds)
      existingIds.push(id)
      return {
        id,
        categoryId: selectedCategoryId,
        text,
        sortOrder: selectedQuestions.length + index + 1,
        enabled: true,
      }
    })
    setData((current) => ({ ...current, questions: [...current.questions, ...additions] }))
    setBulkText('')
    setMessage(`已成功新增 ${additions.length} 條題目`)
  }

  const validate = () => {
    try {
      validateGameData(data)
      setMessage('JSON validation 通過。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'JSON validation 失敗。')
    }
  }

  if (checkingSession) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card">
          <p className="admin-eyebrow">Preteen Game</p>
          <h1>正在檢查登入狀態</h1>
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <form className="admin-login-card" onSubmit={submitLogin}>
          <p className="admin-eyebrow">Preteen Game</p>
          <h1>管理後台</h1>
          <p>請輸入管理密碼。</p>
          <label htmlFor="admin-password">管理密碼</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button type="submit">登入</button>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Preteen Game</p>
          <h1>題庫管理</h1>
          <p>Phase 3 已使用 server-side session；發布仍留待 Phase 4。</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={publish}>發布</button>
          <button className="secondary" onClick={validate}>驗證資料</button>
          <button className="secondary" onClick={() => void loadServerData()}>重新載入</button>
          <button className="secondary" onClick={() => void logout()}>登出</button>
        </div>
      </header>

      {message && <div className="admin-message">{message}</div>}

      <section className="admin-layout">
        <aside className="admin-panel categories-panel">
          <h2>分類</h2>
          <div className="admin-add-row">
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="新分類名稱"
            />
            <button onClick={addCategory}>新增</button>
          </div>
          <div className="admin-list">
            {sortedCategories.map((category) => (
              <div
                className={`admin-category-row ${selectedCategoryId === category.id ? 'selected' : ''}`}
                key={category.id}
                draggable
                onDragStart={() => setDraggedCategoryId(category.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => reorderCategories(category.id)}
              >
                <button className="drag-handle" aria-label="拖拉排序">⋮⋮</button>
                <button className="category-select" onClick={() => setSelectedCategoryId(category.id)}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <small>
                    {data.questions.filter((question) => question.categoryId === category.id).length}
                  </small>
                </button>
                <button className="danger-link" onClick={() => deleteCategory(category.id)}>刪除</button>
              </div>
            ))}
          </div>
        </aside>

        <section className="admin-panel questions-panel">
          {selectedCategory ? (
            <>
              <div className="admin-section-heading">
                <div>
                  <p className="admin-eyebrow">分類設定</p>
                  <input
                    className="category-name-input"
                    value={selectedCategory.name}
                    onChange={(event) => updateCategoryName(selectedCategory.id, event.target.value)}
                  />
                </div>
                <span
                  className="category-swatch"
                  style={{ background: selectedCategory.color }}
                >
                  {selectedCategory.icon}
                </span>
              </div>

              <div className="admin-card">
                <h3>新增題目</h3>
                <div className="admin-add-row">
                  <input
                    value={newQuestionText}
                    onChange={(event) => setNewQuestionText(event.target.value)}
                    placeholder="輸入一條題目"
                  />
                  <button onClick={() => addQuestion()}>新增</button>
                </div>
              </div>

              <div className="admin-card">
                <h3>批量新增</h3>
                <p>每行一條；空白行及完全相同題目會自動略過。</p>
                <textarea
                  value={bulkText}
                  onChange={(event) => setBulkText(event.target.value)}
                  rows={5}
                  placeholder={'第一條題目\n第二條題目\n第三條題目'}
                />
                <button onClick={bulkAdd}>批量新增</button>
              </div>

              <div className="admin-card">
                <div className="admin-card-heading">
                  <h3>題目清單</h3>
                  <span>{selectedQuestions.length} 條</span>
                </div>
                <div className="question-list">
                  {selectedQuestions.map((question) => (
                    <div
                      className="question-row"
                      key={question.id}
                      draggable
                      onDragStart={() => setDraggedQuestionId(question.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => reorderQuestions(question.id)}
                    >
                      <button className="drag-handle" aria-label="拖拉排序">⋮⋮</button>
                      <input
                        value={question.text}
                        onChange={(event) => updateQuestionText(question.id, event.target.value)}
                      />
                      <button className="danger-link" onClick={() => deleteQuestion(question.id)}>刪除</button>
                    </div>
                  ))}
                  {selectedQuestions.length === 0 && (
                    <p className="admin-empty">此分類暫時沒有題目。</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="admin-empty">請先新增或選擇分類。</p>
          )}
        </section>
      </section>
    </main>
  )
}
