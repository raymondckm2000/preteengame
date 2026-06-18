import { setSessionCookie, verifyAdminPassword } from '../_lib/auth.js'
import { allowMethods, getStringField, readJsonBody, sendJson } from '../_lib/http.js'
import type { ApiRequest, ApiResponse } from '../_lib/http.js'

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (!allowMethods(request, response, ['POST'])) return

  try {
    const body = await readJsonBody(request)
    const password = getStringField(body, 'password')

    if (!password || !verifyAdminPassword(password)) {
      sendJson(response, 401, { error: '密碼不正確。' })
      return
    }

    setSessionCookie(response)
    sendJson(response, 200, { authenticated: true })
  } catch (error) {
    console.error('[Admin login]', error)
    sendJson(response, 500, { error: '登入服務設定不完整。' })
  }
}
