// src/flow/nodes/ImageNode.tsx

import { Handle, Position, NodeProps } from "reactflow";
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
import { Image as ImageIcon } from "lucide-react"; // Ícone para o placeholder

// Usamos memo para otimizar
export const ImageNode = memo(({ id, data }: NodeProps) => {
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
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md min-w-[200px] overflow-hidden">
        {/* Input do Label (igual ao TextNode) */}
        <input
          type="text"
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full bg-transparent outline-none border-none px-4 py-2"
          placeholder="Nó de Imagem"
        />

        {/* Visualizador da Imagem */}
        <div className="p-2 border-t border-zinc-200 bg-zinc-50">
          {data.src ? (
            <img
              src={data.src}
              alt={data.label || "Imagem"}
              className="w-full h-auto rounded-sm object-cover"
            />
          ) : (
            // Placeholder se não houver URL
            <div className="w-full h-24 flex flex-col items-center justify-center text-zinc-500 bg-zinc-100 rounded-sm">
              <ImageIcon size={24} />
              <span className="text-xs mt-1">Sem URL da imagem</span>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-700 !w-2 !h-2"
      />
    </>
  );
});