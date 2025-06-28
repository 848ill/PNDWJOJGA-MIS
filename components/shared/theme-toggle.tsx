"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  // State to ensure the component only renders on the client to avoid hydration errors.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before the client has mounted, render a static placeholder to prevent layout shift.
  if (!mounted) {
    return <div style={{ width: 60, height: 34 }} className="rounded-full bg-zinc-200 dark:bg-zinc-700" />
  }

  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <div
      onClick={toggleTheme}
      className={`relative flex h-[34px] w-[60px] cursor-pointer items-center rounded-full p-1 transition-colors ${
        isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
      }`}
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDarkMode}
    >
      {/* The moving thumb */}
      <motion.div
        className="absolute flex h-[26px] w-[26px] items-center justify-center rounded-full bg-blue-600 shadow-md"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        {/* The active icon inside the thumb */}
        {isDarkMode ? (
          <Moon size={16} className="text-white" />
        ) : (
          <Sun size={16} className="text-white" />
        )}
      </motion.div>

      {/* Faint icons on the track (rendered on top but thumb moves over them) */}
      <div className="absolute inset-0 flex items-center justify-between p-[7px]">
        <Sun size={18} className="text-zinc-400" />
        <Moon size={18} className="text-zinc-400" />
      </div>
    </div>
  )
}