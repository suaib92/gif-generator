import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://gif-generator-wbgn.onrender.com', // Your backend URL
        changeOrigin: true,
        secure: false, // Set this to `true` if you're using HTTPS on the backend
      },
    },
  },
});
