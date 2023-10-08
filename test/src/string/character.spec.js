import { rgb2hex, cjkLength, cjkSlice, cjkWidth } from '@/index'

describe('character', function () {
    it('rgb2hex', function () {
        Should.Throw(() => rgb2hex(1), 'color has to be type of `string`')
        Should.Throw(
            () => rgb2hex('rgbf(10,10,10)'),
            `given color (rgbf(10,10,10)) isn't a valid rgb or rgba color`
        )

        rgb2hex('#123456').should.eql({ hex: '#123456', alpha: 1 })
        rgb2hex('rgb(255,255,255)').should.eql({ hex: '#ffffff', alpha: 1 })
        rgb2hex('rgba(255,255,255, .5)').should.eql({
            hex: '#ffffff',
            alpha: 0.5,
        })
        rgb2hex('rgb(0,0,0)').should.eql({ hex: '#000000', alpha: 1 })
        rgb2hex('rgb(128,128,128)').should.eql({ hex: '#808080', alpha: 1 })
    })

    it('cjkLength', function () {
        Should.Throw(() => cjkLength(123), 'cnLength只接受字符串参数')
        // 西文&数字 算half
        cjkLength('1我是谁a').should.equal(4.08)
    })

    it('cjkSlice', function () {
        Should.Throw(() => cjkSlice(123), 'cjkSlice只接受字符串参数')

        cjkSlice('1a1a1a', 0, 1).should.equal('1a')
        cjkSlice('1a1a1a', 0, 2).should.equal('1a1a')
        cjkSlice('1a1a我是谁', 0, 3).should.equal('1a1a我')

        cjkSlice('1a1a我是谁', 0, -1).should.equal('1a1a我是谁')
        cjkSlice('1a1a我是谁', 0, -2).should.equal('1a1a我是')
    })

    it('cjkWidth', function () {
        cjkWidth('1我是谁a').should.equal(4.08 * 14)
    })
})
