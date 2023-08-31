import { once } from './fp'
import { isThenable } from './base'

// 异步队列
export function runQueue(queue, fn, cb) {
    const stopQueue = (err, index) => {
        // 回调函数签名 cb(error, allDone: boolean)
        cb && cb(err, index >= queue.length)
    }

    const step = (index) => {
        if (index >= queue.length) {
            stopQueue(null, index)
        } else {
            // 第二个参数为函数 next(error, keepgoing = true)
            fn(queue[index], (err, keepgoing) => {
                err || keepgoing === false
                    ? stopQueue(err, index)
                    : step(index + 1)
            })
        }
    }

    Promise.resolve().then(() => step(0))
}

// 构造串联任务
export function series(tasks, config) {
    for (var i = 0; i < tasks.length; i++) {
        if (typeof tasks[i] !== 'function')
            throw new Error(`${tasks[i]} is not a Task Function`)
    }
    var {
        forgiving = false, // 遇到错误是否终止队列
        waterfall = false, // 是否将上一个任务的返回值作为下一个任务的参数
        context, // 执行上下文
    } = config || {}

    // combines tasks
    return function () {
        var firstError = null,
            results = [], // 收集任务返回值
            args = [...arguments] // 初始参数

        return new Promise((resolve, reject) => {
            runQueue(
                tasks,
                (f, next) => {
                    var nextTask = once((err, data) => {
                            // ignore err
                            if (forgiving) err = null
                            // 瀑布流参数传递
                            if (waterfall) args = [data]

                            if (err && !firstError) firstError = err
                            results.push(data)
                            next(err)
                        }),
                        result

                    try {
                        result = f.apply(context, args)
                    } catch (e) {
                        // 支持同步异常
                        nextTask(e)
                    }

                    // 支持Promise
                    if (isThenable(result)) {
                        return result
                            .then((v) => nextTask(null, v))
                            .catch((err) => nextTask(err))
                    }
                    // 支持同步返回
                    else nextTask(null, result)
                },
                () => {
                    firstError ? reject(firstError) : resolve(results)
                }
            )
        })
    }
}

// alias: series(tasks)
export function seq(...tasks) {
    return series(tasks)
}
// alias: series(tasks, { forgiving: true })
export function seqForgiving(...tasks) {
    return series(tasks, {
        forgiving: true,
    })
}
// alias: series(tasks, { waterfall: true })
export function waterfall(...tasks) {
    return series(tasks, {
        waterfall: true,
    })
}

// 构造并联任务
export function parallel(tasks, config) {
    for (var i = 0; i < tasks.length; i++) {
        if (typeof tasks[i] !== 'function')
            throw new Error(`${tasks[i]} is not a Task Function`)
    }
    var {
        concurrency = Infinity, // 并发数
        context, // 执行上下文
    } = config || {}

    return function () {
        let total = tasks.length,
            count = 0, // 当前正在执行的任务数
            current = 0, // 执行到第几个任务
            finish = 0, // 执行完毕的任务数
            running = false, // 调度是否正在执行
            results = [], // 收集任务返回值
            firstError = null,
            args = [...arguments] // 初始参数

        return new Promise((resolve, reject) => {
            // 并发执行
            let run = () => {
                // 以免同步task反复触发 run
                running = true
                // 所有任务执行完毕
                if (finish >= total) {
                    firstError ? reject(firstError) : resolve(results)
                } else {
                    // 并发数限制
                    while (count < concurrency && current < total) {
                        let exec = (i) => {
                            let f = tasks[i],
                                result,
                                done = once((err, data) => {
                                    count--
                                    finish++
                                    if (err && !firstError) firstError = err
                                    results[i] = data
                                    // wakeup
                                    if (running === false) run()
                                })
                            // 需在 done 之前修改
                            count++
                            current++
                            try {
                                result = f.apply(context, args)
                            } catch (e) {
                                done(e)
                            }

                            if (isThenable(result)) {
                                return result
                                    .then((v) => done(null, v))
                                    .catch((err) => done(err))
                            } else done(null, result)
                        }

                        // 执行任务
                        exec(current)
                    }
                }
                running = false
            }
            // initial run
            run()
        })
    }
}
// alias: parallel(tasks)
export function parl(...tasks) {
    return parallel(tasks)
}
