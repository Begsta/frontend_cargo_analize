import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000' },
      '/s3': {
        target: 'http://127.0.0.1:9100',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/s3/, ''),
      },
    },
  },
});
