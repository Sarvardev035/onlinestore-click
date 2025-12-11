import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    middlewareMode: true
  },
  build: {
    lib: {
      entry: './src/main.jsx',
      name: 'ReactCart',
      formats: ['es', 'umd'],
      fileName: (format) => `react-cart.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
