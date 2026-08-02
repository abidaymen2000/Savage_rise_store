import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { ArrowLeft, CheckCircle, HelpCircle, Mail, MapPin, MessageCircle, Package, PackageCheck, PackageOpen, RefreshCcw, Ruler, Truck } from "lucide-react"

import type {
  StorePageCardsBlock,
  StorePageContactInfoBlock,
  StorePageFaqBlock,
  StorePageHeroBlock,
  StorePageImageBlock,
  StorePageMapBlock,
  StorePagePublicOut,
  StorePageRichTextBlock,
  StorePageTableBlock,
} from "@/lib/api/generated"
import { enabledBlocks } from "@/lib/store-pages/static-pages"
import { cn } from "@/lib/utils"

const iconMap = {
  CheckCircle,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  PackageOpen,
  RefreshCcw,
  Ruler,
  Truck,
}

type IconName = keyof typeof iconMap

export function StorePageShell({ page, children }: { page: StorePagePublicOut; children?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground dark:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <StorePageHeader page={page} />
        {children ?? <StorePageBlocks page={page} />}
      </div>
    </main>
  )
}

export function StorePageHeader({ page, compact = false }: { page: StorePagePublicOut; compact?: boolean }) {
  return (
    <div className={cn("max-w-3xl", compact ? "mb-8" : "mb-12")}>
      <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">{page.title}</h1>
      {page.subtitle ? <p className="text-muted-foreground text-lg leading-relaxed">{page.subtitle}</p> : null}
    </div>
  )
}

export function StorePageBlocks({ page }: { page: StorePagePublicOut }) {
  const blocks = enabledBlocks(page)

  return (
    <div className="space-y-10">
      {blocks.map((block) => {
        if (block.type === "hero") return <HeroBlock key={block.id} block={block as StorePageHeroBlock} />
        if (block.type === "rich_text") return <RichTextBlock key={block.id} block={block as StorePageRichTextBlock} />
        if (block.type === "image") return <ImageBlock key={block.id} block={block as StorePageImageBlock} />
        if (block.type === "cards") return <CardsBlock key={block.id} block={block as StorePageCardsBlock} />
        if (block.type === "faq") return <FaqBlock key={block.id} block={block as StorePageFaqBlock} />
        if (block.type === "table") return <TableBlock key={block.id} block={block as StorePageTableBlock} />
        if (block.type === "contact_info") return <ContactInfoBlock key={block.id} block={block as StorePageContactInfoBlock} />
        if (block.type === "map") return <MapBlock key={block.id} block={block as StorePageMapBlock} />
        return null
      })}
    </div>
  )
}

