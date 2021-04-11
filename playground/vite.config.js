import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import ViewLauncherVuePlugin from '@view-launcher/rollup-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)

  return {
    plugins: [
      ViewLauncherVuePlugin({
        entry: path.resolve(__dirname, 'src/main.js'),
        theme: 'light',
        editor: env.VITE_EDITOR,
      }),
      vue(),
    ],
  }
})
