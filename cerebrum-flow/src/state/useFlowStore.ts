import { create } from 'zustand'
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
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid' // Para gerar IDs únicos
import { persist } from 'zustand/middleware' // Para o auto-save

// 1. DEFINIÇÃO DO TIPO DO NOSSO ESTADO (STORE)
// Isso define a "forma" dos dados e as ações que podemos executar
type FlowState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (type: 'text' | 'image' | 'video') => void // Ação customizada para adicionar nós
}

// 2. CRIAÇÃO DO STORE
// Aqui usamos create() do Zustand.
// O middleware persist() "envolve" nossa lógica para salvar no localStorage.
export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      // --- DADOS (STATE) ---
      nodes: [
        {
          id: '1',
          type: 'text', // Usando 'text' como tipo inicial
          position: { x: 100, y: 100 },
          data: { label: 'Nó Inicial' },
        },
      ],
      edges: [],

      // --- AÇÕES DO REACT FLOW ---
      // Essas são as funções que o React Flow usa para nos dizer
      // que um nó ou conexão mudou (ex: foi arrastado, selecionado, etc.)

      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        })
      },

      // --- AÇÕES CUSTOMIZADAS (NOSSA LÓGICA) ---

      /**
       * Ação para adicionar um novo nó ao canvas.
       * A Fase 1 foca no tipo 'text'.
       */
      addNode: (type: 'text' | 'image' | 'video') => {
        const newNode: Node = {
          id: uuidv4(),
          type: type, // O tipo é passado pela Toolbar
          position: { x: Math.random() * 500, y: Math.random() * 500 }, // Posição aleatória
          data: { label: `Novo Nó (${type})` }, // Dados iniciais
        }

        // Adiciona o novo nó ao array de nós existente
        set({
          nodes: [...get().nodes, newNode],
        })
      },
    }),
    {
      // --- CONFIGURAÇÃO DO MIDDLEWARE PERSIST ---
      name: 'cerebrum-flow-storage', // Nome da chave no localStorage
      // (Opcional) Você pode adicionar filtros aqui depois
    },
  ),
)