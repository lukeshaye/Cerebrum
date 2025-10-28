// src/components/FlowCanvas.tsx

import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/state/useFlowStore";

// Fase 3: Importa os tipos de nós do arquivo central
import { nodeTypes } from "@/flow/nodes";

/* --- CORREÇÃO ---
  O seletor foi removido. 
  Ele estava causando um loop de renderização infinito por 
  retornar um novo objeto a cada renderização.
  Como queremos o estado *inteiro* da store, podemos 
  simplesmente chamar useFlowStore() sem argumentos.
*/

export const FlowCanvas = () => {
  // --- CORREÇÃO ---
  // Chamamos useFlowStore() diretamente, sem o seletor.
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
  } = useFlowStore(); // <-- O SELETOR FOI REMOVIDO DAQUI

  // Fase 2: Handler para selecionar um nó ao clicar
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  // Fase 2: Handler para limpar a seleção ao clicar no painel
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <ReactFlowProvider>
        <ReactFlow
          // Estado do Flow (controlado pelo Zustand)
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          
          // Fase 3: Tipos de nós customizados
          nodeTypes={nodeTypes}
          
          // Fase 2: Handlers de seleção
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}

          fitView // Centraliza o fluxo ao carregar
          className="bg-zinc-50" // Adiciona um fundo leve
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};