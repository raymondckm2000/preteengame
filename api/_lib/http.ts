import type { IncomingMessage, ServerResponse } from 'node:http'

export interface ApiRequest extends IncomingMessage {
  body?: unknown
}

export type ApiResponse = ServerResponse<IncomingMessage>

export function sendJson(response: ApiResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

export function allowMethods(
  request: ApiRequest,
  response: ApiResponse,
  methods: string[],
): boolean {
  if (request.method && methods.includes(request.method)) {
    return true
  }

  response.setHeader('Allow', methods.join(', '))
  sendJson(response, 405, { error: 'Method not allowed.' })
  return false
}

export async function readJsonBody(request: ApiRequest): Promise<unknown> {
  if (request.body !== undefined) {
    if (typeof request.body === 'string') {
      return JSON.parse(request.body)
    }

    return request.body
  }

  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return null
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function getStringField(value: unknown, field: string): string | null {
  if (typeof value !== 'object' || value === null || !(field in value)) {
    return null
  }

  const fieldValue = (value as Record<string, unknown>)[field]
  return typeof fieldValue === 'string' ? fieldValue : null
}
