// src/App.tsx

import { FlowCanvas } from "@/components/FlowCanvas";
import { Toolbar } from "@/components/Toolbar";
import { Sidebar } from "@/components/Sidebar";

function App() {
  return (
    // Adicione "relative" aqui
    <main className="h-screen w-screen relative">
      <Toolbar />
      <Sidebar />
      <FlowCanvas />
    </main>
  );
}

export default App;