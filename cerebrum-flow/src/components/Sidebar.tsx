// src/components/Sidebar.tsx

import { useFlowStore } from "@/state/useFlowStore";
import { Input } from "@/components/ui/input"; // <-- Importe o Input do Shadcn
import { Label } from "@/components/ui/label"; // <-- Importe o Label do Shadcn
import { ChangeEvent } from "react";

export const Sidebar = () => {
  // Obtenha o estado e as ações necessárias
  const { selectedNodeId, nodes, updateNodeData } = useFlowStore();

  // Encontre o nó selecionado
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Handler para atualizar o label a partir da sidebar
  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { label: event.target.value });
    }
  };

  return (
    <aside className="absolute top-0 right-0 z-10 m-4 w-72">
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md p-4">
        {/* O conteúdo agora é condicional */}
        {!selectedNode ? (
          // Estado Padrão
          <>
            <h3 className="font-medium text-lg text-zinc-900">Configurações</h3>
            <p className="text-sm text-zinc-600">Selecione um nó para editar.</p>
          </>
        ) : (
          // Estado com Nó Selecionado
          <>
            <h3 className="font-medium text-lg text-zinc-900">Editar Nó</h3>
            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={selectedNode.data.label || ""}
                onChange={handleLabelChange}
              />
            </div>
            {/* Você pode adicionar mais opções aqui, como "alterar cores"  */}
          </>
        )}
      </div>
    </aside>
  );
};