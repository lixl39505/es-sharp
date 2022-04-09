const path = require('path')
const fs = require('fs')
const base = require('./webpackrc.base.js')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const webpackConfig = merge(base, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        // 设置环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // chunkhash 使用相对路径计算,优化缓存
        new webpack.ids.HashedModuleIdsPlugin({}),
    ],
    optimization: {
        minimize: true,
        // 代码压缩
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/, // 只压缩带.min的文件
                terserOptions: {
                    ecma: 2015, // 更简洁的es6+压缩
                    compress: {
                        drop_console: true, // 移除console
                        drop_debugger: true, // 移除debugger
                    },
                },
            }),
        ],
    },
})

// log
let dist = path.resolve(__dirname, '../dist')

fs.mkdirSync(dist, { recursive: true })
fs.writeFileSync(
    path.resolve(dist, './webpackrc.prod.json'),
    JSON.stringify(webpackConfig, null, 4)
)

module.exports = webpackConfig
