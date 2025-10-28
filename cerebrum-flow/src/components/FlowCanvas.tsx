// src/components/FlowCanvas.tsx

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/state/useFlowStore";
import { TextNode } from "./TextNode";

export const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore();

  const nodeTypes = useMemo(
    () => ({
      text: TextNode,
    }),
    []
  );

  return (
    // Mude esta linha para que o canvas seja a camada de base absoluta
    <div className="absolute top-0 left-0 w-full h-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-zinc-50"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};