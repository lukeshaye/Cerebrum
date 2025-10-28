// src/components/TextNode.tsx

import { Handle, Position, NodeProps } from "reactflow";
import { memo } from "react";

// Usamos memo para otimizar, 
// evitando re-renderizações desnecessárias do nó
export const TextNode = memo(({ data }: NodeProps) => {
  return (
    <>
      {/* Handle Esquerdo (target - onde as arestas chegam) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {/* Conteúdo do Nó */}
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md px-4 py-2 min-w-[150px]">
        {/* O 'data.label' virá do nosso estado (Zustand) */}
        <p className="text-zinc-900 text-base font-medium">{data.label || "Novo Nó"}</p>
      </div>

      {/* Handle Direito (source - de onde as arestas saem) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-700 !w-2 !h-2"
      />
    </>
  );
});