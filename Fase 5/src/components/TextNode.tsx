// src/components/TextNode.tsx

import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
import { Plus } from "lucide-react";

export const TextNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  
  // --- ATUALIZAÇÃO: Importar a nova ação ---
  const addNodeRelative = useFlowStore((state) => state.addNodeRelative);

  const handleLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  // --- ATUALIZAÇÃO: Trocar console.log pela chamada da função ---
  const onAddChild = () => {
    addNodeRelative(id, 'right');
  };

  const onAddSibling = (direction: 'top' | 'bottom') => {
    addNodeRelative(id, direction);
  };
  // --- FIM DA ATUALIZAÇÃO ---


  return (
    <div className="relative"> 
      <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={50}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      <div
        style={style}
        className="bg-white border-2 border-zinc-900 shadow-lg rounded-md px-4 py-2 min-w-[150px] h-full flex flex-col"
      >
        <textarea
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full h-full bg-transparent outline-none border-none resize-none flex-grow"
          placeholder="Novo Nó"
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {selected && (
        <>
          {/* Botão Direita (Filho) */}
          <QuickAddButton
            position="right"
            onClick={onAddChild} // Agora chama a função correta
          />
          {/* Botão Cima (Irmão) */}
          <QuickAddButton
            position="top"
            onClick={() => onAddSibling('top')} // Agora chama a função correta
          />
          {/* Botão Baixo (Irmão) */}
          <QuickAddButton
            position="bottom"
            onClick={() => onAddSibling('bottom')} // Agora chama a função correta
          />
        </>
      )}
    </div>
  );
});


// (O componente QuickAddButton permanece o mesmo)
type QuickAddButtonProps = {
  position: 'top' | 'right' | 'bottom';
  onClick: () => void;
};

const QuickAddButton = ({ position, onClick }: QuickAddButtonProps) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'left-1/2 -translate-x-1/2 top-0 -translate-y-[calc(100%+10px)]';
      case 'right':
        return 'top-1/2 -translate-y-1/2 right-0 translate-x-[calc(100%+10px)]';
      case 'bottom':
        return 'left-1/2 -translate-x-1/2 bottom-0 translate-y-[calc(100%+10px)]';
    }
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={`
        absolute z-10 p-1 bg-white border border-zinc-500 rounded-full
        shadow-md hover:bg-zinc-100 hover:border-zinc-700
        transition-all
        ${getPositionClass()}
      `}
    >
      <Plus size={16} className="text-zinc-700" />
    </button>
  );
};