/* 
    基础类型相关 
*/

var proto = Object.prototype
var gpo = Object.getPrototypeOf

// 返回对象类型
export function type(obj) {
    return obj === null || obj === undefined
        ? String(obj)
        : Object.prototype.toString
              .call(obj)
              .match(/\[object (\w+)\]/)[1]
              .toLowerCase()
}

// 是否纯对象
export function isPojo(obj) {
    if (obj === null || typeof obj !== 'object') {
        return false
    }
    return gpo(obj) === proto
}

// 是否数字
export function isNumber(num) {
    if (typeof num === 'number') {
        return num - num === 0
    }
    if (typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
    }
    return false
}

/*
    options { // 复制选项
        exclude: [], // 不需要复制的属性名称
        depth: -1, // 递归深度，-1为不限制
    },
*/
function _deepCopy(target, options, _data) {
    const isArray = type(target) == 'array'
    /**
     * 只处理纯对象。自定义对象边际场景太多，如：
     * 1. IE11下 type(BigNumber) == “object"，chrome下 type(BigNumber) == BigNumber"
     **/
    const isPureObject = isPojo(target)

    let o,
        exclude = options.exclude || [], // 排除属性
        depth = _data.depth

    if (isArray) {
        o = []
    } else if (isPureObject) {
        o = {}
    } else {
        return target
    }

    // 超出最大复制层级
    if (depth >= options.depth) {
        return o
    }
    // 层级+1
    depth++

    if (isArray) {
        for (let i = 0; i < target.length; i++) {
            o.push(
                _deepCopy(target[i], options, {
                    depth,
                })
            )
        }
    } else if (isPureObject) {
        for (let i in target) {
            // 字段排除
            if (exclude.indexOf(i) < 0) {
                o[i] = _deepCopy(target[i], options, {
                    depth,
                })
            }
        }
    }
    return o
}

// 深复制
export function deepCopy(data, options = {}) {
    return _deepCopy(data, options, {
        depth: 0, // 层级
    })
}

// generate hashcode from string
export function hashCode(s) {
    var h = 0,
        l = s.length,
        i = 0

    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0
    return h
}
