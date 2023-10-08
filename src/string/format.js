// 金额格式化，默认2位小数，逗号分隔
export function currency(s, n) {
    // 空字符直接转为0
    if (s == '' || s == null || s == undefined) {
        s = '0'
    }

    n = n >= 0 && n <= 20 ? n : 2
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''

    var l = s.split('.')[0].split('').reverse(),
        r = s.split('.')[1] || '',
        t = ''

    for (var i = 0; i < l.length; i++) {
        t +=
            l[i] +
            ((i + 1) % 3 == 0 && i + 1 != l.length && l[i + 1] != '-'
                ? ','
                : '')
    }

    return t.split('').reverse().join('') + (r.length > 0 ? '.' + r : '')
}

// 单词首字母大写
export function capitalize(s) {
    if (!s) return ''

    return s.charAt(0).toUpperCase() + s.slice(1)
}

// 将以sep为分隔符的字符串转为驼峰格式
export function camelcase(s, sep = '-') {
    var result = '',
        cut = false,
        multi = Array.isArray(sep)

    for (var i = 0; i < s.length; i++) {
        if (s[i] === ' ') cut = true // 空格默认为分隔符
        else if (multi && sep.includes(s[i])) cut = true
        else if (s[i] === sep) cut = true
        else {
            result += cut ? s[i].toUpperCase() : s[i]
            cut = false
        }
    }
    // 首字母小写
    if (result.length) result = result.charAt(0).toLowerCase() + result.slice(1)

    return result
}

// 将驼峰或者空格分隔的字符串转为以sep分隔的字符串
export function dashify(s, sep = '-') {
    var result = '',
        replace = false

    s = s.trim()

    for (var i = 0; i < s.length; i++) {
        if (s[i] === ' ') {
            replace = true
        } else if (s[i] === s[i].toUpperCase()) {
            result += sep + s[i].toLowerCase()
            replace = false
        } else {
            if (replace) {
                result += sep
                replace = false
            }
            result += s[i]
        }
    }
    // 可能出现首字符为 sep 的场景，需移除它
    if (result.charAt(0) === sep) result = result.slice(1)

    return result
}
// 同 camelcase，但首字母大写
export function pascalcase(s, sep = '-') {
    return capitalize(camelcase(s, sep))
}
