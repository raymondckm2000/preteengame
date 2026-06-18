import { isAuthenticated } from '../_lib/auth'
import { bundledGameData } from '../_lib/gameData'
import { allowMethods, sendJson } from '../_lib/http'
import type { ApiRequest, ApiResponse } from '../_lib/http'

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
