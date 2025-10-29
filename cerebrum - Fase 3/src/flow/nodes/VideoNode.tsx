// src/flow/nodes/VideoNode.tsx

import { Handle, Position, NodeProps, NodeResizer } from "reactflow"; // 1. Importar NodeResizer
import { memo, ChangeEvent } from "react";
import { useFlowStore } from "@/state/useFlowStore";
import { Video as VideoIcon } from "lucide-react";

// (Função getEmbedUrl permanece a mesma)
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
    return url;
  } catch (error) {
    return null;
  }
};

// 2. Receber width, height e selected
export const VideoNode = memo(({ id, data, width, height, selected }: NodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: event.target.value });
  };

  const embedUrl = getEmbedUrl(data.src);

  // 3. Criar o objeto de estilo
  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  // 4. Calcular altura do iframe (descontando o label)
  // O input tem ~42px (py-2 * 2 + border + font-size). 50px é uma boa margem.
  const iframeHeight = height ? height - 50 : 180;

  return (
    <>
      {/* 5. Adicionar o NodeResizer */}
      <NodeResizer
        isVisible={selected}
        minWidth={300}
        minHeight={250}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-700 !w-2 !h-2"
      />

      {/* 6. Aplicar o 'style' e layout flex */}
      <div
        style={style}
        className="bg-white border-2 border-zinc-900 shadow-lg rounded-md min-w-[300px] overflow-hidden flex flex-col h-full"
      >
        <input
          type="text"
          value={data.label || ""}
          onChange={handleLabelChange}
          className="text-zinc-900 text-base font-medium w-full bg-transparent outline-none border-none px-4 py-2"
          placeholder="Nó de Vídeo"
        />

        {/* 7. Fazer a área do vídeo crescer */}
        <div className="p-2 border-t border-zinc-200 bg-black flex-grow h-full">
          {embedUrl ? (
            <iframe
              width="100%"
              height={iframeHeight} // Altura dinâmica
              src={embedUrl}
              title={data.label || "Vídeo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-sm"
            ></iframe>
          ) : (
            <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-zinc-500 bg-zinc-800 rounded-sm">
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