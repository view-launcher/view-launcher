import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViewLauncherVuePlugin from '@view-launcher/rollup-plugin'

export default defineConfig({
  plugins: [ViewLauncherVuePlugin({ entry: path.resolve(__dirname, 'src/main.js'), theme: 'light' }), vue()],
})
