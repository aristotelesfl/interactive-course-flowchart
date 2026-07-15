"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowchart } from "@/hooks/use-flowchart";
import { getDisciplinasPorSemestre, getSemestreLabel } from "@/lib/data";
import type { Disciplina } from "@/lib/types";
import { DisciplineNode, type DisciplinaNode } from "./discipline-node";
import { SemesterHeaderNode } from "./semester-header-node";
import { Sidebar } from "./sidebar";

const nodeTypes = {
  disciplina: DisciplineNode,
  header: SemesterHeaderNode,
};

// Geometria do layout em colunas (uma coluna por semestre)
const COLUMN_WIDTH = 240;
const ROW_HEIGHT = 96;
const HEADER_Y = 0;
const FIRST_ROW_Y = 72;

interface FlowchartProps {
  disciplinas: Disciplina[];
  concluidas: Set<string>;
  toggleConcluida: (id: string) => void;
  colorMode?: "light" | "dark";
}

/**
 * Fluxograma de disciplinas baseado em React Flow.
 * Nós = disciplinas (posicionadas por semestre em colunas),
 * arestas = pré-requisitos (ancoradas aos Handles dos nós).
 */
export function Flowchart({
  disciplinas,
  concluidas,
  toggleConcluida,
  colorMode = "light",
}: FlowchartProps) {
  const {
    disciplinaSelecionada,
    fluxoDestacado,
    disciplinasById,
    handleDisciplinaClick,
    handleDisciplinaHover,
    fecharSidebar,
    getPreRequisitosParaSidebar,
    getDependentesParaSidebar,
  } = useFlowchart(disciplinas);

  const hasHover = fluxoDestacado.size > 0;

  // Layout estático: posições dos nós, cabeçalhos e arestas base.
  // Recalculado apenas quando a grade em exibição muda.
  const { positions, headerNodes, baseEdges } = useMemo(() => {
    const porSemestre = getDisciplinasPorSemestre(disciplinas);
    const semestres = Array.from(porSemestre.keys()).sort((a, b) => a - b);

    const positions = new Map<string, { x: number; y: number }>();
    const headerNodes: Node[] = [];

    semestres.forEach((semestre, colIndex) => {
      const x = colIndex * COLUMN_WIDTH;

      headerNodes.push({
        id: `header-${semestre}`,
        type: "header",
        position: { x, y: HEADER_Y },
        data: { label: getSemestreLabel(semestre) },
        draggable: false,
        selectable: false,
        connectable: false,
      });

      (porSemestre.get(semestre) || []).forEach((d, rowIndex) => {
        positions.set(d.id, { x, y: FIRST_ROW_Y + rowIndex * ROW_HEIGHT });
      });
    });

    const baseEdges: Edge[] = [];
    disciplinas.forEach((d) => {
      d.preRequisitos.forEach((preReqId) => {
        if (!positions.has(preReqId)) return;
        baseEdges.push({
          id: `${preReqId}->${d.id}`,
          source: preReqId,
          target: d.id,
          type: "smoothstep",
        });
      });
    });

    return { positions, headerNodes, baseEdges };
  }, [disciplinas]);

  // Nós dinâmicos: reagem a hover (destaque/esmaecido) e a concluídas.
  const nodes = useMemo<Node[]>(() => {
    const disciplinaNodes: DisciplinaNode[] = disciplinas.map((d) => {
      const isHighlighted = fluxoDestacado.has(d.id);
      return {
        id: d.id,
        type: "disciplina",
        position: positions.get(d.id) ?? { x: 0, y: 0 },
        draggable: false,
        data: {
          disciplina: d,
          isHighlighted,
          isDimmed: hasHover && !isHighlighted,
          isConcluida: concluidas.has(d.id),
          onToggleConcluida: toggleConcluida,
        },
      };
    });

    return [...headerNodes, ...disciplinaNodes];
  }, [disciplinas, fluxoDestacado, hasHover, concluidas, headerNodes, positions, toggleConcluida]);

  // Arestas dinâmicas: destaca o fluxo em hover, esmaece o resto.
  const edges = useMemo<Edge[]>(() => {
    return baseEdges.map((e) => {
      const isDestacada =
        fluxoDestacado.has(e.source) && fluxoDestacado.has(e.target);
      const cor = isDestacada
        ? "var(--color-primary)"
        : "var(--color-muted-foreground)";

      return {
        ...e,
        animated: isDestacada,
        style: {
          stroke: cor,
          strokeWidth: isDestacada ? 2.5 : 1.5,
          opacity: hasHover ? (isDestacada ? 1 : 0.12) : 0.5,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: cor },
      };
    });
  }, [baseEdges, fluxoDestacado, hasHover]);

  const onNodeMouseEnter = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "disciplina") handleDisciplinaHover(node.id);
    },
    [handleDisciplinaHover]
  );

  const onNodeMouseLeave = useCallback(() => {
    handleDisciplinaHover(null);
  }, [handleDisciplinaHover]);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type !== "disciplina") return;
      const disciplina = disciplinasById.get(node.id);
      if (disciplina) handleDisciplinaClick(disciplina);
    },
    [handleDisciplinaClick, disciplinasById]
  );

  return (
    <>
      <div className="h-[70vh] min-h-[520px] w-full rounded-xl border border-border bg-muted/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeClick={onNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          colorMode={colorMode}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background gap={20} />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable nodeStrokeWidth={3} />
        </ReactFlow>
      </div>

      {/* Sidebar de detalhes */}
      <Sidebar
        disciplina={disciplinaSelecionada}
        preRequisitos={
          disciplinaSelecionada
            ? getPreRequisitosParaSidebar(disciplinaSelecionada)
            : []
        }
        dependentes={
          disciplinaSelecionada
            ? getDependentesParaSidebar(disciplinaSelecionada)
            : []
        }
        isConcluida={
          disciplinaSelecionada
            ? concluidas.has(disciplinaSelecionada.id)
            : false
        }
        onToggleConcluida={toggleConcluida}
        onClose={fecharSidebar}
        onDisciplinaClick={handleDisciplinaClick}
      />
    </>
  );
}
