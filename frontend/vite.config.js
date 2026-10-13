import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development, any request to /api is forwarded to the Spring Boot app on port 8080.
// This means the browser talks to one address only, so no CORS setup is needed yet.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
