"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all duration-300 hover:bg-gradient-to-br hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950 hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 hover:border-lemon-lime-300 dark:hover:border-lemon-lime-700 focus:outline-none focus:ring-2 focus:ring-lemon-lime-400 focus:ring-offset-2 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
      aria-label="Toggle theme"
    >
      <svg
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
