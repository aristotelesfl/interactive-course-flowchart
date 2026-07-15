"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inicializarAppCheck } from "@/lib/firebase";

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
            // Sem retry: os dados vêm do Firestore ou de um JSON estático
            // — um "não encontrado" não vira "encontrado" tentando de
            // novo, então falha uma vez e mostra o erro.
            retry: false,
          },
        },
      })
  );

  // O quanto antes, antes de qualquer chamada ao Firestore acontecer
  // nos componentes filhos.
  useEffect(() => {
    inicializarAppCheck();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
