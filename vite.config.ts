import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env');

  return {
    base: '/', // Replace this if static is under a subdirectory
    plugins: [react(), tailwindcss()],
    envDir: './env',
    server: {
      port: parseInt(env['VITE_APP_PORT']),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
