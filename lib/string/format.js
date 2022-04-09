// 金额格式化，默认2位小数，逗号分隔
export function currency(s, n) {
    // 空字符直接转为0
    if (s == "" || s == null || s == undefined) {
        s = "0"
    }
    
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1] || '',
        t = "";
    
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length && l[i + 1] != "-" ? "," : "");
    }
    
    return t.split("").reverse().join("") + (r.length > 0 ? "." + r : '');
}

// 单词首字母大写
export function capitalize(s) {
    if (!s) return ''
    s = s.toString()
    
    return s.charAt(0).toUpperCase() + s.slice(1)
}