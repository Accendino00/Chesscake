import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/material': '@mui/material', // Ensure Material-UI imports are resolved correctly
      '@mui/icons-material': '@mui/icons-material', // Ensure Material-UI icons imports are resolved correctly
    },
  },
})
