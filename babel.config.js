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
                    // debug: true,
                    targets: {
                        ie: '11',
                    },
                },
            ],
        ],
        plugins: [
            [
                '@babel/plugin-transform-runtime', // 创建沙盒环境
                {
                    absoluteRuntime: false,
                    // corejs: 3,
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false,
                    version: '^7.20.0',
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
