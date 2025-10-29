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

export const FlowCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
  } = useFlowStore(); 

  // Fase 2: Handler para selecionar um nó ao clicar
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
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
          
          // --- CORREÇÃO AQUI ---
          // Define explicitamente 'Delete' e 'Backspace' como teclas de remoção
          deleteKeyCode={['Backspace', 'Delete']}
          // --- FIM DA CORREÇÃO ---

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