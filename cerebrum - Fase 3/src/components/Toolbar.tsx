// src/components/Toolbar.tsx

import { Button } from '@/components/ui/button'
import { useFlowStore } from '@/state/useFlowStore'
// (Opcional) Adicionar ícones
import { Plus, Image as ImageIcon, Video as VideoIcon, Sparkles } from 'lucide-react' 

export function Toolbar() {
  const addNode = useFlowStore((state) => state.addNode)
  
  // --- ATUALIZAÇÃO ---
  // Importe a ação de layout
  const runAutoLayout = useFlowStore((state) => state.runAutoLayout);

  return (
    <aside className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        {/* ... Botões de Adicionar Nós ... */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addNode('text')}
        >
          <Plus className="mr-2" />
          Nó de Texto
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => addNode('image')}
        >
          <ImageIcon className="mr-2" />
          Nó de Imagem
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => addNode('video')}
        >
          <VideoIcon className="mr-2" />
          Nó de Vídeo
        </Button>

        {/* --- ATUALIZAÇÃO --- */}
        {/* Botão de Organizar  */}
        <div className="border-t pt-2 mt-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={runAutoLayout}
            className="w-full" // Opcional: fazer o botão ocupar 100%
          >
            <Sparkles className="mr-2" /> {/* Opcional */}
            Organizar
          </Button>
        </div>
      </div>
    </aside>
  )
}