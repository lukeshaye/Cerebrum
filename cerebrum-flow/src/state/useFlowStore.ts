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
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

// Definindo os tipos para o nosso estado
type FlowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null; // <-- NOVO: Rastreia o nó selecionado
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: string) => void; // <-- ATUALIZADO: Aceita o tipo
  updateNodeData: (nodeId: string, data: any) => void; // <-- NOVO: Para atualizar dados
  setSelectedNodeId: (nodeId: string | null) => void; // <-- NOVO: Para definir seleção
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [
        {
          id: uuidv4(),
          type: "text",
          position: { x: 100, y: 100 },
          data: { label: "Nó de Exemplo" },
        },
      ],
      edges: [],
      selectedNodeId: null, // <-- NOVO

      // Handler para mudança nos nós
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      // Handler para mudança nas arestas
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      // Handler para novas conexões
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },

      // Função para adicionar um novo nó
      addNode: (type: string) => { // <-- ATUALIZADO
        const newNode = {
          id: uuidv4(),
          type, // <-- ATUALIZADO
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: `Novo Nó (${type})` },
        };
        set({ nodes: [...get().nodes, newNode] });
      },

      // <-- NOVO: Ação para atualizar os dados de um nó
      updateNodeData: (nodeId: string, data: any) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              // Sobrescreve os dados antigos com os novos
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },

      // <-- NOVO: Ação para definir o nó selecionado
      setSelectedNodeId: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },
    }),
    {
      name: "cerebrum-flow-storage", // Nome para o localStorage
    }
  )
);