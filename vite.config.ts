import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import compressionPlugin from 'vite-plugin-compression';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const config = {
    plugins: [
      (OptimizationPersist as any).default ? (OptimizationPersist as any).default() : OptimizationPersist(),
      (PkgConfig as any).default ? (PkgConfig as any).default() : PkgConfig(),
      vue({
        script: {
          defineModel: true,  
        }
      }),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        // global imports to register
        imports: [
          'vue', 
          'vue-router',
          'pinia'
        ],
        dirs: [
          './src/i18n'  // 自动导入i18n中的全局组件
        ],
        // 生成声明文件
        dts: './auto-imports.d.ts',
        vueTemplate: false,  // 自动导入vue模板中的全局组件        
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: './components.d.ts',
        dirs: ['./src/components'],
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')], 
        symbolId: 'icon-[dir]-[name]',
      }),
       // 压缩组件
      compressionPlugin({
				ext: '.gz', // 指定压缩后的文件扩展名
				algorithm: 'gzip', // 指定压缩算法 (gzip, brotli, deflate)
				threshold: 1024, // 指定文件大小的最小值，小于该值的文件不会被压缩 (单位：字节)
				deleteOriginFile: false, // 是否删除原始文件，默认为 false
			}),    
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,  // 开启less的js功能，用于在less文件中使用js变量
          additionalData: `
            @import "@/assets/css/variable.less";
          `,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    mode: env.VITE_APP_SERVER_MODE,
    server: {
      port: Number(env.VITE_APP_SERVER_PORT),
      host: '0.0.0.0',  // 允许外部访问
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    esbuild: {
      // 开启esbuild的tree shaking功能，清除console.log等语句
      treeShaking: true,
      // pure: ['console.log'],
      // minify: true,
    }
  }
  return config;
})
