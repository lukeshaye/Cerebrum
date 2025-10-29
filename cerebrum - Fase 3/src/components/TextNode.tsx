// src/components/TextNode.tsx

// 1. Importar NodeResizer
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
// 2. Importar ChangeEvent para <textarea>
import { memo, ChangeEvent } from "react"; 
import { useFlowStore } from "@/state/useFlowStore";

// 3. Receber width, height, e selected
export const TextNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  // 4. Mudar tipo do Evento para HTMLTextAreaElement
  const handleLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  // 5. Criar objeto de estilo
  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <>
      {/* 6. Adicionar o NodeResizer */}
      <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={50} // Uma altura mínima razoável
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {/* 7. Aplicar 'style' e 'h-full' */}
      <div 
        style={style}
        className="bg-white border-2 border-zinc-900 shadow-lg rounded-md px-4 py-2 min-w-[150px] h-full flex flex-col"
      >
        {/* 8. Mudar <input> para <textarea> para melhor redimensionamento */}
        <textarea
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full h-full bg-transparent outline-none border-none resize-none flex-grow" // 'resize-none' e 'flex-grow'
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