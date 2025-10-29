// src/state/useFlowStore.ts

import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import { getLayoutedElements } from "@/flow/layout/dagreLayout";

type NodeData = {
  label: string;
  src?: string;
  [key: string]: any;
};

type FlowState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  
  // Ações customizadas
  addNode: (type: string) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  
  // --- NOVO: Definir tipos para as funções de exclusão ---
  onNodesDelete: (nodesToDelete: Node<NodeData>[]) => void;
  onEdgesDelete: (edgesToDelete: Edge[]) => void;
  // --- FIM DO NOVO ---

  runAutoLayout: () => Promise<void>;
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      nodes: [
        {
          id: "1",
          type: "text",
          position: { x: 0, y: 0 },
          data: { label: "Nó Raiz" },
        },
      ],
      edges: [],
      selectedNodeId: null,

      // --- Handlers Básicos ---
      onNodesChange: (changes: NodeChange[]) => {
        // Precisamos tratar a seleção e a exclusão (feita pela tecla Delete)
        const { nodes, edges } = get();

        // A exclusão pela tecla 'Delete' vem como uma 'NodeChange' do tipo 'remove'.
        // Precisamos também remover as arestas conectadas.
        const nodeChanges = applyNodeChanges(changes, nodes);
        
        const nodeIdsToRemove = new Set(
          changes.filter((c) => c.type === 'remove').map((c) => c.id)
        );

        if (nodeIdsToRemove.size > 0) {
          const updatedEdges = edges.filter(
            (edge) =>
              !nodeIdsToRemove.has(edge.source) &&
              !nodeIdsToRemove.has(edge.target)
          );
          set({ 
            nodes: nodeChanges, 
            edges: updatedEdges,
            selectedNodeId: null // Limpa a seleção
          });
        } else {
          set({ nodes: nodeChanges });
        }
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },

      // --- Ações Customizadas ---
      addNode: (type: string) => {
        const newNode: Node<NodeData> = {
          id: uuidv4(),
          type,
          position: { x: 100, y: 100 },
          data: { label: `Novo nó (${type})` },
          resizable: type === 'image' || type === 'video', 
        };
        set({
          nodes: [...get().nodes, newNode],
        });
      },

      updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        });
      },

      setSelectedNodeId: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },

      // --- NOVO: Implementação da exclusão (chamada pela Sidebar) ---
      onNodesDelete: (nodesToDelete: Node<NodeData>[]) => {
        const { nodes, edges } = get();
        const nodeIdsToDelete = new Set(nodesToDelete.map((n) => n.id));

        const updatedNodes = nodes.filter((node) => !nodeIdsToDelete.has(node.id));
        const updatedEdges = edges.filter(
          (edge) =>
            !nodeIdsToDelete.has(edge.source) &&
            !nodeIdsToDelete.has(edge.target)
        );

        set({
          nodes: updatedNodes,
          edges: updatedEdges,
          selectedNodeId: null, // Limpar a seleção após deletar
        });
      },

      // (Função de bônus para exclusão de arestas, se precisar no futuro)
      onEdgesDelete: (edgesToDelete: Edge[]) => {
        const { edges } = get();
        const edgeIdsToDelete = new Set(edgesToDelete.map((e) => e.id));
        const updatedEdges = edges.filter((edge) => !edgeIdsToDelete.has(edge.id));
        set({ edges: updatedEdges });
      },
      // --- FIM DO NOVO ---

      runAutoLayout: async () => {
        const { nodes, edges } = get();
        
        const nodesToLayout = nodes.map(node => ({
          ...node,
          width: node.width || 150, 
          height: node.height || 50,
        }));

        const layoutedNodes = getLayoutedElements(nodesToLayout, edges);
        
        set({ 
          nodes: get().nodes.map(node => {
            const layoutedNode = layoutedNodes.find(n => n.id === node.id);
            return {
              ...node,
              position: layoutedNode ? layoutedNode.position : node.position,
            };
          })
        });
      },
    }),
    {
      name: "cerebrum-flow-storage",
    }
  )
);