// 1. Importar os componentes que criamos
import FlowCanvas from '@/components/FlowCanvas'
import { Toolbar } from '@/components/Toolbar'

// O componente App principal agora é muito simples.
// Ele apenas renderiza o Canvas (fundo) e a Toolbar (por cima).
function App() {
  return (
    <main>
      <Toolbar />
      <FlowCanvas />
    </main>
  )
}

export default App