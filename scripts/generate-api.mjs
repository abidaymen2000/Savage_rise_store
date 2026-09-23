import { mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { createRequire } from "node:module"
import { spawnSync } from "node:child_process"
import { CORE_PREFIX, GATEWAY_ORIGIN, normalizeCoreBaseUrl } from "../lib/api/gateway-config.mjs"


// Server-side codegen only. The runtime API base stays the shared public gateway.
const schemaOrigin = process.env.GATEWAY_SCHEMA_ORIGIN || GATEWAY_ORIGIN
const schemaSource = new URL(schemaOrigin)
if (schemaSource.origin !== GATEWAY_ORIGIN &&
    !(schemaSource.protocol === "http:" && ["localhost", "127.0.0.1"].includes(schemaSource.hostname))) {
  throw new Error("GATEWAY_SCHEMA_ORIGIN must be the public gateway or a loopback local gateway")
}
if (schemaSource.username || schemaSource.password || schemaSource.pathname !== "/" || schemaSource.search || schemaSource.hash) {
  throw new Error("GATEWAY_SCHEMA_ORIGIN must be an origin")
}
export const schemaUrl = `${schemaSource.origin}/docs/schemas/core.json`

const projectRoot = fileURLToPath(new URL("../", import.meta.url))
const require = createRequire(import.meta.url)
const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head", "trace"])

// Derive the required methods/paths from the services actually used by wrappers.
// An admin-only schema must never replace the existing storefront client.
export async function getRequiredOperations(root = projectRoot) {
  const apiDirectory = path.join(root, "lib/api")
  const calls = new Map()
  for (const name of await readdir(apiDirectory)) {
    if (!name.endsWith(".ts")) continue
    const source = await readFile(path.join(apiDirectory, name), "utf8")
    for (const [, service, method] of source.matchAll(/(\w+Service)\.(\w+)\(/g)) {
      if (!calls.has(service)) calls.set(service, new Set())
      calls.get(service).add(method)
    }
  }
  const required = [{ method: "post", path: "/analytics/{company_slug}/events" }]
  for (const [service, usedMethods] of calls) {
    const source = await readFile(path.join(apiDirectory, "generated/services", `${service}.ts`), "utf8")
    for (const block of source.split("public static ").slice(1)) {
      const name = block.match(/^(\w+)\(/)?.[1]
      if (!usedMethods.has(name)) continue
      const method = block.match(/method: '([A-Z]+)'/)?.[1].toLowerCase()
      const route = block.match(/url: '([^']+)'/)?.[1]
      if (!method || !route) throw new Error(`Cannot inspect ${service}.${name}`)
      required.push({ method, path: route })
      usedMethods.delete(name)
    }
    if (usedMethods.size) throw new Error(`Missing generated methods in ${service}: ${[...usedMethods].join(", ")}`)
  }
  return required
}

export function normalizeCoreSchema(schema, requiredOperations) {
  if (!schema || !/^3\./.test(schema.openapi) || !schema.info?.version || !schema.paths ||
      typeof schema.paths !== "object" || Array.isArray(schema.paths) || !Object.keys(schema.paths).length) {
    throw new Error("The gateway did not return a valid, non-empty OpenAPI 3 schema")
  }
  // Discovery currently returns servers:[{url:'/'}] and prefixed paths. Fail
  // closed if that contract changes, instead of guessing another public route.
  if (schema.servers?.length !== 1 || new URL(schema.servers[0].url, GATEWAY_ORIGIN).href !== `${GATEWAY_ORIGIN}/`) {
    throw new Error("Unexpected Core servers: expected the gateway root with /api/core in paths")
  }
  const normalized = structuredClone(schema)
  normalized.servers = [{ url: normalizeCoreBaseUrl(GATEWAY_ORIGIN) }]
  normalized.paths = {}
  for (const [route, item] of Object.entries(schema.paths)) {
    if (!route.startsWith(`${CORE_PREFIX}/`) || route.startsWith(`${CORE_PREFIX}${CORE_PREFIX}/`)) {
      throw new Error(`Unexpected Core path: ${route}`)
    }
    if (item.servers || item.$ref) throw new Error(`Unsupported path override: ${route}`)
    for (const [method, operation] of Object.entries(item)) {
      if (methods.has(method) && (!operation.operationId || operation.servers)) {
        throw new Error(`Missing operationId or unexpected server override: ${method} ${route}`)
      }
    }
    normalized.paths[route.slice(CORE_PREFIX.length)] = structuredClone(item)
  }
  // Path parameter names are not part of HTTP routing (slug vs company_slug).
  const signature = (route) => route.replace(/\{[^}]+\}/g, "{}")
  const available = new Map(Object.entries(normalized.paths).map(([route, item]) => [signature(route), item]))
  const missing = requiredOperations.filter(({ method, path: route }) => !available.get(signature(route))?.[method])
  if (missing.length) {
    throw new Error(`Core schema is missing storefront operations (${missing.length}): ${missing.map(({ method, path: route }) => `${method.toUpperCase()} ${CORE_PREFIX}${route}`).join(", ")}. Existing client preserved.`)
  }
  return normalized
}

export async function downloadCoreSchema({ username = process.env.DOCS_USERNAME, password = process.env.DOCS_PASSWORD, fetchImpl = fetch } = {}) {
  if (!username || !password) throw new Error("Set DOCS_USERNAME and DOCS_PASSWORD for api:generate (never NEXT_PUBLIC_*)")
  const response = await fetchImpl(schemaUrl, {
    headers: { Accept: "application/json", Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}` },
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`Core schema download failed: HTTP ${response.status}. Existing client preserved.`)
  return response.json()
}

export async function generateApi({ root = projectRoot, download = downloadCoreSchema, sourceLabel = schemaUrl } = {}) {
  const schema = normalizeCoreSchema(await download(), await getRequiredOperations(root))
  const apiDirectory = path.join(root, "lib/api")
  const destination = path.join(apiDirectory, "generated")
  const staging = await mkdtemp(path.join(apiDirectory, ".generate-"))
  const output = path.join(staging, "generated")
  const backup = path.join(staging, "previous")
  let previousMoved = false
  let installed = false
  try {
    const input = path.join(staging, "core.json")
    await writeFile(input, JSON.stringify(schema))
    const cli = require.resolve("openapi-typescript-codegen/bin/index.js")
    const result = spawnSync(process.execPath, [cli, "--input", input, "--output", output, "--client", "fetch", "--useOptions", "--useUnionTypes"], { stdio: "inherit", cwd: root })
    if (result.error || result.status !== 0) throw new Error("OpenAPI generation failed. Existing client preserved.")
    await readFile(path.join(output, "core/OpenAPI.ts"), "utf8")
    await rename(destination, backup)
    previousMoved = true
    await rename(output, destination)
    installed = true
    console.log(`Generated ./lib/api/generated from ${sourceLabel}`)
  } finally {
    if (previousMoved && !installed) await rename(backup, destination)
    await rm(staging, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  generateApi().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
