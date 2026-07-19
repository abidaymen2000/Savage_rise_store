import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

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
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentPath = context.parentURL?.startsWith("file:") ? fileURLToPath(context.parentURL) : projectRoot
    const basePath = path.resolve(path.dirname(parentPath), specifier)
    for (const suffix of candidateSuffixes) {
      try {
        return await defaultResolve(pathToFileURL(basePath + suffix).href, context, defaultResolve)
      } catch {
      }
    }
  }
  return defaultResolve(specifier, context, defaultResolve)
}
