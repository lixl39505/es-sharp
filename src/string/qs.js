function addPair(obj, key, value) {
    key = decodeURIComponent(key)
    value = decodeURIComponent(value)

    // 兼容a[]=1&a[]=2形式
    if (key.slice(-2) == '[]') {
        key = key.replace(/\[\]$/, '')
    }

    // repeat to array
    if (key in obj) {
        if (obj[key] && obj[key].splice) {
            obj[key].push(value)
        } else {
            obj[key] = [obj[key], value]
        }
    } else {
        obj[key] = value
    }
}

// todo:
// 1. RFC 3986 and RFC 1738 space encoding
// 2. character sets
export const qs = {
    parse(str, options) {
        if (!str || typeof str != 'string') {
            return {}
        }

        // ?之后
        var queryIndex = str.indexOf('?')
        if (queryIndex >= 0) {
            str = str.slice(queryIndex + 1)
        }

        // #之前
        var hashIndex = str.indexOf('#')
        if (hashIndex >= 0) {
            str = str.slice(0, hashIndex)
        }

        // =&
        var result = {},
            key = '',
            value = '',
            isVal = false

        for (var i = 0; i < str.length; i++) {
            var c = str[i]

            // start of value
            if (isVal == false && c == '=') {
                isVal = true
                continue
            }

            // end of key-value pair
            if (c == '&') {
                if (key) {
                    addPair(result, key, value)
                }

                // reset for next pair
                key = ''
                value = ''
                isVal = false
                continue
            }

            // acc key or value
            isVal ? (value += c) : (key += c)
        }

        // may exist last key-value
        if (key && isVal) {
            addPair(result, key, value)
        }

        return result
    },

    stringify(obj = {}, options) {
        var qs = ''

        Object.keys(obj).forEach((k, i, a) => {
            var key = k,
                value = obj[k]

            if (value === null || typeof value == 'undefined') {
                value = ''
            }

            // 支持数组，转换为a=1&a=2
            if (value.splice) {
                value.forEach(
                    (v) =>
                        (qs +=
                            encodeURIComponent(key) +
                            '=' +
                            encodeURIComponent(v) +
                            '&')
                )
            } else {
                qs +=
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(value) +
                    '&'
            }
        })

        // 移除最后多余的'&'
        if (qs.length > 1) {
            qs = qs.slice(0, qs.length - 1)
        }

        return qs
    },
}
