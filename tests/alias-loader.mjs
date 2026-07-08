import path from "node:path"
import { pathToFileURL } from "node:url"

const projectRoot = path.resolve(import.meta.dirname, "..")
const candidateSuffixes = [".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx", "/index.js", "/index.mjs"]

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith("@/")) {
    const relativePath = specifier.slice(2)
    for (const suffix of candidateSuffixes) {
      const candidatePath = path.join(projectRoot, relativePath + suffix)
      try {
        return await defaultResolve(pathToFileURL(candidatePath).href, context, defaultResolve)
      } catch {
      }
    }
    return defaultResolve(pathToFileURL(path.join(projectRoot, relativePath)).href, context, defaultResolve)
  }
  return defaultResolve(specifier, context, defaultResolve)
}
