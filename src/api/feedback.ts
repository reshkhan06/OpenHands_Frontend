const API_BASE_URL = 'http://localhost:8000'

export interface FeedbackRequest {
  name: string
  email: string
  category: string
  message: string
  rating: number
  follow_up: boolean
}

export interface FeedbackResponse {
  feedback_id: number
  message: string
  created_at: string
}

function parseDetail(detail: unknown, fallback: string): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const messages = detail
      .map((d: { msg?: string }) => d?.msg)
      .filter((m): m is string => typeof m === 'string' && m.length > 0)
    return messages.length ? messages.join('. ') : fallback
  }
  return fallback
}

export async function submitFeedback(data: FeedbackRequest): Promise<FeedbackResponse> {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(parseDetail(body.detail, 'Failed to submit feedback'))
  }
  return body as FeedbackResponse
}

