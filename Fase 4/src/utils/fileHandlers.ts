// src/utils/fileHandlers.ts

import { Node, Edge } from 'reactflow';

// Definimos um tipo para nossos dados de fluxo
type FlowData = {
  nodes: Node[];
  edges: Edge[];
};

/**
 * Inicia o download de um arquivo .json com o estado atual do fluxo.
 */
export const exportFlowAsJson = (nodes: Node[], edges: Edge[]) => {
  const flowData: FlowData = { nodes, edges };
  
  // Converte o objeto para uma string JSON formatada
  const jsonString = JSON.stringify(flowData, null, 2);
  
  // Cria um Blob (Binary Large Object)
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Cria uma URL temporária para o Blob
  const url = URL.createObjectURL(blob);

  // Cria um link <a> invisível para iniciar o download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cerebrum-flow.json'; // Nome do arquivo
  document.body.appendChild(link);
  link.click(); // Simula o clique
  
  // Limpa o link e a URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Lê um arquivo .json e retorna os nodes e edges.
 * Usa uma Promise para lidar com a leitura assíncrona do arquivo.
 */
export const importFlowFromJson = (file: File): Promise<FlowData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const flowData: FlowData = JSON.parse(jsonString);
        
        // Validação básica para garantir que o arquivo tem o formato esperado
        if (flowData.nodes && flowData.edges) {
          resolve(flowData);
        } else {
          reject(new Error('Arquivo JSON inválido. Faltando "nodes" ou "edges".'));
        }
      } catch (error) {
        reject(new Error('Erro ao processar o arquivo JSON.'));
      }
    };

    reader.onerror = (error) => reject(error);
    
    // Inicia a leitura do arquivo como texto
    reader.readAsText(file);
  });
};