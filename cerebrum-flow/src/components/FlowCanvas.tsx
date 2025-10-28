import ReactFlow, {
  Controls, // Controles de zoom e pan
  Background, // O fundo (pontilhado ou linhas)
  MiniMap, // O mini-mapa
  ReactFlowProvider, // Provedor de contexto, essencial
} from 'reactflow'
import 'reactflow/dist/style.css' // Estilos padrão do React Flow

// 1. IMPORTAR O CÉREBRO
// Usamos o alias '@/' que configuramos para o shadcn
import { useFlowStore } from '@/state/useFlowStore'

// 2. O COMPONENTE RENDERIZADOR
function FlowCanvas() {
  // 3. CONECTAR AO CÉREBRO
  // Selecionamos todos os estados e ações que o React Flow precisa.
  // Graças ao Zustand, este componente será re-renderizado automaticamente
  // sempre que 'nodes' ou 'edges' mudarem.
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore()

  return (
    // O React Flow precisa de um container com altura e largura definidas
    // para saber onde desenhar. '100vh' ocupa a tela inteira.
    <div style={{ height: '100vh', width: '100%' }}>
      {/* ReactFlowProvider é necessário para que hooks internos do
      React Flow (como useReactFlow) funcionem, 
      especialmente dentro de nós customizados (Fase 2) */}
      <ReactFlowProvider>
        <ReactFlow
          // 4. PASSAR O ESTADO PARA O REACT FLOW
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          
          fitView // Dá um zoom inicial para mostrar todos os nós
        >
          {/* Componentes de UI adicionais */}
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export default FlowCanvas