import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { env } from 'node:process';
import { defineConfig } from 'vite';

const proxy = { '/api': env.FUTURE_API_TARGET || 'http://127.0.0.1:3001' };
export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    server: { port: 5174, proxy },
    preview: { port: 4174, proxy },
});
