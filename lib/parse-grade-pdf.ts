import { BASE_PATH } from "./config";
import { SEMESTRE_OPTATIVAS } from "./data";
import { ordenarDisciplinasParaFluxo } from "./ordenar-disciplinas";
import { gradeIdFromSlugs, removerAcentos, slugify } from "./slug";
import type { Disciplina, Grade } from "./types";

/**
 * Parser do PDF "GRADE CURRICULAR" emitido pelo sisacadg.uece.br.
 *
 * O documento é texto digital (não escaneado) com uma tabela regular:
 *   Semestre  Código  Disciplina  Créditos  Categoria  Pré-requisitos
 * O cabeçalho traz CURSO/TURNO e NÍVEL/FLUXO, que identificam a grade.
 *
 * Roda inteiramente no navegador via pdfjs-dist (import dinâmico para
 * não entrar no bundle inicial nem quebrar o prerender estático).
 */

export class GradeParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GradeParseError";
  }
}

export interface ParsedGrade {
  grade: Grade;
  /** Slug do curso sozinho — chave de cursos/{cursoSlug} no Firestore. */
  cursoSlug: string;
  /** Slug do fluxo sozinho — chave de cursos/{cursoSlug}/fluxos/{fluxoSlug}. */
  fluxoSlug: string;
  /** Problemas não fatais encontrados (ex.: pré-requisito de outro fluxo). */
  warnings: string[];
}

/**
 * Reconstrói as linhas de texto do PDF a partir dos fragmentos do pdf.js,
 * agrupando por coordenada Y (com tolerância) e ordenando por X.
 */
async function extrairLinhas(data: ArrayBuffer): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  // Worker servido de public/ com extensão .js (ver scripts/copy-pdf-worker.mjs).
  pdfjs.GlobalWorkerOptions.workerSrc = `${BASE_PATH}/pdf.worker.min.js`;

  const doc = await pdfjs.getDocument({ data }).promise;
  const linhas: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();

    const porY = new Map<number, { x: number; str: string }[]>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const y = item.transform[5];
      let chave = Math.round(y);
      for (const k of porY.keys()) {
        if (Math.abs(k - y) <= 2) {
          chave = k;
          break;
        }
      }
      const fragmentos = porY.get(chave) ?? [];
      fragmentos.push({ x: item.transform[4], str: item.str });
      porY.set(chave, fragmentos);
    }

    // Y cresce de baixo para cima no PDF: ordena do topo para a base.
    const doTopo = Array.from(porY.entries()).sort((a, b) => b[0] - a[0]);
    for (const [, fragmentos] of doTopo) {
      const linha = fragmentos
        .sort((a, b) => a.x - b.x)
        .map((f) => f.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (linha) linhas.push(linha);
    }
  }

  return linhas;
}

const ROW_RE =
  /^(\d{1,2})\s+([A-Z]{2,3}\d{3})\s+(.+?)\s+(\d+)\s+(\S+)\s+(\S.*)$/;
const CODIGO_RE = /[A-Z]{2,3}\d{3}/g;
const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Detecta ciclo no grafo de pré-requisitos (impossível numa grade real;
 * indica PDF adulterado ou parse corrompido).
 */
function temCicloDePreRequisitos(disciplinas: Disciplina[]): boolean {
  const grafo = new Map(disciplinas.map((d) => [d.id, d.preRequisitos]));
  // 1 = em visita (na pilha), 2 = concluído
  const estado = new Map<string, 1 | 2>();

  const visita = (id: string): boolean => {
    const s = estado.get(id);
    if (s === 1) return true;
    if (s === 2) return false;
    estado.set(id, 1);
    for (const preReq of grafo.get(id) ?? []) {
      if (grafo.has(preReq) && visita(preReq)) return true;
    }
    estado.set(id, 2);
    return false;
  };

  return disciplinas.some((d) => visita(d.id));
}

function extrairCampoCabecalho(
  linhas: string[],
  rotulo: string,
  ateRotulo?: string
): string | null {
  for (const linha of linhas) {
    const semAcento = removerAcentos(linha).toUpperCase();
    const inicio = semAcento.indexOf(`${rotulo}:`);
    if (inicio === -1) continue;

    let trecho = linha.slice(inicio + rotulo.length + 1);
    if (ateRotulo) {
      const fim = removerAcentos(trecho).toUpperCase().indexOf(`${ateRotulo}:`);
      if (fim !== -1) trecho = trecho.slice(0, fim);
    }
    const valor = trecho.trim();
    if (valor) return valor;
  }
  return null;
}

/**
 * Faz o parse do PDF de grade curricular e devolve a Grade estruturada.
 * Lança GradeParseError quando o documento não segue o formato esperado.
 */