function HeroBlock({ block }: { block: StorePageHeroBlock }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        {block.eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{block.eyebrow}</p> : null}
        <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">{block.title}</h2>
        {block.subtitle ? <MarkdownText text={block.subtitle} className="text-muted-foreground text-lg leading-relaxed" /> : null}
        {block.cta_label && block.cta_url ? (
          <Link href={block.cta_url} className="mt-8 inline-flex rounded-md bg-accent px-5 py-3 font-semibold text-accent-foreground hover:bg-accent/90">
            {block.cta_label}
          </Link>
        ) : null}
      </div>
      {block.image_url ? (
        <div className="relative">
          <Image src={block.image_url} alt={block.image_alt || block.title} width={560} height={640} className="rounded-lg object-contain" unoptimized />
          <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm font-semibold">FAIT MAIN</div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function RichTextBlock({ block }: { block: StorePageRichTextBlock }) {
  return (
    <section className="max-w-3xl border border-border bg-card p-6 rounded-lg">
      {block.title ? <h2 className="text-xl font-semibold mb-3">{block.title}</h2> : null}
      <MarkdownText text={block.markdown} className="text-muted-foreground leading-relaxed" />
    </section>
  )
}

function ImageBlock({ block }: { block: StorePageImageBlock }) {
  return (
    <figure className={cn("overflow-hidden rounded-lg border border-border", block.alignment === "full" ? "w-full" : "mx-auto max-w-4xl")}>
      <Image src={block.url} alt={block.alt} width={1200} height={720} className="h-auto w-full object-cover" unoptimized />
      {block.caption ? <figcaption className="bg-muted px-4 py-3 text-sm text-muted-foreground">{block.caption}</figcaption> : null}
    </figure>
  )
}

function CardsBlock({ block }: { block: StorePageCardsBlock }) {
  return (
    <section>
      {block.title ? <h2 className="mb-5 text-2xl font-playfair font-bold">{block.title}</h2> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(block.items || []).map((item) => {
          const Icon = iconMap[String(item.icon || "HelpCircle") as IconName] || HelpCircle
          return (
            <article key={`${item.title}-${item.description}`} className="border border-border bg-card p-6 rounded-lg">
              <Icon className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              {item.description ? <p className="text-muted-foreground leading-relaxed">{item.description}</p> : null}
              {item.link_label && item.link_url ? <Link href={item.link_url} className="mt-4 inline-block text-accent hover:underline">{item.link_label}</Link> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function FaqBlock({ block }: { block: StorePageFaqBlock }) {
  return (
    <section className="max-w-3xl">
      {block.title ? <h2 className="mb-5 text-2xl font-playfair font-bold">{block.title}</h2> : null}
      <div className="space-y-3">
        {(block.items || []).map((item) => (
          <details key={item.question} className="rounded-lg border border-border bg-card p-5">
            <summary className="cursor-pointer font-semibold text-foreground dark:text-white">{item.question}</summary>
            <MarkdownText text={item.answer_markdown} className="mt-3 text-muted-foreground leading-relaxed" />
          </details>
        ))}
      </div>
    </section>
  )
}

function TableBlock({ block }: { block: StorePageTableBlock }) {
  return (
    <section>
      {block.title ? <h2 className="mb-5 text-2xl font-playfair font-bold">{block.title}</h2> : null}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-muted text-accent">
            <tr>{block.columns.map((column) => <th key={column} className="p-4 font-semibold">{column}</th>)}</tr>
          </thead>
          <tbody>
            {(block.rows || []).map((row, index) => (
              <tr key={index} className="border-t border-border">
                {row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`} className={cn("p-4", cellIndex === 0 ? "font-semibold text-foreground dark:text-white" : "text-muted-foreground")}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption ? <p className="mt-3 text-sm text-muted-foreground">{block.caption}</p> : null}
    </section>
  )
}

function ContactInfoBlock({ block }: { block: StorePageContactInfoBlock }) {
  return (
    <section className="max-w-3xl border border-accent/30 bg-accent/10 p-6 rounded-lg">
      <div className="flex items-start gap-4">
        <Mail className="h-6 w-6 text-accent mt-1" />
        <div>
          {block.title ? <h2 className="text-xl font-semibold text-accent mb-2">{block.title}</h2> : null}
          {[block.email, block.phone, block.whatsapp, block.address, block.opening_hours].filter(Boolean).map((line) => (
            <p key={line} className="text-muted-foreground mb-2">{line}</p>
          ))}
          <Link href="/contact" className="text-accent hover:underline">Contact customer service</Link>
        </div>
      </div>
    </section>
  )
}

function MapBlock({ block }: { block: StorePageMapBlock }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      {block.title ? <h2 className="p-4 text-xl font-semibold text-accent">{block.title}</h2> : null}
      <iframe
        title={block.label || block.title || "Map"}
        src={block.embed_url}
        width="100%"
        height="320"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  )
}

function MarkdownText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {text.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph}>{renderInlineMarkdown(paragraph)}</p>
      ))}
    </div>
  )
}

function renderInlineMarkdown(text: string) {
  const match = text.match(/^\[(.+)\]\((.+)\)$/)
  if (match) {
    return <Link href={match[2]} className="text-accent hover:underline">{match[1]}</Link>
  }
  return text
}


