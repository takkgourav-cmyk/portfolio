"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    // Keep dark mode permanently active
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return null;
}
