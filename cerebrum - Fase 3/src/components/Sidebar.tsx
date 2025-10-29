// src/components/Sidebar.tsx

import { useFlowStore } from "@/state/useFlowStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";

export const Sidebar = () => {
  
  // --- CORREÇÃO DO LOOP INFINITO ---
  //
  // Em vez de um seletor que retorna um objeto,
  // chamamos o hook para cada pedaço de estado que precisamos.
  // Isso é mais performático e evita loops de renderização.
  //
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
  const nodes = useFlowStore((state) => state.nodes);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const onNodesDelete = useFlowStore((state) => state.onNodesDelete);
  // --- FIM DA CORREÇÃO ---

  // Encontramos o nó *aqui*, no corpo do componente.
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Handler genérico
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (selectedNode) {
      updateNodeData(selectedNode.id, { [name]: value });
    }
  };

  // Handler para o botão de deletar
  const handleDeleteNode = () => {
    if (selectedNode) {
      // onNodesDelete (do store) espera um array de nós
      onNodesDelete([selectedNode]);
    }
  };

  return (
    <aside className="absolute top-0 right-0 z-10 m-4 w-72">
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md p-4">
        {!selectedNode ? (
          // Estado Padrão
          <>
            <h3 className="font-medium text-lg text-zinc-900">Configurações</h3>
            <p className="text-sm text-zinc-600">Selecione um nó para editar.</p>
          </>
        ) : (
          // Estado com Nó Selecionado
          <>
            <h3 className="font-medium text-lg text-zinc-900">
              Editar Nó ({selectedNode.type || 'text'})
            </h3>

            {/* Campo de Label (comum a todos) */}
            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                name="label" // <-- Nome para o handler
                value={selectedNode.data.label || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Campos Específicos (Imagem e Vídeo) */}
            {(selectedNode.type === 'image' || selectedNode.type === 'video') && (
              <div className="mt-4 flex flex-col gap-2">
                <Label htmlFor="node-src">URL</Label>
                <Input
                  id="node-src"
                  name="src" // <-- Nome para o handler
                  type="text"
                  value={selectedNode.data.src || ""}
                  onChange={handleInputChange}
                  placeholder={
                    selectedNode.type === 'image'
                      ? "https://exemplo.com/imagem.png"
                      : "https://youtube.com/watch?v=..."
                  }
                />
              </div>
            )}

            {/* --- FUNCIONALIDADE DE EXCLUSÃO --- */}
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleDeleteNode}
            >
              Excluir Nó
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};