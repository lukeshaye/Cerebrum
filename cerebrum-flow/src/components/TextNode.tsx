// src/components/TextNode.tsx

import { Handle, Position, NodeProps } from "reactflow";
import { memo, ChangeEvent } from "react"; // <-- Importe ChangeEvent
import { useFlowStore } from "@/state/useFlowStore"; // <-- Importe o store

// Usamos memo para otimizar
export const TextNode = memo(({ id, data }: NodeProps) => {
  // Selecione a ação de atualização
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  // Handler para atualizar o label
  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {/* Conteúdo do Nó */}
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md px-4 py-2 min-w-[150px]">
        {/* ATUALIZADO: Trocamos <p> por <input> */}
        <input
          type="text"
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full bg-transparent outline-none border-none"
          placeholder="Novo Nó"
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-700 !w-2 !h-2"
      />
    </>
  );
});