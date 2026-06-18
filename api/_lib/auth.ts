import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { ApiRequest, ApiResponse } from './http'

const COOKIE_NAME = 'preteen_admin_session'
const SESSION_PAYLOAD = 'admin'

function getRequiredEnv(name: 'ADMIN_PASSWORD_HASH' | 'SESSION_SECRET'): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function parseCookies(request: ApiRequest): Record<string, string> {
  const cookieHeader = request.headers.cookie
  if (!cookieHeader) return {}

  return Object.fromEntries(
    cookieHeader.split(';').map((part) => {
      const [name, ...valueParts] = part.trim().split('=')
      return [name, decodeURIComponent(valueParts.join('='))]
    }),
  )
}

export function verifyAdminPassword(password: string): boolean {
  const configuredHash = getRequiredEnv('ADMIN_PASSWORD_HASH')
    .replace(/^sha256:/, '')
    .trim()
    .toLowerCase()
  const submittedHash = createHash('sha256').update(password).digest('hex')

  return safeEqual(submittedHash, configuredHash)
}

export function createSessionToken(): string {
  const secret = getRequiredEnv('SESSION_SECRET')
  return `${SESSION_PAYLOAD}.${signPayload(SESSION_PAYLOAD, secret)}`
}

export function isAuthenticated(request: ApiRequest): boolean {
  const token = parseCookies(request)[COOKIE_NAME]
  if (!token) return false

  const [payload, signature, extra] = token.split('.')
  if (extra !== undefined || payload !== SESSION_PAYLOAD || !signature) return false

  const expectedSignature = signPayload(payload, getRequiredEnv('SESSION_SECRET'))
  return safeEqual(signature, expectedSignature)
}

export function setSessionCookie(response: ApiResponse): void {
  const secure = process.env.VERCEL ? '; Secure' : ''
  response.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(createSessionToken())}; Path=/; HttpOnly; SameSite=Strict${secure}`,
  )
}

export function clearSessionCookie(response: ApiResponse): void {
  const secure = process.env.VERCEL ? '; Secure' : ''
  response.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`,
  )
}
