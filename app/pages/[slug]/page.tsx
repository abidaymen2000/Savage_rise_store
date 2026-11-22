import { notFound } from "next/navigation"
import { StorePageShell } from "@/components/store-pages/store-page-renderer"
import { getStudioDocument } from "@/lib/studio-server"
export const dynamic = "force-dynamic"
export default async function Page({ params }: { params: { slug: string } }) {
  const document = await getStudioDocument()
  const page = document?.pages.find(item => item.slug === params.slug)
  if (!page) notFound()
  return <StorePageShell page={page}/>
}
