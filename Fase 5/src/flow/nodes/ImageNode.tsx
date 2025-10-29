// src/flow/nodes/ImageNode.tsx

import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
// --- NOVO FASE 5: Importar Ícones ---
import { Image as ImageIcon, Plus } from "lucide-react";

export const ImageNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  // --- NOVO FASE 5: Chamar a função do store ---
  const addNodeRelative = useFlowStore((state) => state.addNodeRelative);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  // --- NOVO FASE 5: Handlers para os botões ---
  const onAddChild = () => {
    addNodeRelative(id, 'right');
  };

  const onAddSibling = (direction: 'top' | 'bottom') => {
    addNodeRelative(id, direction);
  };

  return (
    // --- NOVO FASE 5: Wrapper relativo ---
    <div className="relative">
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={150}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

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

        <div className="p-2 border-t border-zinc-200 bg-zinc-50 flex-grow h-full">
          {data.src ? (
            <img
              src={data.src}
              alt={data.label || "Imagem"}
              className="w-full h-full rounded-sm object-cover"
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

      {/* --- NOVO FASE 5: Botões de Adição Rápida --- */}
      {selected && (
        <>
          <QuickAddButton
            position="right"
            onClick={onAddChild}
          />
          <QuickAddButton
            position="top"
            onClick={() => onAddSibling('top')}
          />
          <QuickAddButton
            position="bottom"
            onClick={() => onAddSibling('bottom')}
          />
        </>
      )}
    </div>
  );
});

// --- NOVO FASE 5: Componente Helper para o Botão ---

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