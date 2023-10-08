var CHAR_FORWARD_SLASH = 47 // "/"
var CHAR_BACKWARD_SLASH = 92 // "\"
var CHAR_DOT = 46 // "."

// 是否路径分隔符
function isPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH
}

function normalize(path) {
    if (path.length === 0) return '.'
    //
    var isAbsolute = isPathSeparator(path.charCodeAt(0))
    var trailingSeparator = isPathSeparator(path.charCodeAt(path.length - 1))

    // Normalize the path
    path = normalizeString(path, !isAbsolute, '/')
    if (path.length === 0 && !isAbsolute) path = '.'
    // normalizeString的运算结果不包含头尾的"/"，所以这里额外再处理一次
    if (path.length > 0 && trailingSeparator) path += '/'
    if (isAbsolute) return '/' + path
    return path
}

// 计算相对路径 `./../`
function normalizeString(path, allowAboveRoot, separator) {
    var res = ''
    var lastSegmentLength = 0
    var lastSlash = -1
    var dots = 0
    var code

    // 以sep为界，逐段拼接并生成最终的路径res
    for (var i = 0; i <= path.length; ++i) {
        if (i < path.length) code = path.charCodeAt(i)
        // lastCode is "/", stop
        else if (isPathSeparator(code)) break
        // lastCode is not "/", treat code as "/", deal with lastSegment
        else code = CHAR_FORWARD_SLASH

        // when "/"
        if (isPathSeparator(code)) {
            // match "//" or "./"
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            }
            // match “../"
            else if (lastSlash !== i - 1 && dots === 2) {
                if (
                    res.length < 2 ||
                    lastSegmentLength !== 2 ||
                    res.charCodeAt(res.length - 1) !== CHAR_DOT ||
                    res.charCodeAt(res.length - 2) !== CHAR_DOT
                ) {
                    // "abc/../" or “a/b/../”
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator)

                        if (lastSlashIndex !== res.length - 1) {
                            //  "abc/../"
                            if (lastSlashIndex === -1) {
                                // res = ""
                                res = ''
                                lastSegmentLength = 0
                            }
                            // "xx/abc/../"
                            else {
                                // res = "xx"
                                res = res.slice(0, lastSlashIndex)
                                lastSegmentLength =
                                    res.length - 1 - res.lastIndexOf(separator)
                            }
                            lastSlash = i
                            dots = 0
                            continue
                        }
                    }
                    // "a/../" or "ab/../"
                    else if (res.length === 2 || res.length === 1) {
                        res = ''
                        lastSegmentLength = 0
                        lastSlash = i
                        dots = 0
                        continue
                    }
                }
                // 允许超过当前根目录
                if (allowAboveRoot) {
                    // 此处res只会包含"../“
                    if (res.length > 0) res += `${separator}..`
                    else res = '..'
                    lastSegmentLength = 2
                }
            }
            // match "xx/"
            else {
                if (res.length > 0)
                    res += separator + path.slice(lastSlash + 1, i)
                else res = path.slice(lastSlash + 1, i)
                lastSegmentLength = i - lastSlash - 1
            }
            lastSlash = i
            dots = 0
        }
        // when "x"
        else if (code === CHAR_DOT && dots !== -1) {
            ++dots
        } else {
            dots = -1
        }
    }
    return res
}

function join() {
    if (arguments.length === 0) return '.'
    // web环境，统一使用'/'作为分隔符
    var sep = '/'
    var joined
    var firstPart
    for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i]

        if (!arg.replace) {
            throw new Error(
                `The "pathJoin" argument must be of type string. Received type ${typeof arg} (${arg})`
            )
        }
        // add 统一sep
        arg = arg.replace(/\\/g, '/')

        if (arg.length > 0) {
            if (joined === undefined) joined = firstPart = arg
            else joined += sep + arg
        }
    }
    if (joined === undefined) return '.'

    return normalize(joined)
}

export { join as pathJoin }
