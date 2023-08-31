import { partial, once, throttle, debounce } from '@/fp'
import sinon from 'sinon'

// 重复执行
function repeat(fn, total = 1, interval = 0, cb) {
    let n = 0

    return function _call() {
        if (n < total) {
            fn()
            n++
            setTimeout(_call, interval)
        } else {
            cb && cb()
        }
    }
}

describe('fp', function () {
    it('partial', function () {
        function sum(a, b, c) {
            return a + b + c
        }

        let target = partial(sum)(1)

        target(2).should.be.a('function')
        target(2)(3).should.equal(6)
    })
    it('once', function () {
        let source = sinon.fake(),
            target = once(source)

        target()
        target()
        target()

        source.calledOnce.should.be.equal(true)
    })

    it('throttle', function (done) {
        let cb = sinon.fake()
        let t10 = throttle(10, cb)

        repeat(t10, 42, 1, () => {
            cb.callCount.should.lessThan(10)
            done()
        })()
    })

    it('debounce', function (done) {
        let cb = sinon.fake()
        let d10 = debounce(10, cb, { immediate: true })

        repeat(d10, 42, 1, () => {
            cb.callCount.should.equal(1)
            done()
        })()
    })
})
