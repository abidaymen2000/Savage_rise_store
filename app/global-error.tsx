"use client"
import StoreError from "./error"
export default function GlobalError({reset}:{reset:()=>void}) { return <html lang="fr"><body><StoreError reset={reset}/></body></html> }
