"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

/**
 * Wrapper fino sobre next-themes, mantendo a mesma forma que os
 * componentes já esperavam (resolvedTheme/toggleTheme/isLoaded) — a
 * detecção de preferência do sistema, persistência e o anti-flash
 * agora são responsabilidade da lib (ver components/theme-provider.tsx).
 */
export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  // next-themes só resolve o tema real do sistema após montar no
  // cliente; até lá, resolvedTheme vem undefined.
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    resolvedTheme: (isLoaded && resolvedTheme === "dark"
      ? "dark"
      : "light") as "light" | "dark",
    toggleTheme,
    isLoaded,
  };
}
