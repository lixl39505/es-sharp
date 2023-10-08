const path = require('path')
const fs = require("fs")
const base = require('./webpackrc.base.js')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const webpackConfig = merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, '../lib'), // 文件根目录
        hot: true // 启动热更新
    },
    plugins: [
        // 设置环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        // 热更新插件
        new webpack.HotModuleReplacementPlugin()
    ]
})

// log
let lib = path.resolve(__dirname, '../lib')

fs.mkdirSync(lib, { recursive: true })
fs.writeFileSync(path.resolve(lib, './webpackrc.dev.json'), JSON.stringify(webpackConfig, null, 4))

module.exports = webpackConfig