import { notFound } from "next/navigation"
import AnalyticsDiagnosticsClient from "./AnalyticsDiagnosticsClient"

export default function AnalyticsDiagnosticsPage() {
  if (process.env.NODE_ENV !== "development") notFound()
  return <AnalyticsDiagnosticsClient />
}
