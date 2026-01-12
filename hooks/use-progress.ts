"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { disciplinas } from "@/lib/data";

const STORAGE_KEY = "disciplinas-concluidas";

/**
 * Hook para gerenciar o progresso do curso
 * Persiste disciplinas concluídas no localStorage
 */
export function useProgress() {
  const [concluidas, setConcluidas] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega dados do localStorage na montagem
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        setConcluidas(new Set(ids));
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
    setIsLoaded(true);
  }, []);

  // Salva no localStorage quando mudar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(concluidas))
        );
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
      }
    }
  }, [concluidas, isLoaded]);

  const toggleConcluida = useCallback((id: string) => {
    setConcluidas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isConcluida = useCallback(
    (id: string) => concluidas.has(id),
    [concluidas]
  );

  // Estatísticas de progresso
  const stats = useMemo(() => {
    const total = disciplinas.length;
    const completadas = concluidas.size;
    const percentual = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return { total, completadas, percentual };
  }, [concluidas]);

  return {
    concluidas,
    toggleConcluida,
    isConcluida,
    stats,
    isLoaded,
  };
}
