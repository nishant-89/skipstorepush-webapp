import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001,
    strictPort: true,
  },
  resolve: {
    alias: [{ find: 'src', replacement: '/src' }],
  },
  define: {
    'process.env': process.env
  }
});