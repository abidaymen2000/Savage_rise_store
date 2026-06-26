"use client"

import type { MetaEventContext } from "@/types/api"

const FBCLID_STORAGE_KEY = "savage-rise-fbclid"

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const prefix = `${name}=`
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!cookie) return null
  const value = cookie.slice(prefix.length)
  return value ? decodeURIComponent(value) : null
}

function getStoredFbclid(): string | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(FBCLID_STORAGE_KEY)
}

function setStoredFbclid(value: string | null) {
  if (typeof window === "undefined") return
  if (value) {
    window.sessionStorage.setItem(FBCLID_STORAGE_KEY, value)
  } else {
    window.sessionStorage.removeItem(FBCLID_STORAGE_KEY)
  }
}

export function captureFbclidFromLocation(): void {
  if (typeof window === "undefined") return
  const fbclid = new URLSearchParams(window.location.search).get("fbclid")
  if (fbclid) {
    setStoredFbclid(fbclid)
  }
}

function buildFbc(fbclid: string | null): string | null {
  if (!fbclid) return null
  return `fb.1.${Date.now()}.${fbclid}`
}

export function getMetaEventContext(): MetaEventContext | null {
  if (typeof window === "undefined") return null

  captureFbclidFromLocation()

  const fbclid = new URLSearchParams(window.location.search).get("fbclid") ?? getStoredFbclid()
  const fbp = readCookie("_fbp")
  const fbc = readCookie("_fbc") ?? buildFbc(fbclid)

  return {
    event_source_url: window.location.href,
    fbp,
    fbc,
    fbclid,
    consent: null,
  }
}
