import { type, isPojo, isNumber, deepCopy, hashCode } from '@/index'

describe('base', function () {
    it('type', function () {
        // primitive
        type(null).should.be.equal('null')
        type(undefined).should.be.equal('undefined')
        type(1).should.be.equal('number')
        type(true).should.be.equal('boolean')
        type('s').should.be.equal('string')
        type(Symbol()).should.be.equal('symbol')
        // obj
        type({}).should.be.equal('object')
        type([]).should.be.equal('array')
        type(() => {}).should.be.equal('function')
        // internal
        type(new Error()).should.be.equal('error')
        type(/reg/).should.be.equal('regexp')
        type(new Date()).should.be.equal('date')
        // todo [[class]]
    })
    it('isPojo', function () {
        isPojo({}).should.be.equal(true)
        isPojo([]).should.be.equal(false)
        isPojo(null).should.be.equal(false)
        isPojo(new Date()).should.be.equal(false)
    })
    it('isNumber', function () {
        isNumber(1).should.be.equal(true)
        isNumber(Infinity).should.be.equal(false)
        isNumber('abc').should.be.equal(false)
        isNumber('123abc').should.be.equal(false)
        isNumber('123').should.be.equal(true)
        isNumber('    123    ').should.be.equal(true)
    })
    it('deepCopy', function () {
        var dd = new Date()

        // 非纯对象不复制
        deepCopy(dd).should.equal(dd)

        // depth 限制
        deepCopy(
            {
                o1: {
                    // lv1
                    o2: {
                        // lv2
                        n1: 1, // lv3
                    },
                },
                a1: [
                    // lv1
                    1, // lv2
                    [
                        2, // lv3
                    ],
                ],
            },
            {
                depth: 1,
            }
        ).should.eql({ o1: {}, a1: [] })

        // exclude
        deepCopy(
            {
                s1: '1',
                s2: '1',
                s3: '1',
                o1: {
                    s1: '2',
                    s2: '2',
                    s3: '2',
                },
            },
            {
                exclude: ['s1', 's3'],
            }
        ).should.eql({
            s2: '1',
            o1: {
                s2: '2',
            },
        })
    })
    it('hashCode', function () {
        var s = 'abcdefghijklmn!@#$%^&*()_+[];:,.<>/?\\123456789'

        hashCode(s).should.equal(hashCode(s))
        hashCode(s).should.not.equal(hashCode(s + '.'))
    })
})
