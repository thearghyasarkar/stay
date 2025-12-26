import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_PID': JSON.stringify(env.FIREBASE_PID),
        'process.env.FIREBASE_SB': JSON.stringify(env.FIREBASE_SB),
        'process.env.FIREBASE_MSI': JSON.stringify(env.FIREBASE_MSI),
        'process.env.FIREBASE_APPID': JSON.stringify(env.FIREBASE_APPID),
        'process.env.FIREBASE_MS1': JSON.stringify(env.FIREBASE_MS1),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
