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
  NodeDimensionChange,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import { getLayoutedElements } from "@/flow/layout/elkLayout"; // Fase 3

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

// Função para gerar nós iniciais (se necessário)
const getInitialNodes = (): Node<NodeData>[] => [
  {
    id: uuidv4(),
    type: "text",
    position: { x: 100, y: 100 },
    data: { label: "Nó Raiz" },
  },
];

export const useFlowStore = create<FlowState>()(
  // Fase 1: Adiciona o middleware 'persist'
  persist(
    (set, get) => ({
      // Estado Inicial
      nodes: getInitialNodes(),
      edges: [],
      selectedNodeId: null, // Fase 2

      // Handlers do React Flow conectados ao Zustand
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

      // Ações Customizadas
      
      // Fase 3: Permite 'type' dinâmico
      addNode: (type: string) => {
        const newNode: Node<NodeData> = {
          id: uuidv4(),
          type,
          position: { x: 100, y: 100 }, // Posição padrão
          data: { label: `Novo nó (${type})` },
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

      // Fase 3: Executa o layout automático com ELK.js
      runAutoLayout: async () => {
        const { nodes, edges } = get();
        
        // O ELK precisa saber as dimensões (width/height)
        // O React Flow armazena isso no objeto do nó *após* a renderização.
        // Garantimos que apenas nós com dimensões sejam enviados para o ELK.
        const nodesToLayout = nodes.map(node => ({
          ...node,
          width: node.width || 150, // Fallback de largura
          height: node.height || 50, // Fallback de altura
        }));

        const layoutedNodes = await getLayoutedElements(nodesToLayout, edges);
        
        // Atualiza o estado com as novas posições
        // Usamos 'map' para preservar quaisquer outras propriedades (como 'data')
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
      // Fase 1: Nome da chave no localStorage
      name: "cerebrum-flow-storage",
    }
  )
);