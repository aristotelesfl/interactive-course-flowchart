"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

/**
 * Hook para gerenciar o tema da aplicação
 * Respeita preferência do sistema por padrão
 * Persiste escolha do usuário no localStorage
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [isLoaded, setIsLoaded] = useState(false);

  // Detecta preferência do sistema
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Aplica o tema ao documento
  const applyTheme = useCallback((resolvedTheme: "light" | "dark") => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setResolvedTheme(resolvedTheme);
  }, []);

  // Carrega preferência salva ou usa sistema
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      const initialTheme = saved || "system";
      setTheme(initialTheme);

      const resolved =
        initialTheme === "system" ? getSystemTheme() : initialTheme;
      applyTheme(resolved);
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
      applyTheme(getSystemTheme());
    }
    setIsLoaded(true);
  }, [getSystemTheme, applyTheme]);

  // Escuta mudanças na preferência do sistema
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const setThemeValue = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);

      const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
      applyTheme(resolved);
    },
    [getSystemTheme, applyTheme]
  );

  // Toggle simples entre light e dark
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setThemeValue(newTheme);
  }, [resolvedTheme, setThemeValue]);

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeValue,
    toggleTheme,
    isLoaded,
  };
}
