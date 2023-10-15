import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default [
    {
        input: 'src/index.js',
        output: [
            // 输出 umd
            {
                file: 'lib/es-sharp.js',
                name: 'esSharp',
                format: 'umd',
            },
            // 输出 umd.min
            {
                file: 'lib/es-sharp.min.js',
                name: 'esSharp',
                format: 'umd',
                plugins: [terser()],
                sourcemap: 'hidden',
            },
        ],
        plugins: [
            // 支持 cmd module（需放在最前）
            commonjs(),
            // 支持 import npm package
            resolve(),
            // 支持 babel convert
            babel({ babelHelpers: 'runtime', exclude: 'node_modules/**' }),
        ],
    },
    {
        input: 'src/index.js',
        output: [
            {
                dir: 'es',
                format: 'esm',
                entryFileNames: '[name].mjs',
                preserveModules: true,
            },
        ],
    },
]
