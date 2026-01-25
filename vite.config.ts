import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Check if building as library
    const isLibraryMode = mode === 'library';
    
    const baseConfig = {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };

    if (isLibraryMode) {
      // Library mode configuration for embedding in xTab-dashboard
      return {
        ...baseConfig,
        build: {
          lib: {
            entry: path.resolve(__dirname, 'index.tsx'),
            name: 'XtabGemini',
            formats: ['es', 'umd'],
            fileName: (format) => `xtab-gemini.${format}.js`,
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        },
      };
    }

    // Standalone mode configuration
    return {
      ...baseConfig,
      base: '/xtab-gemini/',
    };
});
