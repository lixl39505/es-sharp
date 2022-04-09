import qs from 'string/qs'

describe('完整url解析', function () {
    it('空场景', function () {
        qs.parse('https://www.baidu.com/').should.deep.equal({})
        qs.parse('https://www.baidu.com/?').should.deep.equal({})
        qs.parse('https://www.baidu.com/s').should.deep.equal({})
        qs.parse('https://www.baidu.com/s?').should.deep.equal({})
        qs.parse('https://www.baidu.com/s#').should.deep.equal({})
        qs.parse('https://www.baidu.com/s#main').should.deep.equal({})
        qs.parse('https://www.baidu.com/s?#main').should.deep.equal({})
    })

    it('常规场景', function () {
        qs.parse('https://www.baidu.com/s?wd=a&rsv_spt=1').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })

    it('数组参数', function () {
        qs.parse('https://www.baidu.com/s?wd=a&p[]=1&p[]=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })

        qs.parse('https://www.baidu.com/s?wd=a&p=1&p=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })
    })

    it('冗余参数测试', function () {
        qs.parse('https://www.baidu.com/s?wd=a&&rsv_spt=1&').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })

        qs.parse(
            'https://www.baidu.com/s?wd=a&&rsv_spt=1&#main'
        ).should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })
})

describe('字符串解析', function () {
    it('空场景', function () {
        qs.parse('').should.deep.equal({})
        qs.parse('?').should.deep.equal({})
        qs.parse('/s').should.deep.equal({})
        qs.parse('/s?').should.deep.equal({})
        qs.parse('/s#').should.deep.equal({})
        qs.parse('/s#main').should.deep.equal({})
        qs.parse('/s?#main').should.deep.equal({})
    })

    it('常规场景', function () {
        qs.parse('/s?wd=a&rsv_spt=1').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })

    it('数组参数', function () {
        qs.parse('/s?wd=a&p[]=1&p[]=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })

        qs.parse('/s?wd=a&p=1&p=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })
    })

    it('冗余参数测试', function () {
        qs.parse('/s?wd=a&&rsv_spt=1&').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })

        qs.parse('/s?wd=a&&rsv_spt=1&#main').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })
})

describe('序列化测试', function () {
    it('空值', function () {
        qs.stringify().should.eq('')
    })

    it('空对象', function () {
        qs.stringify({}).should.eq('')
    })

    it('参数非空', function () {
        qs.stringify({ a: 1, p: [1, 2] }).should.eq('a=1&p=1&p=2')
    })
})
