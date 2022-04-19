import { type, isPojo, deepCopy } from './base'

// arr遍历
export function each(list, iteratee, context) {
    if (type(list) === 'array') {
        return list.forEach(iteratee, context)
    }
    if (type(list) === 'object') {
        return Object.keys(list).forEach((k) =>
            iteratee.call(context, list[k], k, list)
        )
    }
}

// arr过滤
export function filter(list, predicate, context) {
    if (type(list) === 'array') {
        return list.filter(predicate, context)
    }
    if (type(list) === 'object') {
        return Object.keys(list).reduce((acc, k) => {
            if (predicate.call(context, list[k], k, list)) {
                acc[k] = list[k]
            }
            return acc
        }, {})
    }
}

// arr映射
export function map(list, iteratee, context) {
    if (type(list) === 'array') {
        return list.map(iteratee, context)
    }
    if (type(list) === 'object') {
        return Object.keys(list).map((k) =>
            iteratee.call(context, list[k], k, list)
        )
    }
}

// obj映射
export function mapObj(obj, iteratee, context) {
    var result = {}

    Object.keys(obj).forEach((k) => {
        result[k] = iteratee.call(context, obj[k], k, obj)
    })

    return result
}

// 合并
function normalizeReduceArgs(...args) {
    // bind context
    if (args.length === 3) {
        args[0] = args[0].bind(args[2])
    }
    // normalize
    args = args.slice(0, 2)

    return args
}

//// reduce(list, iteratee, [memo], [context])
export function reduce(list, ...args) {
    args = normalizeReduceArgs(...args)

    if (type(list) === 'array') {
        return list.reduce(...args)
    }
    if (type(list) === 'object') {
        var iteratee = args[0],
            keys = Object.keys(list)

        args[0] = function (memo, k) {
            return iteratee(memo, list[k], k, list)
        }

        // 将第一个prop作为为memo
        if (args.length < 2 && keys.length) {
            args.push(list[keys.shift()])
        }

        return keys.reduce(...args)
    }
}

// 合并（从右到左）
export function reduceRight(list, ...args) {
    args = normalizeReduceArgs(...args)

    if (type(list) === 'array') {
        return list.reduceRight(...args)
    }
    if (type(list) === 'object') {
        var iteratee = args[0],
            keys = Object.keys(list)

        args[0] = function (memo, k) {
            return iteratee(memo, list[k], k, list)
        }

        // 将最后一个prop作为为memo
        if (args.length < 2 && keys.length) {
            args.push(list[keys.pop()])
        }

        return keys.reduceRight(...args)
    }
}

// 分组
export function groupBy(list, iteratee) {
    if (typeof iteratee == 'string') {
        var prop = iteratee

        iteratee = function (v) {
            return v[prop]
        }
    }

    if (typeof iteratee != 'function') {
        throw new TypeError(
            'groupBy iteratee`s type must be String or Functiom'
        )
    }

    var groups = {},
        key = ''

    each(list, (v) => {
        key = iteratee(v)
        groups[key] ? groups[key].push(v) : (groups[key] = [v])
    })

    return groups
}

// num求和
export function sum(list, iteratee) {
    if (list.length === 0) return 0
    if (typeof iteratee === 'string') {
        var prop = iteratee
        iteratee = (v) => v[prop]
    }
    if (!iteratee) iteratee = (v) => v

    return list.reduce((acc, v) => {
        return acc + iteratee(v)
    }, 0)
}

// 采摘，返回对象的部分字段，示例：
//// pick(obj, k1, k2, ...)
//// pick(obj, [k1, k2, ...])
//// pick(obj, (value, key, obj) => boolen))
export function pick(obj, ...keys) {
    keys = keys.flat()
    if (keys.length <= 0) return {}
    if (typeof keys[0] === 'function') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (keys[0](value, key, obj)) acc[key] = value

            return acc
        }, {})
    }

    return keys.reduce((acc, k) => {
        if (obj.hasOwnProperty(k)) acc[k] = obj[k]

        return acc
    }, {})
}

// 忽略，与pick相反，示例：
//// omit(obj, k1, k2, ...)
//// omit(obj, [k1, k2, ...])
//// omit(obj, (value, key, object) => boolen))
export function omit(obj, ...keys) {
    keys = keys.flat()

    var pred, idx

    if (typeof keys[0] === 'function') {
        pred = keys[0]
    } else {
        idx = keys.reduce((acc, k) => ((acc[k] = true), acc), {})

        pred = function (value, key) {
            return idx[key]
        }
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (!pred(value, key, obj)) acc[key] = value

        return acc
    }, {})
}

// 取并集
export function setUnion(s1, s2) {
    return Array.from(new Set([...s1, ...s2]))
}

// obj比较
export function objMatch(source, target) {
    if (type(target) === 'object') {
        if (type(source) !== 'object') {
            return false
        }

        return Object.keys(target).every((key) =>
            objMatch(source[key], target[key])
        )
    }

    if (type(target) === 'array') {
        if (type(source) !== 'array') {
            return false
        }

        return target.every((t, i) => objMatch(source[i], t))
    }

    return source === target
}

