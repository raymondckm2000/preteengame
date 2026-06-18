import { clearSessionCookie } from '../_lib/auth.js'
import { allowMethods, sendJson } from '../_lib/http.js'
import type { ApiRequest, ApiResponse } from '../_lib/http.js'

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if (!allowMethods(request, response, ['POST'])) return

  clearSessionCookie(response)
  sendJson(response, 200, { authenticated: false })
}
