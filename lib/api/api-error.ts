import { ApiError as GeneratedApiError } from "./generated"

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === "string" && body.trim()) return body
  if (body && typeof body === "object") {
    const detail = (body as Record<string, unknown>).detail
    if (typeof detail === "string" && detail.trim()) return detail
    if (Array.isArray(detail)) {
      const first = detail.find((item) => item && typeof item === "object" && typeof (item as Record<string, unknown>).msg === "string")
      if (first && typeof (first as Record<string, unknown>).msg === "string") {
        return (first as Record<string, unknown>).msg as string
      }
    }
    const message = (body as Record<string, unknown>).message
    if (typeof message === "string" && message.trim()) return message
  }
  return fallback
}

export async function withApiErrors<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof GeneratedApiError) {
      throw new ApiError(error.status, error.body, getErrorMessage(error.body, error.message))
    }
    throw error
  }
}

