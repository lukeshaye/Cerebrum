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

// CORREÇÃO 1: Importar do dagreLayout (Fase 3)
import { getLayoutedElements } from "@/flow/layout/dagreLayout";

// Fase 3: NodeData precisa ser flexível
type NodeData = {
  label: string;
  src?: string; // Para ImageNode e VideoNode
  [key: string]: any; // Permite outras propriedades futuras
};

// Define o estado completo, incluindo as ações
type FlowState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null; // Fase 2
  
  // Handlers básicos do React Flow
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  
  // Ações customizadas
  addNode: (type: string) => void; // Fase 1 (modificada na Fase 3)
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void; // Fase 2
  setSelectedNodeId: (nodeId: string | null) => void; // Fase 2
  runAutoLayout: () => Promise<void>; // Fase 3
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
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
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

      // Fase 3: Permite 'type' dinâmico
      addNode: (type: string) => {
        const newNode: Node<NodeData> = {
          id: uuidv4(),
          type,
          position: { x: 100, y: 100 },
          data: { label: `Novo nó (${type})` },
          
          // CORREÇÃO 2: Habilita o resize para nós de imagem e vídeo
          resizable: type === 'image' || type === 'video', 
        };
        set({
          nodes: [...get().nodes, newNode],
        });
      },

      // Fase 2: Atualiza dados do nó (usado pela Sidebar)
      updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        });
      },

      // Fase 2: Define o nó selecionado (usado pela Sidebar)
      setSelectedNodeId: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },

      // Fase 3: Executa o layout automático (agora com Dagre)
      // (Mantemos 'async' para consistência do tipo, mas a chamada é síncrona)
      runAutoLayout: async () => {
        const { nodes, edges } = get();
        
        // Dagre precisa saber as dimensões
        const nodesToLayout = nodes.map(node => ({
          ...node,
          width: node.width || 150, 
          height: node.height || 50,
        }));

        // A chamada do dagre é síncrona (sem 'await')
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
      name: "cerebrum-flow-storage", // Nome para o localStorage
    }
  )
);