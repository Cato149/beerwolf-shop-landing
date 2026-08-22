import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // GitHub Pages project sites use /<repo>/; beerwolf.site and local dev use "/".
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    build: {
      target: 'es2022',
      sourcemap: true,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
      css: true,
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    },
  };
});
