"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY_PREFIX = "disciplinas-concluidas";

/**
 * Hook para gerenciar o progresso do curso
 * Persiste disciplinas concluídas no localStorage, isolado por grade (gradeId)
 */
export function useProgress(gradeId: string) {
  const [concluidas, setConcluidas] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const storageKey = `${STORAGE_KEY_PREFIX}:${gradeId}`;

  // Carrega dados do localStorage quando a grade muda
  useEffect(() => {
    setIsLoaded(false);
    try {
      const saved = localStorage.getItem(storageKey);
      setConcluidas(saved ? new Set(JSON.parse(saved) as string[]) : new Set());
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      setConcluidas(new Set());
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Salva no localStorage quando mudar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(Array.from(concluidas))
        );
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
      }
    }
  }, [concluidas, isLoaded, storageKey]);

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

  return {
    concluidas,
    toggleConcluida,
    isConcluida,
    isLoaded,
  };
}