export async function parseGradePdf(data: ArrayBuffer): Promise<ParsedGrade> {
  let linhas: string[];
  try {
    linhas = await extrairLinhas(data);
  } catch (e) {
    console.error("Falha na extração de texto do PDF:", e);
    throw new GradeParseError(
      "Não foi possível ler o arquivo. Verifique se é um PDF válido."
    );
  }

  const ehGradeCurricular = linhas.some((l) =>
    removerAcentos(l).toUpperCase().includes("GRADE CURRICULAR")
  );

  const curso = extrairCampoCabecalho(linhas, "CURSO", "TURNO");
  const turno = extrairCampoCabecalho(linhas, "TURNO") ?? "";
  const nivel = extrairCampoCabecalho(linhas, "NIVEL", "FLUXO") ?? "";
  const fluxoBruto = extrairCampoCabecalho(linhas, "FLUXO");
  const fluxo = fluxoBruto?.match(/\d{4}\.\d/)?.[0] ?? fluxoBruto;

  if (!ehGradeCurricular || !curso || !fluxo) {
    throw new GradeParseError(
      "Este PDF não parece ser uma Grade Curricular da UECE. " +
        "Emita o documento em sisacadg.uece.br e tente novamente."
    );
  }

  // Marcadores do documento oficial: rodapé com a URL de validação do
  // sisacadg e um código de validação (UUID). Sem eles, é outro documento.
  const textoCompleto = linhas.join("\n");
  const temMarcadoresOficiais =
    textoCompleto.includes("sisacadg.uece.br") && UUID_RE.test(textoCompleto);
  if (!temMarcadoresOficiais) {
    throw new GradeParseError(
      "O PDF não contém o rodapé de validação da UECE (sisacadg.uece.br). " +
        "Envie o documento oficial, sem edições."
    );
  }

  const warnings: string[] = [];
  const disciplinas: Disciplina[] = [];
  const vistos = new Set<string>();

  for (const linha of linhas) {
    const match = removerAcentos(linha).match(ROW_RE);
    if (!match) continue;

    const [, semestre, id, nome, creditos, categoria, preReqsBrutos] = match;
    const categoriaNorm = categoria.toUpperCase();
    if (categoriaNorm !== "OBRIGATORIA" && categoriaNorm !== "OPTATIVA") {
      continue;
    }
    if (vistos.has(id)) {
      warnings.push(`Disciplina ${id} apareceu mais de uma vez; mantida a primeira.`);
      continue;
    }
    vistos.add(id);

    disciplinas.push({
      id,
      nome: nome.trim(),
      semestre: Number(semestre),
      creditos: Number(creditos),
      preRequisitos: preReqsBrutos.match(CODIGO_RE) ?? [],
    });
  }

  if (disciplinas.length < 5) {
    throw new GradeParseError(
      "Nenhuma tabela de disciplinas reconhecida no PDF. " +
        "O formato pode ter mudado — reporte este documento."
    );
  }

  if (temCicloDePreRequisitos(disciplinas)) {
    throw new GradeParseError(
      "Os pré-requisitos formam um ciclo, o que não existe em uma grade " +
        "real. O documento parece adulterado ou corrompido."
    );
  }

  // Coerência dos semestres regulares: devem começar em 1, sem buracos.
  const regulares = [
    ...new Set(
      disciplinas.map((d) => d.semestre).filter((s) => s !== SEMESTRE_OPTATIVAS)
    ),
  ].sort((a, b) => a - b);
  if (regulares.length > 0 && regulares[regulares.length - 1] > 16) {
    throw new GradeParseError(
      `Semestre "${regulares[regulares.length - 1]}" fora do intervalo esperado — o documento parece corrompido.`
    );
  }

  for (let s = 1; s < regulares.length; s++) {
    if (regulares[s] !== regulares[s - 1] + 1) {
      warnings.push(
        `Não há disciplinas entre o ${regulares[s - 1]}º e o ${regulares[s]}º semestre.`
      );
    }
  }
  for (const d of disciplinas) {
    if (d.creditos < 1 || d.creditos > 30) {
      warnings.push(
        `${d.id} (${d.nome}) tem ${d.creditos} créditos — valor incomum, confira no preview.`
      );
    }
  }

  // Pré-requisitos que não existem na grade (códigos de fluxos antigos são
  // comuns em optativas): mantidos nos dados, mas sinalizados.
  for (const d of disciplinas) {
    for (const preReq of d.preRequisitos) {
      if (!vistos.has(preReq)) {
        warnings.push(
          `${d.id} (${d.nome}) exige ${preReq}, que não está nesta grade.`
        );
      }
    }
  }

  const cursoSlug = slugify(curso);
  const fluxoSlug = slugify(fluxo);

  return {
    grade: {
      id: gradeIdFromSlugs(cursoSlug, fluxoSlug),
      curso,
      nivel,
      turno,
      fluxo,
      disciplinas: ordenarDisciplinasParaFluxo(disciplinas),
    },
    cursoSlug,
    fluxoSlug,
    warnings,
  };
}
