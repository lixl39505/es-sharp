import { curry, once, throttle, debounce, compose, flow } from '@/fp'
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
    it('curry', function () {
        function sum(a, b, c) {
            return a + b + c
        }

        let target = curry(sum)(1)

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
        let t10 = throttle(100, cb)

        repeat(t10, 40, 10, () => {
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

    it('compose', function () {
        const double = (v) => v * 2
        const sqr = (v) => v * v
        const add2 = (v) => v + 2

        let target = compose(add2, double, sqr)

        target(1).should.equal(4)
        target(2).should.equal(10)
    })

    it('flow', function () {
        const double = (v) => v * 2
        const sqr = (v) => v * v
        const add2 = (v) => v + 2

        let target = flow(add2, double, sqr)

        target(1).should.equal(36)
        target(2).should.equal(64)
    })
})
