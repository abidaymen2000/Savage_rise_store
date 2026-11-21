/** A response only belongs to the request that is still current. */
export function quoteRequestGate() {
  let generation = 0
  return {
    start: () => ++generation,
    cancel: () => { generation += 1 },
    accepts: (request: number) => request === generation,
  }
}

export function quoteForInput<T>(result: { key: string; quote: T } | null, key: string, enabled: boolean): T | null {
  return enabled && result?.key === key ? result.quote : null
}
