// 发布-订阅模型
function Event() {
    this.events = {}
}

Object.assign(Event.prototype, {
    $emit(name, ...args) {
        var list = this.events[name]

        if (list) {
            list.forEach((sub) => sub.handler.apply(sub.ctx, args))

            // 移除once
            for (var i = 0; i < list.length; ) {
                if (list[i].handler.__expired__) {
                    list.splice(i, 1)
                } else {
                    i++
                }
            }
        }
    },

    $on(name, cb, ctx) {
        var sub = {
            handler: cb,
            ctx: ctx || null,
        }

        if (this.events[name]) {
            this.events[name].push(sub)
        } else {
            this.events[name] = [sub]
        }
    },

    $once(name, cb, ctx) {
        var me = this,
            oneTimeCb = function (...args) {
                cb.call(this, ...args)
                // 事件队列仍在遍历，不能修改，先打上标记
                oneTimeCb.__expired__ = true
            }

        this.$on(name, oneTimeCb, ctx)
    },

    $off(name, cb) {
        var list = this.events[name]

        if (list) {
            if (cb) {
                var index = list.findIndex((sub) => sub.handler == cb)

                if (index >= 0) {
                    list.splice(index, 1)
                }
            } else {
                list.splice(0, list.length)
            }
        }
    },
})

export { Event }
// alias
export { Event as Events }
