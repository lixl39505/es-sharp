import {
    each,
    filter,
    map,
    reduce,
    reduceRight,
    groupBy,
    sum,
    pick,
    omit,
    listToTree,
    deepTraverse,
    breadthTraverse,
    setUnion,
    objMatch,
    objMerge,
    getContextByPath,
    getPropByPath,
    setPropByPath,
} from '@/index'

describe('aggregate', function () {
    it('each', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        var arr2 = [],
            obj2 = {}

        each(arr, (v) => arr2.push(v * v))
        arr2.should.eql([1, 4, 9])

        each(obj, (v, k) => (obj2[k] = v + 's'))
        obj2.should.eql({
            name: 'sans',
            age: '22s',
            score: '88s',
        })
    })

    it('filter', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        filter(arr, (v) => v > 2).should.eql([3])
        filter(obj, (v) => (v + '').length > 2).should.eql({
            name: 'san',
        })
    })

    it('map', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        map(arr, (v) => v + 1).should.eql([2, 3, 4])
        map(obj, (v) => v + 's').should.eql(['sans', '22s', '88s'])
    })

    it('reduce', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        reduce(arr, (acc, v) => acc + v).should.eql(6)
        reduce(obj, (acc, v) => acc + v).should.eql('san2288')
        reduce([], (acc, v) => acc + v, 0).should.eql(0)
        Should.Throw(
            () => reduce([], (acc, v) => acc + v),
            'Reduce of empty array with no initial value'
        )
    })

    it('reduceRight', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        reduceRight(arr, (acc, v) => acc - v).should.eql(0)
        reduceRight(obj, (acc, v) => acc + (v + '')).should.eql('8822san')
        reduceRight([], (acc, v) => acc + v, 0).should.eql(0)
        Should.Throw(() => reduceRight([], (acc, v) => acc + v))
    })

    it('groupBy', function () {
        var arr = [1, 2, 3],
            obj = { name: 'san', age: 22, score: 88 }

        groupBy(arr, (v) => v > 1).should.eql({
            false: [1],
            true: [2, 3],
        })
        groupBy(obj, (v) => (v + '').length > 2).should.eql({
            true: ['san'],
            false: [22, 88],
        })
    })

    it('sum', function () {
        var arr = [1, 2, 3]

        Should.equal(sum(arr), 6)
    })

    it('pick', function () {
        var obj = { name: 'san', age: 22, score: 88 }

        pick(obj, 'name', 'age').should.eql({ name: 'san', age: 22 })
        pick(obj, ['name', 'age']).should.eql({ name: 'san', age: 22 })
    })

    it('omit', function () {
        var obj = { name: 'san', age: 22, score: 88 }

        omit(obj, 'name').should.eql({ age: 22, score: 88 })
        omit(obj, ['name', 'age']).should.eql({ score: 88 })
    })
})
