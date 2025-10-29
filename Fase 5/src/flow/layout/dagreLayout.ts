import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

// Cria uma nova instância do grafo do dagre
const g = new dagre.graphlib.Graph();
g.setDefaultEdgeLabel(() => ({})); // Boilerplate necessário

const nodeWidth = 150;
const nodeHeight = 50;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]): Node[] => {
  // Configura a direção do grafo (LR = Left to Right)
  g.setGraph({ rankdir: 'LR' });

  // Adiciona nós e arestas ao grafo do dagre
  nodes.forEach((node) => {
    g.setNode(node.id, { 
      width: node.width || nodeWidth, 
      height: node.height || nodeHeight 
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Roda o algoritmo de layout
  dagre.layout(g);

  // Mapeia os nós de volta para o formato do React Flow
  return nodes.map((node) => {
    const dagreNode = g.node(node.id);

    // IMPORTANTE: Dagre calcula a posição (x, y) do *centro* do nó.
    // O React Flow espera a posição (x, y) do *canto superior esquerdo*.
    // Por isso, ajustamos subtraindo metade da largura/altura.
    return {
      ...node,
      position: {
        x: dagreNode.x - (node.width || nodeWidth) / 2,
        y: dagreNode.y - (node.height || nodeHeight) / 2,
      },
    };
  });
};