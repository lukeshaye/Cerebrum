// src/components/FlowCanvas.tsx

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node, // Importe o tipo Node
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/state/useFlowStore";
import { TextNode } from "./TextNode";

// --- CORREÇÃO ---
// Definimos os nodeTypes fora do componente.
// Isso evita que o React Flow recrie o objeto em toda renderização,
// corrigindo o aviso no console e otimizando a performance.
const nodeTypes = {
  text: TextNode,
  // (Futuramente, ImageNode, VideoNode serão adicionados aqui)
};

export const FlowCanvas = () => {
  // Seleciona o estado e as ações do store (incluindo as novas)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId, // Ação para definir o nó selecionado
  } = useFlowStore();

  // Handler para quando um nó é clicado
  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id); // Informa ao store qual nó foi selecionado
  };

  // Handler para quando o fundo (painel) é clicado
  const handlePaneClick = () => {
    setSelectedNodeId(null); // Informa ao store que nenhum nó está selecionado
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} // Usa a constante definida fora
          fitView
          className="bg-zinc-50"
          onNodeClick={handleNodeClick} // <-- Handler de clique no nó
          onPaneClick={handlePaneClick} // <-- Handler de clique no fundo
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};