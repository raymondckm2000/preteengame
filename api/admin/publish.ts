import { isAuthenticated } from '../_lib/auth'
import { validateApiGameData } from '../_lib/gameData'
import { allowMethods, readJsonBody, sendJson } from '../_lib/http'
import type { ApiRequest, ApiResponse } from '../_lib/http'

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (!allowMethods(request, response, ['POST'])) return

  try {
    if (!isAuthenticated(request)) {
      sendJson(response, 401, { error: '尚未登入。' })
      return
    }

    const body = await readJsonBody(request)
    validateApiGameData(body)

    sendJson(response, 501, {
      error: 'Phase 3 只驗證資料，尚未連接 GitHub 發布。',
      code: 'PHASE_4_REQUIRED',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '資料驗證失敗。'
    sendJson(response, 400, { error: message })
  }
}
