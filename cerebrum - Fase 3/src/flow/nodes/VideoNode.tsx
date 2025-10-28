// src/flow/nodes/VideoNode.tsx

import { Handle, Position, NodeProps } from "reactflow";
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
import { Video as VideoIcon } from "lucide-react";

// Função helper para converter URLs do YouTube (watch?v=) para (embed/)
const getEmbedUrl = (url: string) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }
    if (urlObj.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    // (Adicionar lógica para Vimeo, etc., se necessário)
    return url; // Retorna a URL original se for um embed direto
  } catch (error) {
    return null; // URL inválida
  }
};

export const VideoNode = memo(({ id, data }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  const embedUrl = getEmbedUrl(data.src);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md min-w-[300px] overflow-hidden">
        {/* Input do Label */}
        <input
          type="text"
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full bg-transparent outline-none border-none px-4 py-2"
          placeholder="Nó de Vídeo"
        />

        {/* Visualizador do Vídeo */}
        <div className="p-2 border-t border-zinc-200 bg-black">
          {embedUrl ? (
            <iframe
              width="100%"
              height="180"
              src={embedUrl}
              title={data.label || "Vídeo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-sm"
            ></iframe>
          ) : (
            <div className="w-full h-32 flex flex-col items-center justify-center text-zinc-500 bg-zinc-800 rounded-sm">
              <VideoIcon size={24} />
              <span className="text-xs mt-1">Sem URL do vídeo</span>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-700 !w-2 !h-2"
      />
    </>
  );
});