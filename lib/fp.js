/* 
	函数式编程相关 
*/

// 偏函数
export const partial =
    (f, ...arr) =>
    (...args) =>
        ((a) => (a.length === f.length ? f(...a) : partial(f, ...a)))([
            ...arr,
            ...args,
        ])

// 单例
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
