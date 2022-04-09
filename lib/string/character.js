// rgb转16进制 https://github.com/christian-bromann/rgb2hex/blob/master/index.js
export function rgb2hex(color) {
    if (typeof color !== 'string') {
        // throw error of input isn't typeof string
        throw new Error('color has to be type of `string`')
    } else if (color.substr(0, 1) === '#') {
        // or return if already rgb color
        return {
            hex: color,
            alpha: 1,
        }
    }

    /**
     * strip spaces
     */
    var strippedColor = color.replace(/\s+/g, '')

    /**
     * parse input
     */
    var digits =
        /(.*?)rgb(a)??\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([01]|0??\.([0-9]{0,})))??\)/.exec(
            strippedColor
        )

    if (!digits) {
        // or throw error if input isn't a valid rgb(a) color
        throw new Error(
            'given color (' + color + ") isn't a valid rgb or rgba color"
        )
    }

    var red = parseInt(digits[3], 10)
    var green = parseInt(digits[4], 10)
    var blue = parseInt(digits[5], 10)
    var alpha = digits[6] ? /([0-9\.]+)/.exec(digits[6])[0] : '1'
    var rgb = (blue | (green << 8) | (red << 16) | (1 << 24))
        .toString(16)
        .slice(1)

    // parse alpha value into float
    if (alpha.substr(0, 1) === '.') {
        alpha = parseFloat('0' + alpha)
    }

    // cut alpha value after 2 digits after comma
    alpha = parseFloat(Math.round(alpha * 100)) / 100

    return {
        hex: '#' + rgb.toString(16),
        alpha: alpha,
    }
}

// 是否高序位
export function isHighSurrogate(codePoint) {
    // 1101100000000000 - 1101101111111111
    return codePoint >= 0xd800 && codePoint <= 0xdbff
}

// 利用CJK中日韩统一表意文字计算字符串长度
export function cjkLength(str, half = 0.54) {
    if (typeof str !== 'string') {
        throw new Error('cnLength只接受字符串参数')
    }

    var len = 0

    for (var i = 0; i < str.length; i++) {
        var code = str[i].charCodeAt(0)

        // smp
        if (isHighSurrogate(code)) {
            len += 1
            i++
        }
        // cjk range@https://blog.csdn.net/chivalrousli/article/details/77412329
        else if (code >= 0x2e80 && code <= 0xfe4f) {
            len += 1
        }
        // 西文
        else {
            len += half
        }
    }

    return len
}

// cjk剪裁
export function cjkSlice(str, start = 0, length = Infinity, half) {
    if (typeof str !== 'string') {
        throw new Error('cjkSlice只接受字符串参数')
    }
    var total = Math.ceil(cjkLength(str, half)),
        result = ''

    // cjk目标长度
    if (length < 0) {
        length = total + length
    }
    length = Math.min(total, length)

    for (var i = 0, j = start; i < length && j < str.length; j++) {
        var c = str[j]
        result += c
        i += cjkLength(c, half)
    }

    return result
}

// cjk计算宽度，高效，极少数符号会漏掉，宽度也存在一些小偏差（西字占中文宽度一半并不总是适用）
export function cjkWidth(str, fontSize = 14, half) {
    return cjkLength(str, half) * fontSize
}
