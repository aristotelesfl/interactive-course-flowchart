"use client";

import { memo, useEffect, useState, useCallback } from "react";
import type { Conexao } from "@/lib/types";
import { disciplinas } from "@/lib/data";

interface ConnectionLinesProps {
  fluxoDestacado: Set<string>;
  hasHover: boolean;
}

/**
 * Componente SVG que renderiza as linhas de conexão entre disciplinas
 */
export const ConnectionLines = memo(function ConnectionLines({
  fluxoDestacado,
  hasHover,
}: ConnectionLinesProps) {
  const [conexoes, setConexoes] = useState<Conexao[]>([]);

  /**
   * Calcula as posições das conexões baseado nos elementos DOM
   */
  const calcularConexoes = useCallback(() => {
    const container = document.getElementById("flowchart-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const novasConexoes: Conexao[] = [];

    disciplinas.forEach((d) => {
      if (!d.preRequisito) return;

      const elementoOrigem = container.querySelector(
        `[data-id="${d.preRequisito}"]`
      );
      const elementoDestino = container.querySelector(`[data-id="${d.id}"]`);

      if (!elementoOrigem || !elementoDestino) return;

      const origemRect = elementoOrigem.getBoundingClientRect();
      const destinoRect = elementoDestino.getBoundingClientRect();

      novasConexoes.push({
        de: d.preRequisito,
        para: d.id,
        dePos: {
          x: origemRect.right - containerRect.left,
          y: origemRect.top + origemRect.height / 2 - containerRect.top,
        },
        paraPos: {
          x: destinoRect.left - containerRect.left,
          y: destinoRect.top + destinoRect.height / 2 - containerRect.top,
        },
      });
    });

    setConexoes(novasConexoes);
  }, []);

  useEffect(() => {
    // Aguarda o DOM estar pronto e calcula
    const timeoutId = setTimeout(calcularConexoes, 100);

    window.addEventListener("resize", calcularConexoes);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calcularConexoes);
    };
  }, [calcularConexoes]);

  /**
   * Verifica se uma conexão faz parte do fluxo destacado
   */
  const isConexaoDestacada = (conexao: Conexao): boolean => {
    return fluxoDestacado.has(conexao.de) && fluxoDestacado.has(conexao.para);
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Filtro de brilho para conexões destacadas */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {conexoes.map((conexao, index) => {
        const isDestacada = isConexaoDestacada(conexao);
        const isDimmed = hasHover && !isDestacada;

        // Calcula pontos de controle para curva Bezier
        const dx = conexao.paraPos.x - conexao.dePos.x;
        const ctrl1X = conexao.dePos.x + dx * 0.4;
        const ctrl2X = conexao.paraPos.x - dx * 0.4;

        const pathD = `M ${conexao.dePos.x} ${conexao.dePos.y} 
                       C ${ctrl1X} ${conexao.dePos.y}, 
                         ${ctrl2X} ${conexao.paraPos.y}, 
                         ${conexao.paraPos.x} ${conexao.paraPos.y}`;

        return (
          <path
            key={`${conexao.de}-${conexao.para}-${index}`}
            d={pathD}
            fill="none"
            className={`transition-all duration-300 ${
              isDestacada
                ? "stroke-primary stroke-[2.5px]"
                : "stroke-muted-foreground/40 stroke-[1.5px]"
            } ${isDimmed ? "opacity-20" : "opacity-100"}`}
            filter={isDestacada ? "url(#glow)" : undefined}
          />
        );
      })}
    </svg>
  );
});
