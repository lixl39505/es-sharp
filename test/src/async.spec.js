import { runQueue, seq, seqForgiving, parl, waterfall, parallel } from '@/async'
import sinon from 'sinon'

// 计时(s)
function tick(seconds, value, fail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fail ? reject(value) : resolve(value)
        }, seconds * 1000)
    })
}

let async, sync

describe('async', function () {
    beforeEach(() => {
        async = sinon.fake(tick)
        sync = sinon.fake((v) => v)
    })

    it('runQueue', function (done) {
        runQueue(
            [1, 2, 3],
            (v, next) => next(),
            (err, over) => {
                try {
                    over.should.equal(true)
                } catch (e) {
                    err = e
                }

                done(err)
            }
        )
    })

    describe('series', function () {
        it('seq', function () {
            let ses = seq(
                () => async(0.1, 1),
                () => sync(2),
                () => async(0.1, 3)
            )

            let startTime = Date.now()

            return ses().then((results) => {
                let duration = (Date.now() - startTime) / 1000
                duration.should.be.gte(0.2) // 执行时间应大于 0.2 s

                async.calledTwice.should.be.true
                // task returnValue
                async.firstCall.returnValue.should.eventually.equal(1)
                sync.firstCall.returnValue.should.be.equal(2)
                async.secondCall.returnValue.should.eventually.equal(3)
                //
                results.should.be.eqls([1, 2, 3])
            })
        })

        it('seq fail', function () {
            let ses = seq(
                () => async(0.1, 1),
                () => async(0.1, 2, true), // failed
                () => sync(3)
            )

            return ses().catch((err) => {
                async.callCount.should.be.equal(2)
                err.should.be.equal(2)
                sync.callCount.should.be.equal(0)
            })
        })

        it('seqForgiving', function () {
            let ses = seqForgiving(
                () => async(0.1, 1),
                () => async(0.1, 2, true), // pass
                () => sync(3)
            )

            return ses().then((results) => {
                async.callCount.should.be.equal(2)
                results.should.be.eqls([1, undefined, 3])
                sync.callCount.should.be.equal(1)
            })
        })

        it('series with params', function () {
            let ses = seqForgiving(
                (v) => async(0.1, v),
                (v) => async(0.1, v),
                (v) => sync(v)
            )

            return ses(1).then((results) => {
                async.callCount.should.be.equal(2)
                results.should.be.eqls([1, 1, 1])
                sync.callCount.should.be.equal(1)
            })
        })

        it('waterfall', function () {
            let ses = waterfall(
                (v) => async(0.1, v + 1),
                (v) => async(0.1, v + 1),
                (v) => sync(v + 1)
            )

            return ses(1).then((results) => {
                async.callCount.should.be.equal(2)
                results.should.be.eqls([2, 3, 4])
                sync.callCount.should.be.equal(1)
            })
        })
    })

    describe('parallel', function () {
        it('parl', function () {
            let pl = parl(
                () => async(0.2, 1),
                () => async(0.1, 2),
                () => sync(3)
            )

            let startTime = Date.now()
            return pl().then((results) => {
                let duration = (Date.now() - startTime) / 1000
                duration.should.be.lt(0.3) // 执行时间应小于0.3 s

                async.callCount.should.be.equal(2)
                results.should.be.eqls([1, 2, 3])
                sync.callCount.should.be.equal(1)
            })
        })

        it('parl fail', function () {
            let pl = parl(
                () => async(0.2, 1),
                () => async(0.1, 2, true),
                () => sync(3)
            )

            let startTime = Date.now()
            return pl().catch((e) => {
                let duration = (Date.now() - startTime) / 1000
                duration.should.be.lt(0.3) // 执行时间应小于0.3 s

                async.callCount.should.be.equal(2)
                e.should.be.eq(2)
                sync.callCount.should.be.equal(1)
            })
        })

        it('parl with concurrency', function () {
            let pl = parallel(
                [
                    () => async(0.2, 1),
                    () => async(0.2, 2),
                    //
                    () => async(0.1, 3),
                    () => sync(4),
                ],
                {
                    concurrency: 2,
                }
            )

            let startTime = Date.now()
            return pl().then((results) => {
                let duration = (Date.now() - startTime) / 1000
                duration.should.be.gte(0.3) // 执行时间应大于 0.3 s

                async.callCount.should.be.equal(3)
                results.should.be.eqls([1, 2, 3, 4])
            })
        })
    })

    describe('combine series and paralled', function () {
        it('series nested', function () {
            let seqs = seq(
                () => async(0.1, 1),
                () => async(0.1, 2),
                seq(
                    () => async(0.1, 3),
                    () => async(0.1, 4),
                    seq(
                        () => async(0.1, 5),
                        () => async(0.1, 6)
                    )
                )
            )
            let startTime = Date.now()
            return seqs().then((results) => {
                let duration = (Date.now() - startTime) / 1000

                duration.should.be.gt(0.1 * 6)
                async.callCount.should.be.eq(6)
                results.should.be.eqls([1, 2, [3, 4, [5, 6]]])
            })
        })

        it('mix series and parl', function () {
            let mix = seq(
                () => async(0.1, 1),
                () => async(0.1, 2),
                parl(
                    () => async(0.1, 3),
                    () => async(0.1, 4),
                    seq(
                        () => async(0.1, 5),
                        () => async(0.1, 6)
                    )
                )
            )

            let startTime = Date.now()
            return mix().then((results) => {
                let duration = (Date.now() - startTime) / 1000

                duration.should.be.lt(0.5) // 0.5s 内执行完毕
                async.callCount.should.be.eq(6)
                results.should.be.eqls([1, 2, [3, 4, [5, 6]]])
            })
        })
    })
})
