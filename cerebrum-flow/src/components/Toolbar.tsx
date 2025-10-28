// 1. IMPORTAR O COMPONENTE DE UI DO SHADCN
// Usamos o alias '@/' que configuramos
import { Button } from '@/components/ui/button'

// 2. IMPORTAR O "CÉREBRO" (ZUSTAND STORE)
import { useFlowStore } from '@/state/useFlowStore'

// Este é um componente de UI simples
export function Toolbar() {
  // 3. SELETOR OTIMIZADO DO ZUSTAND
  // Em vez de pegar o store inteiro, selecionamos APENAS a ação 'addNode'.
  // Isso garante que este componente NUNCA será re-renderizado,
  // mesmo quando os 'nodes' ou 'edges' mudarem,
  // pois a função 'addNode' em si nunca muda.
  const addNode = useFlowStore((state) => state.addNode)

  return (
    // Usamos classes do Tailwind para estilizar a barra.
    // 'absolute' a posiciona sobre o FlowCanvas.
    // 'z-10' garante que ela fique na frente.
    <aside className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-center">Adicionar Nós</h3>
        
        {/* 4. BOTÃO CONECTADO À AÇÃO DO STORE */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addNode('text')} // Chama a ação addNode com o tipo 'text'
        >
          Adicionar Nó de Texto
        </Button>
        
        {/* // Em breve (Fase 3), você poderá adicionar mais botões aqui:
        <Button variant="outline" size="sm" onClick={() => addNode('image')}>
          Nó de Imagem
        </Button>
        <Button variant="outline" size="sm" onClick={() => addNode('video')}>
          Nó de Vídeo
        </Button>
        */}
      </div>
    </aside>
  )
}