import { isAuthenticated } from '../_lib/auth.js'
import { bundledGameData } from '../_lib/gameData.js'
import { allowMethods, sendJson } from '../_lib/http.js'
import type { ApiRequest, ApiResponse } from '../_lib/http.js'

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if (!allowMethods(request, response, ['GET'])) return

  try {
    if (!isAuthenticated(request)) {
      sendJson(response, 401, { error: '尚未登入。' })
      return
    }

    sendJson(response, 200, bundledGameData)
  } catch (error) {
    console.error('[Admin game data]', error)
    sendJson(response, 500, { error: '無法載入題庫。' })
  }
}
