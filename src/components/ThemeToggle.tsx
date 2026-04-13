"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const fromDom = document.documentElement.dataset.theme;
      return fromDom === "dark" ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <span
        aria-hidden
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground"
      >
        {theme === "dark" ? "☾" : "☀"}
      </span>
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
