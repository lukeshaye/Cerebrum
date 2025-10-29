// src/components/FlowCanvas.tsx

// --- FASE 5: Importar KeyboardEvent ---
import { useCallback, KeyboardEvent } from "react";
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
    // --- FASE 5: Importar o estado e a ação necessários ---
    selectedNodeId,
    addNodeRelative,
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

  // --- NOVO FASE 5: Handler para Teclas (Tab e Shift) ---
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
      // 1. Só fazer algo se um nó estiver selecionado
      if (!selectedNodeId) return;

      // 2. Checar a tecla
      switch (event.key) {
        case 'Tab':
          // 3. Impedir o navegador de trocar o foco (comportamento padrão do Tab)
          event.preventDefault();
          // 4. Chamar a ação para criar um FILHO
          addNodeRelative(selectedNodeId, 'right');
          break;

        case 'Shift':
          // 3. Impedir o navegador de criar uma nova linha ou submeter algo
          event.preventDefault();
          // 4. Chamar a ação para criar um IRMÃO (usamos 'bottom' como padrão)
          addNodeRelative(selectedNodeId, 'bottom');
          break;

        default:
          break;
      }
    },
    [selectedNodeId, addNodeRelative], // Depende do nó selecionado e da ação
  );
  // --- FIM FASE 5 ---

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
          
          deleteKeyCode={['Backspace', 'Delete']}

          // Fase 3: Tipos de nós customizados
          nodeTypes={nodeTypes}
          
          // Fase 2: Handlers de seleção
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}

          // --- NOVO FASE 5: Conectar o handler de teclado ---
          onKeyDown={handleKeyDown}

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