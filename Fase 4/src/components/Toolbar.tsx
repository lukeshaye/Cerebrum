// src/components/Toolbar.tsx

// --- ATUALIZAÇÃO: Importe useRef e ChangeEvent ---
import { useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useFlowStore } from '@/state/useFlowStore';
// --- ATUALIZAÇÃO: Importe novos ícones ---
import {
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  Save, // Ícone para Salvar
  Upload, // Ícone para Carregar
} from 'lucide-react';

export function Toolbar() {
  const addNode = useFlowStore((state) => state.addNode);
  const runAutoLayout = useFlowStore((state) => state.runAutoLayout);
  
  // --- NOVO FASE 4: Selecione as novas ações ---
  const exportFlow = useFlowStore((state) => state.exportFlow);
  const importFlow = useFlowStore((state) => state.importFlow);

  // Ref para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler para o clique no botão "Carregar"
  const handleImportClick = () => {
    // Simula o clique no input de arquivo
    fileInputRef.current?.click();
  };

  // Handler para quando um arquivo é selecionado
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importFlow(file);
      // Limpa o valor do input para permitir carregar o mesmo arquivo novamente
      event.target.value = '';
    }
  };
  // --- FIM FASE 4 ---

  return (
    <aside className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        {/* ... Botões de Adicionar Nós ... */}
        <Button variant="outline" size="sm" onClick={() => addNode('text')}>
          <Plus className="mr-2" />
          Nó de Texto
        </Button>
        <Button variant="outline" size="sm" onClick={() => addNode('image')}>
          <ImageIcon className="mr-2" />
          Nó de Imagem
        </Button>
        <Button variant="outline" size="sm" onClick={() => addNode('video')}>
          <VideoIcon className="mr-2" />
          Nó de Vídeo
        </Button>

        {/* Botão de Organizar */}
        <div className="border-t pt-2 mt-2">
          <Button
            variant="default"
            size="sm"
            onClick={runAutoLayout}
            className="w-full"
          >
            <Sparkles className="mr-2" />
            Organizar
          </Button>
        </div>

        {/* --- NOVO FASE 4: Botões de Importar/Exportar --- */}
        <div className="border-t pt-2 mt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportFlow} // Chama a ação de exportar
            className="w-full"
          >
            <Save className="mr-2" />
            Salvar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick} // Chama o handler de importação
            className="w-full"
          >
            <Upload className="mr-2" />
            Carregar
          </Button>

          {/* Input de arquivo escondido */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
        {/* --- FIM FASE 4 --- */}
      </div>
    </aside>
  );
}