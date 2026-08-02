"use client"

import { useEffect, useState } from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const themeOptions = [
  { value: "system", label: "Systeme", mobileLabel: "Systeme", icon: Laptop },
  { value: "light", label: "Clair", mobileLabel: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", mobileLabel: "Sombre", icon: Moon },
]

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const Icon = resolvedTheme === "dark" ? Sun : Moon

  if (mobile) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 text-card-foreground dark:border-white/10 dark:bg-white/[0.03]">
        <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-white/45">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const OptionIcon = option.icon
            const selected = theme === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-label={`Use ${option.label} theme`}
                onClick={() => setTheme(option.value)}
                className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-foreground hover:border-accent/40 hover:text-accent dark:border-white/10 dark:text-white dark:hover:border-gold/40 dark:hover:text-gold"
                }`}
              >
                <OptionIcon className="h-4 w-4" />
                {option.mobileLabel}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={150}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Choose theme"
                className="text-foreground hover:text-accent focus-visible:ring-2 focus-visible:ring-accent dark:text-white dark:hover:text-gold"
              >
                <Icon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Theme</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground dark:border-gray-800 dark:bg-black">
          <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
            {themeOptions.map((option) => {
              const OptionIcon = option.icon
              return (
                <DropdownMenuRadioItem key={option.value} value={option.value} className="text-popover-foreground hover:text-accent dark:text-white dark:hover:text-gold">
                  <OptionIcon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
