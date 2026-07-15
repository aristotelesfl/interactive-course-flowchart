"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provider do TanStack Query para toda a aplicação.
 * O client é criado dentro de useState para não ser recriado a cada render.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Dados estáticos (ementas, grades): uma busca por sessão basta.
            staleTime: Infinity,
            gcTime: 1000 * 60 * 60,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
