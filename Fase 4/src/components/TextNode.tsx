// src/components/TextNode.tsx

// 1. Importar NodeResizer
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
// 2. Importar ChangeEvent
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
// --- NOVO FASE 5: Importar o ícone de 'Mais' ---
import { Plus } from "lucide-react";

// 3. Receber 'selected'
export const TextNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  // --- NOVO FASE 5: Chamar a futura função do store (ainda não criada) ---
  // const addNodeRelative = useFlowStore((state) => state.addNodeRelative);

  const handleLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  // --- NOVO FASE 5: Handlers para os botões ---
  // (Quando implementarmos o store, trocaremos o console.log)
  const onAddChild = () => {
    console.log(`FUTURO: Adicionar FILHO ao nó ${id}`);
    // addNodeRelative(id, 'right');
  };

  const onAddSibling = (direction: 'top' | 'bottom') => {
    console.log(`FUTURO: Adicionar IRMÃO (${direction}) ao nó ${id}`);
    // addNodeRelative(id, direction);
  };


  return (
    // Adicionamos 'relative' para que os botões absolutos fiquem posicionados
    // em relação ao wrapper do nó.
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

      {/* --- NOVO FASE 5: Botões de Adição Rápida --- */}
      {/* Só exibe os botões se o nó estiver selecionado */}
      {selected && (
        <>
          {/* Botão Direita (Filho) */}
          <QuickAddButton
            position="right"
            onClick={onAddChild}
          />
          {/* Botão Cima (Irmão) */}
          <QuickAddButton
            position="top"
            onClick={() => onAddSibling('top')}
          />
          {/* Botão Baixo (Irmão) */}
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
  // Define o posicionamento com base na prop
  const getPositionClass = () => {
    switch (position) {
      case 'top':
        // Centro horizontal, acima do nó
        return 'left-1/2 -translate-x-1/2 top-0 -translate-y-[calc(100%+10px)]';
      case 'right':
        // Centro vertical, à direita do nó
        return 'top-1/2 -translate-y-1/2 right-0 translate-x-[calc(100%+10px)]';
      case 'bottom':
        // Centro horizontal, abaixo do nó
        return 'left-1/2 -translate-x-1/2 bottom-0 translate-y-[calc(100%+10px)]';
    }
  };

  return (
    <button
      onClick={onClick}
      // NOTA: onMouseDown é importante para evitar que o clique no botão
      // seja interpretado como um arraste/seleção do nó principal.
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