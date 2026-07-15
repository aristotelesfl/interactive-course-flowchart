/**
 * Remove acentos (NFD) de um texto — usado tanto pra slug quanto pra
 * normalizar texto extraído de PDF antes de comparações/regex.
 */
export function removerAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Slug determinístico usado tanto para IDs de documentos no Firestore
 * quanto para os query params da URL (?curso=...&fluxo=...). curso e
 * fluxo são "sluggificados" separadamente para formar a hierarquia
 * cursos/{cursoSlug}/fluxos/{fluxoSlug}; o ID da grade completa
 * (grades/{gradeId}) é sempre `${cursoSlug}-${fluxoSlug}` — os dois
 * lados do app (parser e leitura por query param) precisam usar
 * exatamente esta mesma função para os slugs continuarem batendo.
 */
export function slugify(texto: string): string {
  return removerAcentos(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function gradeIdFromSlugs(cursoSlug: string, fluxoSlug: string): string {
  return `${cursoSlug}-${fluxoSlug}`;
}
