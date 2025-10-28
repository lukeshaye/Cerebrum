import path from "path" // Importe o 'path'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Adicione este bloco 'resolve'
    },
  },
})