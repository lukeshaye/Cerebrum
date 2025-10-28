// src/flow/layout/elkLayout.ts

import { Node, Edge } from "reactflow";
import ELK, { ElkNode, ElkEdge, LayoutOptions } from "elkjs";

// --- INÍCIO DA CORREÇÃO ---
// Importe a URL do worker do ELK.
// O '?url' é um sufixo do Vite que nos dá o caminho público
// para este arquivo, em vez de tentar empacotá-lo.
import ElkWorkerUrl from 'elkjs/lib/elk-worker.js?url';

// Instancie o ELK passando a URL do worker
const elk = new ELK({
  workerUrl: ElkWorkerUrl
});
// --- FIM DA CORREÇÃO ---

// O resto do arquivo permanece o mesmo
const elkOptions: LayoutOptions = {
  "elk.algorithm": "mrtree",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "80", // Espaçamento entre nós
  "elk.padding": "[top=50,left=50,bottom=50,right=50]",
};

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[]
): Promise<Node[]> => {
  const graph: ElkNode = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      ...node,
      // ELK espera width e height
      width: node.width || 150, 
      height: node.height || 50,
    })),
    edges: edges.map((edge) => ({
      ...edge,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    
    // Mapeia de volta para o formato do React Flow
    return nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
      if (layoutedNode?.x && layoutedNode?.y) {
        return {
          ...node,
          position: {
            x: layoutedNode.x,
            y: layoutedNode.y,
          },
        };
      }
      return node;
    });
  } catch (e) {
    console.error("Erro no layout do ELK:", e);
    return nodes; // Retorna os nós originais em caso de erro
  }
};