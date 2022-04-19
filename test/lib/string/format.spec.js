import { currency, capitalize } from '@/index'

describe('format', function () {
    it('currency', function () {
        currency(123).should.equal('123.00')
        currency(1234567).should.equal('1,234,567.00')
        currency(1234567, 0).should.equal('1,234,567')

        currency('').should.equal('0.00')
        currency('1234567').should.equal('1,234,567.00')
    })

    it('capitalize', function () {
        capitalize('').should.equal('')
        capitalize('china').should.equal('China')
    })
})
