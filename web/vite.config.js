import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('dockview-core') || id.includes('dockview-react'))
                        return 'dockview';
                    if (id.includes('/recharts/') || id.includes('/victory-vendor/'))
                        return 'charts';
                },
            },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    preview: {
        host: '0.0.0.0',
        port: 5173,
    },
});
