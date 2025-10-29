// src/flow/nodes/ImageNode.tsx

import { Handle, Position, NodeProps, NodeResizer } from "reactflow"; // 1. Importar NodeResizer
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
import { Image as ImageIcon } from "lucide-react";

// 2. Receber width, height e selected
export const ImageNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  // 3. Criar o objeto de estilo (como antes)
  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <>
      {/* 4. Adicionar o NodeResizer */}
      <NodeResizer
        isVisible={selected} // Só mostra quando o nó está selecionado
        minWidth={200}
        minHeight={150}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {/* 5. Aplicar o 'style' e layout flex */}
      <div
        style={style}
        className="bg-white border-2 border-zinc-900 shadow-lg rounded-md min-w-[200px] overflow-hidden flex flex-col h-full"
      >
        <input
          type="text"
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full bg-transparent outline-none border-none px-4 py-2"
          placeholder="Nó de Imagem"
        />

        {/* 6. Fazer a área da imagem crescer */}
        <div className="p-2 border-t border-zinc-200 bg-zinc-50 flex-grow h-full">
          {data.src ? (
            <img
              src={data.src}
              alt={data.label || "Imagem"}
              className="w-full h-full rounded-sm object-cover" // h-full
            />
          ) : (
            <div className="w-full h-full min-h-[100px] flex flex-col items-center justify-center text-zinc-500 bg-zinc-100 rounded-sm">
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