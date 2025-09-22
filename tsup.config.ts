import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs', 'iife'],
        dts: true,
        minify: false,
        outExtension({ format }) {
            return {
                js: `.${format}.js`,
                dts: `.d.ts`,
            }
        },
        globalName: 'ArcoDesignColor',
    },
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs', 'iife'],
        dts: false,
        clean: true,
        treeshake: true,
        minify: true,
        outExtension({ format }) {
            return {
                js: `.prod.${format}.js`,
            }
        },
        globalName: 'ArcoDesignColor',
    },
])