// 对象递归合并
// 1. 支持Array合并
// 2. to/from保持不变性
export function objMerge(to, from) {
    var isToPojo = isPojo(to),
        isFromPojo = isPojo(from),
        isToArr = type(to) === 'array',
        isFromArr = type(from) === 'array',
        res

    // 两者都为纯对象
    if (isToPojo && isFromPojo) {
        res = {}

        Object.keys(to).forEach((k) => {
            res[k] = objMerge(res[k], to[k])
        })

        Object.keys(from).forEach((k) => {
            res[k] = objMerge(res[k], from[k])
        })
    }
    // 两者都为纯数组
    else if (isToArr && isFromArr) {
        res = []

        to.forEach((v) => {
            res.push(objMerge(null, v))
        })

        from.forEach((v) => {
            res.push(objMerge(null, v))
        })
    }
    // 其它情况
    else {
        res = deepCopy(from)
    }

    return res
}

// 解析obj-path
export function getContextByPath(obj, path) {
    let tempObj = obj

    if (!path) {
        throw new Error('[warn]: please transfer a valid prop path to obj!')
    }

    path = path.replace(/\[(\w+)\]/g, '.$1')
    path = path.replace(/^\./, '')

    let keyArr = path.split('.'),
        target = keyArr.slice(-1)[0]

    for (let i = 0; i < keyArr.length - 1; ++i) {
        let key = keyArr[i]

        if (key in tempObj) {
            tempObj = tempObj[key]
        } else {
            throw new Error('[warn]: please transfer a valid prop path to obj!')
        }
    }

    return {
        o: tempObj,
        k: target,
        a: keyArr,
    }
}

/**
 * 根据path获取value
 * @param obj
 * @param path
 * @returns {{a: path的拆解, v: 结果值, k: 结果值的key, o: 结果值的父级}}
 */
export function getPropByPath(obj, path) {
    var context = getContextByPath(obj, path)

    return {
        ...context,
        v: context.o[context.k],
    }
}

// 根据path设置value
export function setPropByPath(obj, path, value) {
    var context = getContextByPath(obj, path),
        oldValue = context.o[context.k]

    context.o[context.k] = value

    return {
        ...context,
        v: value,
        p: oldValue,
    }
}

// id、pid结构转层级签套(id要唯一)
export function listToTree(
    list,
    {
        id: _id = 'id',
        pId: _pId = 'pId',
        rootId: _rootId = '',
        level: _level = 'level',
        isEnd: _isEnd = 'isEnd',
        children: _children = 'children',
        parent: _parent = 'parent',
        copy = true,
        done = () => {},
    } = {}
) {
    var map = {},
        tree

    // copy
    if (copy) {
        list = list.map((t) => Object.assign({}, t))
    }

    // 建立索引
    list.forEach((t) => {
        map[t[_id]] = t
        t[_isEnd] = true
        t[_children] = []
    })

    // 建立父子关系
    list.forEach((t) => {
        var parent = map[t[_pId]]

        t.isTop = !parent

        if (parent) {
            parent[_children]
                ? parent[_children].push(t)
                : (parent[_children] = [t]),
                (parent[_isEnd] = false)

            // 引用父级（不可枚举，防止部分场景下，双向引用带来的死循环问题）
            Object.defineProperty(t, _parent, {
                value: parent,
                configurable: true,
            })
        }
    })

    // 建立level
    function setLevel(node, level) {
        node[_level] = level

        if (node[_children]) {
            node[_children].forEach((t) => setLevel(t, level + 1))
        }
    }

    list.filter((t) => t.isTop).forEach((t) => setLevel(t, 1))

    tree = list.filter((t) => {
        if (_rootId) {
            return t[_pId] == _rootId
        } else {
            return t.isTop
        }
    })

    // 转换完成后回调
    done(tree, map, list)

    // 返回tree
    return tree
}

// 深度优先遍历
export function deepTraverse(forest, callback, options = {}) {
    if (type(forest) != 'array') {
        forest = [forest]
    }

    var { children = 'children' } = options
    var isContinue = true // 控制遍历是否继续执行

    function iterate(node, parent, options) {
        isContinue = callback(node, parent, options)

        // 默认继续
        if (typeof isContinue == 'undefined') {
            isContinue = true
        }

        if (isContinue && node[children]) {
            node[children].every((n) => iterate(n, node, options))
        }

        return isContinue
    }

    forest.every((root) => iterate(root, null, options))
}

// 广度优先遍历
export function breadthTraverse(forest, callback, options = {}) {
    if (type(forest) != 'array') {
        forest = [forest]
    }

    var { children = 'children' } = options
    var stack = [...forest],
        node,
        prevNode = null,
        isContinue = true

    while (isContinue && (node = stack.shift())) {
        isContinue = callback(node, prevNode, options)
        prevNode = node

        // 默认继续
        if (typeof isContinue == 'undefined') {
            isContinue = true
        }

        if (isContinue && node[children]) {
            stack.push(...node.children)
        }
    }
}
