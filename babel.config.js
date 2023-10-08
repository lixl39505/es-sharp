// 是否单测环境
function isBabelRegister(caller) {
    return !!(caller && caller.name === '@babel/register')
}

module.exports = (api) => {
    if (api.caller(isBabelRegister)) {
        // 单测环境不缓存
        api.cache(false)
    }

    const options = {
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: false, // 手动polyfill
                    targets: {
                        ie: '9',
                    },
                },
            ],
        ],
        plugins: [
            '@babel/plugin-syntax-dynamic-import', // 支持import()动态导入
            [
                '@babel/plugin-transform-runtime', // 创建沙盒环境
                {
                    absoluteRuntime: false, // 支持向上搜索@babel/runtime,但是会依赖绝对路径
                    corejs: false, // 是否使用corejs polyfill
                    helpers: true, // 抽离helper函数
                    regenerator: false, // 转换generator
                    useESModules: false, // 只兼容esModule
                    version: '^7.2.0', // 当前@babel/runtime版本号，支持semver
                },
            ],
            [
                'module-resolver', // 支持alias-path
                {
                    alias: {
                        // source
                        '@': './src',
                        string: './src/string',
                        // test
                        '~': './test',
                    },
                },
            ],
        ],
    }

    return options
}
