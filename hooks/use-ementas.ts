"use client";

import { useQuery } from "@tanstack/react-query";
import { BASE_PATH } from "@/lib/config";
import type { Ementas } from "@/lib/types";

async function fetchEmentas(): Promise<Ementas> {
  const res = await fetch(`${BASE_PATH}/data/ementas.json`);
  if (!res.ok) {
    throw new Error(`Falha ao carregar ementas (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Carrega o mapa completo de ementas uma única vez e o mantém em cache
 * (staleTime: Infinity). Todas as chamadas compartilham a mesma query,
 * então abrir várias disciplinas não gera novas requisições.
 */
export function useEmentas() {
  return useQuery({
    queryKey: ["ementas"],
    queryFn: fetchEmentas,
  });
}

/**
 * Retorna a ementa de uma disciplina específica a partir do cache.
 */
export function useEmenta(disciplinaId: string | undefined) {
  const { data, isLoading, isError } = useEmentas();
  return {
    ementa: disciplinaId ? data?.[disciplinaId] : undefined,
    isLoading,
    isError,
  };
}
