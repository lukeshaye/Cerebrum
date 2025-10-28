// src/components/FlowCanvas.tsx

import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node, // Importado para tipar o handleNodeClick
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/state/useFlowStore";

// Fase 3: Importa os tipos de nós do arquivo central
import { nodeTypes } from "@/flow/nodes";

// Seletor do Zustand para otimizar re-renderizações
// Pegamos apenas o que o Canvas precisa
const selector = (state: ReturnType<typeof useFlowStore.getState>) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setSelectedNodeId: state.setSelectedNodeId, // Fase 2
});

export const FlowCanvas = () => {
  // Conecta o canvas 100% ao store do Zustand
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
  } = useFlowStore(selector);

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