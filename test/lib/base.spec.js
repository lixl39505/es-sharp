import { objMerge } from '@/index'

describe('objMerge', function () {
    it('obj to obj', function () {
        var to = {
                n: 123,
                s: 'abc',
                b: true,
                o: {
                    n: 1,
                },
            },
            from = {
                n: 666,
                // s: 'abc',
                // b: true,
                b2: true,
                o: {
                    // n: 1,
                    s: 'xyz',
                    b: false,
                },
            }

        // 合并
        var res = objMerge(to, from)

        res.should.be.deep.equal({
            n: 666,
            s: 'abc',
            b: true,
            b2: true,
            o: {
                n: 1,
                s: 'xyz',
                b: false,
            },
        })

        // 不变性
        res.n = 999
        res.o.n = 888

        to.should.be.deep.equal({
            n: 123,
            s: 'abc',
            b: true,
            o: {
                n: 1,
            },
        })

        from.should.be.deep.equal({
            n: 666,
            // s: 'abc',
            // b: true,
            b2: true,
            o: {
                // n: 1,
                s: 'xyz',
                b: false,
            },
        })
    })

    it('arr to arr', function () {
        var to = [1, 2],
            from = [
                [1, 2],
                {
                    n: 1,
                    s: 'a',
                },
            ]

        // 合并
        var res = objMerge(to, from)

        res.should.be.deep.equal([
            1,
            2,
            [1, 2],
            {
                n: 1,
                s: 'a',
            },
        ])

        // 不变性
        res[2][0] = 3
        res[3].n = 888

        to.should.deep.equal([1, 2])
        from.should.deep.equal([
            [1, 2],
            {
                n: 1,
                s: 'a',
            },
        ])
    })

    it('values', function () {
        objMerge(null, 1).should.equal(1)
        objMerge(null, 'a').should.equal('a')
        objMerge(null, true).should.equal(true)
        Should.equal(objMerge(null, null), null)
        Should.equal(objMerge(null, undefined), undefined)
        objMerge(null, NaN).should.be.NaN
        objMerge(undefined, { s: 'a' }).should.be.deep.equal({ s: 'a' })
    })
})
