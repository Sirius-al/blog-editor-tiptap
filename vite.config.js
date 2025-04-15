import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Library mode configuration
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/TiptapEditor.jsx'),
      name: 'TiptapEditor',
      // Provide file names for different formats
      fileName: (format) => `tiptap-react-editor.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize peer dependencies:
      external: ['react', 'react-dom', '@tiptap/react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tiptap/react': 'TiptapReact',
        },
      },
    },
  },
})