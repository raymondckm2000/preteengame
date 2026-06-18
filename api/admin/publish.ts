import { isAuthenticated } from '../_lib/auth.js'
import { validateApiGameData } from '../_lib/gameData.js'
import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js'
import type { ApiRequest, ApiResponse } from '../_lib/http.js'

const GAME_DATA_PATH = 'src/data/game-data.json'

interface GitHubContentResponse {
  sha?: unknown
  content?: unknown
}

interface GitHubUpdateResponse {
  commit?: {
    sha?: unknown
    html_url?: unknown
  }
  content?: {
    sha?: unknown
    path?: unknown
  }
}

function getRequiredEnv(name: 'GITHUB_TOKEN' | 'GITHUB_OWNER' | 'GITHUB_REPO' | 'GITHUB_BRANCH'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function getGitHubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

async function readGitHubError(response: Response): Promise<string> {
  try {
    const body = await response.json() as { message?: unknown }
    if (typeof body.message === 'string' && body.message.trim()) return body.message
  } catch {
    // Fall through to generic message.
  }

  return `GitHub API returned ${response.status}.`
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (!allowMethods(request, response, ['POST'])) return

  try {
    if (!isAuthenticated(request)) {
      sendJson(response, 401, { error: '尚未登入。' })
      return
    }

    const body = await readJsonBody(request)
    const validatedData = validateApiGameData(body)
    const token = getRequiredEnv('GITHUB_TOKEN')
    const owner = getRequiredEnv('GITHUB_OWNER')
    const repo = getRequiredEnv('GITHUB_REPO')
    const branch = getRequiredEnv('GITHUB_BRANCH')
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${GAME_DATA_PATH}`
    const headers = getGitHubHeaders(token)

    const currentFileResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
      method: 'GET',
      headers,
    })

    if (!currentFileResponse.ok) {
      sendJson(response, currentFileResponse.status, {
        error: `無法讀取 GitHub 題庫檔案：${await readGitHubError(currentFileResponse)}`,
      })
      return
    }

    const currentFile = await currentFileResponse.json() as GitHubContentResponse
    if (typeof currentFile.sha !== 'string') {
      sendJson(response, 502, { error: 'GitHub 回應缺少現有檔案 SHA。' })
      return
    }

    const jsonContent = `${JSON.stringify(validatedData, null, 2)}\n`
    const encodedContent = Buffer.from(jsonContent, 'utf8').toString('base64')
    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'chore: update preteen game question bank',
        content: encodedContent,
        sha: currentFile.sha,
        branch,
      }),
    })

    if (!updateResponse.ok) {
      sendJson(response, updateResponse.status, {
        error: `無法發布到 GitHub：${await readGitHubError(updateResponse)}`,
      })
      return
    }

    const updateResult = await updateResponse.json() as GitHubUpdateResponse
    sendJson(response, 200, {
      published: true,
      branch,
      path: GAME_DATA_PATH,
      commitSha: typeof updateResult.commit?.sha === 'string' ? updateResult.commit.sha : null,
      commitUrl: typeof updateResult.commit?.html_url === 'string' ? updateResult.commit.html_url : null,
      contentSha: typeof updateResult.content?.sha === 'string' ? updateResult.content.sha : null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '發布失敗。'
    console.error('[Admin publish]', error)
    sendJson(response, 400, { error: message })
  }
}
