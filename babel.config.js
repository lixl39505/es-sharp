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
                    useBuiltIns: false, // 只转换语法
                    // useBuiltIns: 'usage',
                    // debug: true,
                    // corejs: '3',
                    targets: {
                        ie: '11',
                    },
                    bugfixes: true,
                    loose: true,
                },
            ],
        ],
        plugins: [
            [
                '@babel/plugin-transform-runtime', // 创建沙盒环境
                {
                    absoluteRuntime: false,
                    corejs: false, // polyfill 太笨重
                    helpers: true,
                    regenerator: true,
                    useESModules: false,
                    version: '^7.20.0',
                },
            ],
            [
                'module-resolver', // 支持 alias-path
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
