"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { BASE_PATH } from "@/lib/config";
import { firebaseConfigurado, getDb } from "@/lib/firebase";
import { gradeIdFromSlugs } from "@/lib/slug";
import type { CursoIdentidade, FluxoIndexEntry, Grade } from "@/lib/types";

/** Curso/fluxo exibidos por padrão enquanto não há seleção na UI. */
export const DEFAULT_CURSO_SLUG = "ciencia-da-computacao-bacharelado";
export const DEFAULT_FLUXO_SLUG = "2023-1";
export const DEFAULT_GRADE_ID = gradeIdFromSlugs(
  DEFAULT_CURSO_SLUG,
  DEFAULT_FLUXO_SLUG
);

/**
 * Fonte dos dados: Firestore primeiro (grades cadastradas pela
 * comunidade), com fallback nos JSONs estáticos de public/data (grades
 * "seed" que já nascem com o deploy). Se o Firebase ainda não estiver
 * configurado ou estiver fora do ar, o app continua funcionando com os
 * estáticos.
 *
 * A hierarquia cursos/{cursoSlug}/fluxos/{fluxoSlug} existe para a
 * busca de curso não crescer linearmente com cada fluxo novo: listar
 * cursos é uma query pequena (um doc por curso, não por fluxo); os
 * fluxos de um curso só são buscados quando o curso é selecionado.
 */

async function fetchGradeFirestore(gradeId: string): Promise<Grade | null> {
  if (!firebaseConfigurado) return null;
  try {
    const snap = await getDoc(doc(getDb(), "grades", gradeId));
    return snap.exists() ? (snap.data() as Grade) : null;
  } catch (e) {
    console.error("Firestore indisponível ao buscar grade:", e);
    return null;
  }
}

async function fetchGradeEstatica(gradeId: string): Promise<Grade | null> {
  const res = await fetch(`${BASE_PATH}/data/grades/${gradeId}.json`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchGrade(gradeId: string): Promise<Grade> {
  const grade =
    (await fetchGradeFirestore(gradeId)) ?? (await fetchGradeEstatica(gradeId));
  if (!grade) {
    throw new Error(`Grade "${gradeId}" não encontrada.`);
  }
  return grade;
}

async function fetchCursosEstaticos(): Promise<CursoIdentidade[]> {
  const res = await fetch(`${BASE_PATH}/data/cursos.json`);
  return res.ok ? res.json() : [];
}

async function fetchCursos(): Promise<CursoIdentidade[]> {
  const porSlug = new Map<string, CursoIdentidade>();

  for (const curso of await fetchCursosEstaticos()) {
    porSlug.set(curso.slug, curso);
  }

  if (firebaseConfigurado) {
    try {
      const snap = await getDocs(collection(getDb(), "cursos"));
      snap.forEach((docSnap) => {
        const curso = docSnap.data() as CursoIdentidade;
        porSlug.set(curso.slug, curso);
      });
    } catch (e) {
      console.error("Firestore indisponível ao listar cursos:", e);
    }
  }

  if (porSlug.size === 0) {
    throw new Error("Falha ao carregar o índice de cursos.");
  }

  return Array.from(porSlug.values()).sort((a, b) =>
    a.curso.localeCompare(b.curso)
  );
}

async function fetchFluxosEstaticos(
  cursoSlug: string
): Promise<FluxoIndexEntry[]> {
  const res = await fetch(`${BASE_PATH}/data/fluxos/${cursoSlug}.json`);
  return res.ok ? res.json() : [];
}

async function fetchFluxos(cursoSlug: string): Promise<FluxoIndexEntry[]> {
  const porSlug = new Map<string, FluxoIndexEntry>();

  for (const fluxo of await fetchFluxosEstaticos(cursoSlug)) {
    porSlug.set(fluxo.id, fluxo);
  }

  if (firebaseConfigurado) {
    try {
      const snap = await getDocs(
        collection(getDb(), "cursos", cursoSlug, "fluxos")
      );
      snap.forEach((docSnap) => {
        const fluxo = docSnap.data() as FluxoIndexEntry;
        porSlug.set(fluxo.id, fluxo);
      });
    } catch (e) {
      console.error("Firestore indisponível ao listar fluxos:", e);
    }
  }

  // Mais recente primeiro — funciona bem para os padrões de fluxo da
  // UECE (ex.: "2023.1" > "2016.2" na ordenação lexicográfica).
  return Array.from(porSlug.values()).sort((a, b) =>
    b.fluxo.localeCompare(a.fluxo)
  );
}

/**
 * Carrega a grade curricular completa de um curso+fluxo, com cache por
 * gradeId (staleTime: Infinity vem do QueryProvider).
 */
export function useGrade(gradeId: string = DEFAULT_GRADE_ID) {
  return useQuery({
    queryKey: ["grade", gradeId],
    queryFn: () => fetchGrade(gradeId),
  });
}

/** Lista de cursos disponíveis (estáticos + Firestore), para a busca. */
export function useCursos() {
  return useQuery({
    queryKey: ["cursos"],
    queryFn: fetchCursos,
  });
}

/**
 * Lista de fluxos de um curso específico. Só busca quando um curso já
 * foi selecionado (cursoSlug undefined mantém a query desabilitada).
 */
export function useFluxos(cursoSlug: string | undefined) {
  return useQuery({
    queryKey: ["fluxos", cursoSlug],
    queryFn: () => fetchFluxos(cursoSlug!),
    enabled: Boolean(cursoSlug),
  });
}
