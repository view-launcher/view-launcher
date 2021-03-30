import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViewLauncherVuePlugin from '@view-launcher/rollup-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ViewLauncherVuePlugin(), vue()],
})
