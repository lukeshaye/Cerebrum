// vite.config.ts

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      
      // --- CORREÇÃO ---
      // Remova a linha do 'elkjs' que adicionamos.
      // Ela não é mais necessária agora que estamos
      // lidando com a URL do worker manualmente.
    },
  },
})