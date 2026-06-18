import { clearSessionCookie } from '../_lib/auth'
import { allowMethods, sendJson } from '../_lib/http'
import type { ApiRequest, ApiResponse } from '../_lib/http'

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if (!allowMethods(request, response, ['POST'])) return

  clearSessionCookie(response)
  sendJson(response, 200, { authenticated: false })
}
