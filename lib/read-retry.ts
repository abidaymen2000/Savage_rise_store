export function isTemporaryReadError(error: unknown): boolean {
  const status = error && typeof error === "object" && "status" in error ? Number(error.status) : 0
  return !status || status === 408 || status === 429 || status >= 500
}

const delay = (ms: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
  if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return }
  const abort = () => { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")) }
  const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve() }, ms)
  signal.addEventListener("abort", abort, { once: true })
})

/** Only read-only requests (catalogue and quote) are retried. Order submission keeps its idempotency key. */
export async function retryReadOnly<T>(load: () => Promise<T>, signal: AbortSignal, wait = delay): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError")
    try { return await load() } catch (error) {
      if (signal.aborted || !isTemporaryReadError(error) || attempt >= 2) throw error
      await wait([600, 1800][attempt], signal)
    }
  }
}
