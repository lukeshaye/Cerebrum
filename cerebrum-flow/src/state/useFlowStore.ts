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
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: () => void;
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [
        // Nó inicial de exemplo
        {
          id: uuidv4(),
          type: "text", // <-- ESTA LINHA FOI ATUALIZADA
          position: { x: 100, y: 100 },
          data: { label: "Nó de Exemplo" },
        },
      ],
      edges: [],

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
      addNode: () => {
        const newNode = {
          id: uuidv4(),
          type: "text", // <-- ESTA LINHA FOI ATUALIZADA
          // Posição aleatória simples
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: "Novo Nó" },
        };
        set({ nodes: [...get().nodes, newNode] });
      },
    }),
    {
      name: "cerebrum-flow-storage", // Nome para o localStorage
    }
  )
);