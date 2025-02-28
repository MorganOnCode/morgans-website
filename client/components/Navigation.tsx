"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Home, PenTool, Sun, Moon, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { CommandMenu } from "./CommandMenu"

// Navigation component provides a header with navigation links and a theme toggle button.
export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to trigger the command menu
  const triggerCommandMenu = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
      })
    )
  }

  return (
    <>
      <CommandMenu />
      <div className="flex justify-center w-full">
        <header className="sticky top-4 z-50 w-[60%] md:w-[55%] lg:w-[50%] rounded-lg border bg-background" data-testid="navigation">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Navigation Links Section */}
            <div className="flex">
              <Link href="/" className="mr-4 flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span className="font-bold">Home</span>
              </Link>
              <Link href="/essays" className="mr-4 flex items-center space-x-2">
                <PenTool className="h-5 w-5" />
                <span>Essays</span>
              </Link>
              <Link href="/emotions" className="mr-4 flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Emotions</span>
              </Link>
            </div>
            
            {/* Search and Theme Toggle */}
            <div className="flex items-center space-x-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="relative h-9 w-9 transition-colors hover:bg-muted"
                  data-testid="theme-toggle"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                className="relative h-9 px-3 text-sm md:pr-12 lg:w-40"
                onClick={triggerCommandMenu}
                data-testid="search-button"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden md:inline-flex">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                  ⌘K
                </kbd>
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  )
} 