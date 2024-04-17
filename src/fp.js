/* 
	函数式编程相关 
*/

// 柯里化
export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args)
        } else {
            return function (...nextArgs) {
                return curried(...args.concat(nextArgs))
            }
        }
    }
}
export { curry as partial } // alias

// 只执行一次
export function once(fn) {
    var called = false,
        result

    return function (...args) {
        if (called === false) {
            called = true
            result = fn.call(this, ...args)
        }

        return result
    }
}

// 节流
export function throttle(delay, callback, options = {}, debounceMode) {
    var timeoutId,
        lastTimeoutId,
        lastExec = 0

    var { leading = true, trailing = true, immediate = false } = options

    function wrapper() {
        var self = this
        var elapsed = Number(new Date()) - lastExec
        var args = arguments

        // Execute `callback` and update the `lastExec` timestamp.
        function exec() {
            lastExec = Number(new Date())
            callback.apply(self, args)
        }

        function clear() {
            if (timeoutId) {
                clearTimeout(timeoutId)
                timeoutId = undefined
            }

            if (lastTimeoutId) {
                clearTimeout(lastTimeoutId)
                lastTimeoutId = undefined
            }
        }

        // Clear any existing timeout.
        clear()

        // debounce mode
        if (debounceMode) {
            // 第一次立即执行
            if (lastExec === 0 && immediate) {
                return exec()
            }

            timeoutId = setTimeout(exec, delay)
        }
        // throttle mode
        else {
            // 第一次执行
            if (lastExec === 0) {
                // 立即执行
                if (leading) {
                    return exec()
                } else {
                    // 更新时间点
                    return (lastExec = Number(new Date()))
                }
            } else {
                // 间隔有效
                if (elapsed > delay) {
                    exec()
                }
                // 总是允许最后一次执行
                else if (trailing) {
                    lastTimeoutId = setTimeout(exec, delay - elapsed)
                }
            }
        }
    }

    // Return the wrapper function.
    return wrapper
}

// 防抖
export function debounce(delay, callback, options) {
    return throttle(delay, callback, options, true)
}

// 函数组合
export const compose =
    (...fns) =>
    (arg) =>
        fns.reduceRight((acc, fn) => fn(acc), arg)

// 函数管道
export const flow =
    (...fns) =>
    (arg) =>
        fns.reduce((acc, fn) => fn(acc), arg)
