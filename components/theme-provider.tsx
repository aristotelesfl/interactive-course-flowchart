"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Wrapper fino do next-themes: aplica a classe "dark" no <html> (mesma
 * convenção do @custom-variant em app/globals.css), persiste a escolha
 * e evita o flash do tema errado no primeiro paint — tudo isso a lib já
 * resolve, incluindo o script anti-flash injetado automaticamente.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme-preference"
    >
      {children}
    </NextThemesProvider>
  );
}
