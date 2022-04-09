const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // clear before bundle
const { WebpackManifestPlugin } = require('webpack-manifest-plugin') // modules map to output
const pkg = require('../package.json')

const libName = pkg.name

module.exports = {
    entry: {
        [libName]: './lib/index.js',
        [libName + '.min']: './lib/index.js', // 压缩版
    },
    plugins: [new WebpackManifestPlugin(), new CleanWebpackPlugin()],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js', // 文件名
        library: libName, // 模块名
        libraryTarget: 'umd',
        globalObject: 'this', // this for browsers and Node; self for Web-like targets
        environment: {
            // The environment supports arrow functions ('() => { ... }').
            arrowFunction: false,
            // The environment supports BigInt as literal (123n).
            bigIntLiteral: false,
            // The environment supports const and let for variable declarations.
            const: false,
            // The environment supports destructuring ('{ a, b } = obj').
            destructuring: false,
            // The environment supports an async import() function to import EcmaScript modules.
            dynamicImport: false,
            // The environment supports 'for of' iteration ('for (const x of array) { ... }').
            forOf: false,
            // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
            module: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    externals: {},
}
