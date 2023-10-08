import { currency, capitalize, camelcase, dashify, pascalcase } from '@/index'

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

    it('camelcase', function () {
        camelcase('').should.equal('')
        // normal
        camelcase('  Hello World  ').should.equal('helloWorld')
        camelcase('hi-Sam').should.equal('hiSam')
        camelcase('A-B C').should.equal('aBC')
        // 合并连字符
        camelcase('to--do').should.equal('toDo')
        // 移除首尾连字符
        camelcase('--turn--left').should.equal('turnLeft')
        camelcase('Right--').should.equal('right')
        // 支持多种连字符
        camelcase('his name is world_peace', '_').should.equal(
            'hisNameIsWorldPeace'
        )
        camelcase('E-O-F indicates the end-of-the-file', [
            '-',
            '_',
        ]).should.equal('eOFIndicatesTheEndOfTheFile')
    })

    it('dashify', function () {
        dashify('').should.equal('')
        // normal
        dashify('HelloWorld').should.equal('hello-world')
        dashify('HiSam').should.equal('hi-sam')
        dashify('ABC').should.equal('a-b-c')
        // 支持多种连字符
        dashify('his Name is WorldPeace', '_').should.equal(
            'his_name_is_world_peace'
        )
    })

    it('pascalcase', function () {
        pascalcase('').should.equal('')
        // normal
        pascalcase('  Hello World  ').should.equal('HelloWorld')
        pascalcase('hi-Sam').should.equal('HiSam')
        pascalcase('A-B C').should.equal('ABC')
        // 合并连字符
        pascalcase('to--do').should.equal('ToDo')
        // 移除首尾连字符
        pascalcase('--turn--left').should.equal('TurnLeft')
        pascalcase('Right--').should.equal('Right')
        // 支持多种连字符
        pascalcase('his name is world_peace', '_').should.equal(
            'HisNameIsWorldPeace'
        )
        pascalcase('E-O-F indicates the end-of-the-file', [
            '-',
            '_',
        ]).should.equal('EOFIndicatesTheEndOfTheFile')
    })
})
