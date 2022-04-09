// 基础api
import { type, isPojo, isNumber, deepCopy, hashCode } from './base'
// 函数相关
import { partial, once, runQueue, throttle, debounce } from './fp'
// 字符串处理相关
import {
    rgb2hex,
    isHighSurrogate,
    cjkLength,
    cjkSlice,
    cjkWidth,
    currency,
    capitalize,
    pathJoin,
    qs,
} from './string'
// 聚合类型相关
import {
    each,
    filter,
    map,
    reduce,
    reduceRight,
    groupBy,
    sum,
    pick,
    omit,
    listToTree,
    deepTraverse,
    breadthTraverse,
    setUnion,
    objMatch,
    objMerge,
    getContextByPath,
    getPropByPath,
    setPropByPath,
} from './aggregate'
// 事件模型
import Event from './event'

export {
    // base
    type,
    isPojo,
    isNumber,
    deepCopy,
    hashCode,
    // function
    partial,
    partial as curry, // alias
    once,
    runQueue,
    throttle,
    debounce,
    // string
    rgb2hex,
    isHighSurrogate,
    cjkLength,
    cjkSlice,
    cjkWidth as getTextWidth, // @forward compatibility
    currency,
    capitalize,
    pathJoin,
    qs,
    // aggregate
    each,
    filter,
    map,
    reduce,
    reduceRight,
    groupBy,
    sum,
    pick,
    omit,
    listToTree,
    deepTraverse,
    breadthTraverse,
    setUnion,
    objMatch,
    objMerge,
    objMerge as objectMerge, // alias
    getContextByPath,
    getPropByPath,
    setPropByPath,
    // Event
    Event,
    Event as Events, // alias
}
