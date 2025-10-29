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
import { exportFlowAsJson, importFlowFromJson } from "@/utils/fileHandlers";

type NodeData = {
  label: string;
  src?: string;
  [key: string]: any;
};

// --- FASE 5: Definir o tipo de direção ---
type AddNodeDirection = 'right' | 'top' | 'bottom';

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
  onNodesDelete: (nodesToDelete: Node<NodeData>[]) => void;
  onEdgesDelete: (edgesToDelete: Edge[]) => void;
  runAutoLayout: () => Promise<void>;

  // Ações da Fase 4
  exportFlow: () => void;
  importFlow: (file: File) => Promise<void>;

  // --- NOVO FASE 5: Ação de Adição Rápida ---
  addNodeRelative: (
    sourceNodeId: string, 
    direction: AddNodeDirection
  ) => void;
  // --- FIM FASE 5 ---
};

// --- Constantes para posicionamento (ajuste se necessário) ---
const HORIZONTAL_SPACING = 150;
const VERTICAL_SPACING = 50;
const DEFAULT_NODE_WIDTH = 150;
const DEFAULT_NODE_HEIGHT = 50;


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

      // ... (Handlers Básicos: onNodesChange, onEdgesChange, onConnect) ...
      // (Sem alterações aqui, copiando o anterior)
      onNodesChange: (changes: NodeChange[]) => {
        const { nodes, edges } = get();
        const nodeChanges = applyNodeChanges(changes, nodes);
        const nodeIdsToRemove = new Set(
          changes.filter((c) => c.type === "remove").map((c) => c.id)
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
            selectedNodeId: null,
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

      // ... (Ações Customizadas: addNode, updateNodeData, setSelectedNodeId) ...
      // (Sem alterações aqui)
      addNode: (type: string) => {
        const newNode: Node<NodeData> = {
          id: uuidv4(),
          type,
          position: { x: 100, y: 100 },
          data: { label: `Novo nó (${type})` },
          resizable: type === "image" || type === "video" || type === "text",
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

      // ... (Ações de Exclusão: onNodesDelete, onEdgesDelete) ...
      // (Sem alterações aqui)
      onNodesDelete: (nodesToDelete: Node<NodeData>[]) => {
        const { nodes, edges } = get();
        const nodeIdsToDelete = new Set(nodesToDelete.map((n) => n.id));

        const updatedNodes = nodes.filter(
          (node) => !nodeIdsToDelete.has(node.id)
        );
        const updatedEdges = edges.filter(
          (edge) =>
            !nodeIdsToDelete.has(edge.source) &&
            !nodeIdsToDelete.has(edge.target)
        );

        set({
          nodes: updatedNodes,
          edges: updatedEdges,
          selectedNodeId: null,
        });
      },
      onEdgesDelete: (edgesToDelete: Edge[]) => {
        const { edges } = get();
        const edgeIdsToDelete = new Set(edgesToDelete.map((e) => e.id));
        const updatedEdges = edges.filter(
          (edge) => !edgeIdsToDelete.has(edge.id)
        );
        set({ edges: updatedEdges });
      },
      
      // ... (runAutoLayout) ...
      // (Sem alterações aqui)
      runAutoLayout: async () => {
        const { nodes, edges } = get();
        const nodesToLayout = nodes.map((node) => ({
          ...node,
          width: node.width || 150,
          height: node.height || 50,
        }));
        const layoutedNodes = getLayoutedElements(nodesToLayout, edges);
        set({
          nodes: get().nodes.map((node) => {
            const layoutedNode = layoutedNodes.find((n) => n.id === node.id);
            return {
              ...node,
              position: layoutedNode ? layoutedNode.position : node.position,
            };
          }),
        });
      },

      // ... (Ações FASE 4: exportFlow, importFlow) ...
      // (Sem alterações aqui)
      exportFlow: () => {
        const { nodes, edges } = get();
        exportFlowAsJson(nodes, edges);
      },
      importFlow: async (file: File) => {
        try {
          const { nodes, edges } = await importFlowFromJson(file);
          set({ nodes, edges, selectedNodeId: null });
          setTimeout(() => {
            get().runAutoLayout();
          }, 100);
        } catch (error) {
          console.error("Erro ao importar fluxo:", error);
          alert((error as Error).message);
        }
      },

      // --- NOVO FASE 5: Implementação da Adição Rápida ---
      addNodeRelative: (
        sourceNodeId: string,
        direction: AddNodeDirection
      ) => {
        const { nodes, edges } = get();
        const sourceNode = nodes.find((n) => n.id === sourceNodeId);

        if (!sourceNode) return;

        // Dimensões do nó de origem
        const sourceWidth = sourceNode.width || DEFAULT_NODE_WIDTH;
        const sourceHeight = sourceNode.height || DEFAULT_NODE_HEIGHT;

        // Criar o novo nó (sempre 'text' por padrão)
        const newNode: Node<NodeData> = {
          id: uuidv4(),
          type: "text",
          position: { x: 0, y: 0 }, // Posição será definida abaixo
          data: { label: "Novo Nó" },
          resizable: true, // Manter o padrão dos outros nós
        };

        let newEdge: Edge;

        if (direction === "right") {
          // --- LÓGICA DE ADICIONAR FILHO ---
          
          newNode.position = {
            x: sourceNode.position.x + sourceWidth + HORIZONTAL_SPACING,
            y: sourceNode.position.y,
          };
          
          newEdge = {
            id: uuidv4(),
            source: sourceNodeId,
            target: newNode.id,
          };
          
        } else {
          // --- LÓGICA DE ADICIONAR IRMÃO (CIMA/BAIXO) ---
          
          // 1. Encontrar o pai do nó de origem
          const parentEdge = edges.find((e) => e.target === sourceNodeId);
          
          // Se não houver pai (ex: é o nó raiz), não faz nada.
          if (!parentEdge) {
            console.warn("Tentativa de adicionar irmão a um nó sem pai.");
            return; 
          }
          
          const parentNodeId = parentEdge.source;

          // 2. Definir a posição
          if (direction === "bottom") {
            newNode.position = {
              x: sourceNode.position.x,
              y: sourceNode.position.y + sourceHeight + VERTICAL_SPACING,
            };
          } else { // direction === 'top'
            newNode.position = {
              x: sourceNode.position.x,
              y: sourceNode.position.y - (newNode.height || DEFAULT_NODE_HEIGHT) - VERTICAL_SPACING,
            };
          }

          // 3. Criar a aresta a partir do PAI
          newEdge = {
            id: uuidv4(),
            source: parentNodeId,
            target: newNode.id,
          };
        }

        // Atualizar o estado e selecionar o novo nó
        set({
          nodes: [...nodes, newNode],
          edges: [...edges, newEdge],
          selectedNodeId: newNode.id, // Seleciona o nó recém-criado
        });
      },
      // --- FIM FASE 5 ---
    }),
    {
      name: "cerebrum-flow-storage",
    }
  )
);