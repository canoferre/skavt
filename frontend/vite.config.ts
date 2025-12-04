import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/skavt/frontend/',
  server: {
    port: 5173
  }
});
