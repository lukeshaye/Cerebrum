// src/flow/nodes/index.ts

import { TextNode } from "@/components/TextNode"; // Importa o TextNode existente
import { ImageNode } from "./ImageNode";
import { VideoNode } from "./VideoNode";

// Mova o TextNode.tsx para src/flow/nodes/TextNode.tsx
// ou ajuste o caminho de importação acima.
// Para este exemplo, vou assumir que você moveu o TextNode.

/* NOTA: Recomendo mover o arquivo `src/components/TextNode.tsx` 
  para `src/flow/nodes/TextNode.tsx` para manter a consistência
  da estrutura de pastas.
  
  Se você mover, atualize o import em `src/components/FlowCanvas.tsx`.
  Se não, apenas importe de `@/components/TextNode`.
*/


export const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
};