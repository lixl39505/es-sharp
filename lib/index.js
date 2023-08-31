import { type, isPojo, isNumber, deepCopy, hashCode } from './base'
import { partial, once, throttle, debounce } from './fp'
import { runQueue } from './async'
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
import {
    each,
    filter,
    map,
    mapObj,
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
    cjkWidth,
    cjkWidth as getTextWidth, // @forward compatibility
    currency,
    capitalize,
    pathJoin,
    qs,
    // aggregate
    each,
    filter,
    map,
    mapObj,
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
