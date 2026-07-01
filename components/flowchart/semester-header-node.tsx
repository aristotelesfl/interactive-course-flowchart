"use client";

import { memo } from "react";
import type { Node, NodeProps } from "@xyflow/react";

export type SemesterHeaderData = { label: string };

export type SemesterHeaderNode = Node<SemesterHeaderData, "header">;

/**
 * Nó não-interativo que rotula o topo de cada coluna de semestre.
 */
export const SemesterHeaderNode = memo(function SemesterHeaderNode({
  data,
}: NodeProps<SemesterHeaderNode>) {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap pointer-events-none">
      {data.label}
    </div>
  );
});
