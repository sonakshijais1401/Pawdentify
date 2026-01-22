export default {
  plugins: [],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  esbuild: {
    jsx: 'automatic',
  },
}
