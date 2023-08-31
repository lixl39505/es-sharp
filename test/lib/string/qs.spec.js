import { qs } from 'string/qs'

describe('url', function () {
    it('empty', function () {
        qs.parse('https://www.baidu.com/').should.deep.equal({})
        qs.parse('https://www.baidu.com/?').should.deep.equal({})
        qs.parse('https://www.baidu.com/s').should.deep.equal({})
        qs.parse('https://www.baidu.com/s?').should.deep.equal({})
        qs.parse('https://www.baidu.com/s#').should.deep.equal({})
        qs.parse('https://www.baidu.com/s#main').should.deep.equal({})
        qs.parse('https://www.baidu.com/s?#main').should.deep.equal({})
    })

    it('normal', function () {
        qs.parse('https://www.baidu.com/s?wd=a&rsv_spt=1').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })

    it('array', function () {
        qs.parse('https://www.baidu.com/s?wd=a&p[]=1&p[]=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })

        qs.parse('https://www.baidu.com/s?wd=a&p=1&p=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })
    })

    it('redundant', function () {
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

describe('string', function () {
    it('empty', function () {
        qs.parse('').should.deep.equal({})
        qs.parse('?').should.deep.equal({})
        qs.parse('/s').should.deep.equal({})
        qs.parse('/s?').should.deep.equal({})
        qs.parse('/s#').should.deep.equal({})
        qs.parse('/s#main').should.deep.equal({})
        qs.parse('/s?#main').should.deep.equal({})
    })

    it('normal', function () {
        qs.parse('/s?wd=a&rsv_spt=1').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })
    })

    it('array', function () {
        qs.parse('/s?wd=a&p[]=1&p[]=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })

        qs.parse('/s?wd=a&p=1&p=2').should.deep.equal({
            wd: 'a',
            p: ['1', '2'],
        })
    })

    it('redundant', function () {
        qs.parse('/s?wd=a&&rsv_spt=1&').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })

        qs.parse('/s?wd=a&&rsv_spt=1&#main').should.deep.equal({
            wd: 'a',
            rsv_spt: '1',
        })

        qs.parse('/s?p=1&p=2&p=3').should.eql({
            p: ['1', '2', '3'],
        })
    })
})

describe('stringify', function () {
    it('empty', function () {
        qs.stringify().should.eq('')
    })

    it('empty objj', function () {
        qs.stringify({}).should.eq('')
    })

    it('params', function () {
        qs.stringify({ a: 1, p: [1, 2] }).should.eq('a=1&p=1&p=2')
        qs.stringify({ a: null }).should.eq('a=')
    })
})
