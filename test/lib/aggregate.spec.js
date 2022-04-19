import {
    each,
    filter,
    map,
    mapObj,
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
import sinon from 'sinon'

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

    it('mapObj', function () {
        mapObj(
            {
                name: 'san',
                age: 22,
                score: 88,
            },
            (v, k) => v + v
        ).should.eql({
            name: 'san' + 'san',
            age: 22 + 22,
            score: 88 + 88,
        })
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
        groupBy([1, 2, 3], (v) => v > 1).should.eql({
            false: [1],
            true: [2, 3],
        })
        groupBy(
            { name: 'san', age: 22, score: 88 },
            (v) => (v + '').length > 2
        ).should.eql({
            true: ['san'],
            false: [22, 88],
        })
        groupBy(
            [
                { name: 'li', age: 10, sex: 'male' },
                { name: 'zh', age: 12, sex: 'male' },
                { name: 'wang', age: 13, sex: 'female' },
            ],
            'sex'
        ).should.eql({
            male: [
                { name: 'li', age: 10, sex: 'male' },
                { name: 'zh', age: 12, sex: 'male' },
            ],
            female: [{ name: 'wang', age: 13, sex: 'female' }],
        })
    })

    it('sum', function () {
        var arr = [1, 2, 3]

        sum(arr).should.equal(6)
        sum(arr, (v) => v * v).should.equal(14)
        sum([{ age: 1 }, { age: 2 }, { age: 3 }], 'age').should.equal(6)
    })

    it('pick', function () {
        var obj = { name: 'san', age: 22, score: 88 }

        pick(obj, 'name', 'age').should.eql({ name: 'san', age: 22 })
        pick(obj, ['name', 'age']).should.eql({ name: 'san', age: 22 })
        pick(obj, (v, k) => k.length > 3).should.eql({ name: 'san', score: 88 })
    })

    it('omit', function () {
        var obj = { name: 'san', age: 22, score: 88 }

        omit(obj, 'name').should.eql({ age: 22, score: 88 })
        omit(obj, ['name', 'age']).should.eql({ score: 88 })
        omit(obj, (v, k) => k.length > 3).should.eql({ age: 22 })
    })

    it('setUnion', function () {
        setUnion([1, 2], [1, 3, 4]).should.eql([1, 2, 3, 4])
    })

    it('objMatch', function () {
        objMatch(1, '1').should.equal(false)
        objMatch(1, true).should.equal(false)
        objMatch(1, 1).should.equal(true)
        objMatch('a', 'a').should.equal(true)

        objMatch({}, 1).should.equal(false)
        objMatch({}, true).should.equal(false)
        objMatch([], 1).should.equal(false)
        objMatch([], true).should.equal(false)
        objMatch([], {}).should.equal(false)
        objMatch({}, {}).should.equal(true)
        objMatch([], []).should.equal(true)

        objMatch({}, { s: 1 }).should.equal(false)
        objMatch({ s: 1 }, { s: 2 }).should.equal(false)
        objMatch([], [[]]).should.equal(false)
        objMatch([], [{}]).should.equal(false)
        objMatch([1], [2]).should.equal(false)
        objMatch([1], [1, 1]).should.equal(false)

        // 忽略prototype

        let o1 = Object.create({
                s: 1,
            }),
            o2 = Object.create({
                s: 2,
            })
        objMatch(o1, o2).should.equal(true)

        // 忽略不可枚举属性
        o1 = {}
        o2 = Object.create(null, {
            foo: {
                enumerable: false,
                value: 'foo',
            },
        })
        objMatch(o1, o2).should.equal(true)
    })

    it('objMerge', function () {
        var to = {
                n: 123,
                s: 'abc',
                b: true,
                o: {
                    n: 1,
                },
                a: [1, 2],
            },
            from = {
                n: 666,
                b2: true,
                o: {
                    s: 'xyz',
                },
                a: [3, 4],
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
            },
            a: [1, 2, 3, 4],
        })

        // 不变性
        res.o.n = 888
        res.a[0] = 5

        to.should.be.deep.include({
            o: {
                n: 1,
            },
            a: [1, 2],
        })

        from.should.be.deep.include({
            o: {
                s: 'xyz',
            },
            a: [3, 4],
        })

        // 边界场景
        objMerge(null, 1).should.equal(1)
        objMerge(null, 'a').should.equal('a')
        objMerge(null, true).should.equal(true)
        Should.equal(objMerge(null, null), null)
        Should.equal(objMerge(null, undefined), undefined)
        objMerge(null, NaN).should.be.NaN
        objMerge(undefined, { s: 'a' }).should.be.deep.equal({ s: 'a' })
    })

    it('getPropByPath', function () {
        var obj = {
            o1: {
                a1: [
                    {
                        name: 'li',
                    },
                ],
            },
        }
        Should.Throw(
            () => getContextByPath(obj),
            '[warn]: please transfer a valid prop path to obj!'
        )
        Should.Throw(
            () => getContextByPath(obj, 'o2.a1'),
            '[warn]: please transfer a valid prop path to obj!'
        )
        getContextByPath(obj, 'o1.a1[0].name').should.eql({
            o: {
                name: 'li',
            },
            k: 'name',
            a: ['o1', 'a1', '0', 'name'],
        })
        getPropByPath(obj, 'o1.a1[0].name').should.eql({
            o: {
                name: 'li',
            },
            k: 'name',
            a: ['o1', 'a1', '0', 'name'],
            v: 'li',
        })
    })

    it('setPropByPath', function () {
        var obj = {
            o1: {
                a1: [
                    {
                        name: 'li',
                    },
                ],
            },
        }
        setPropByPath(obj, 'o1.a1[0].name', 'zhang').should.eql({
            o: {
                name: 'zhang',
            },
            k: 'name',
            a: ['o1', 'a1', '0', 'name'],
            v: 'zhang',
            p: 'li',
        })
    })

    it('listToTree', function () {
        listToTree(
            [
                { id: '1', title: '中国' },
                { id: '1-1', pid: '1', title: '湖北' },
                { id: '1-1-1', pid: '1-1', title: '武汉' },
                { id: '1-1-2', pid: '1-1', title: '黄冈' },
            ],
            {
                pId: 'pid',
                done(tree, map, list) {
                    tree.should.eql([
                        {
                            id: '1',
                            title: '中国',
                            level: 1,
                            isTop: true,
                            isEnd: false,
                            children: [
                                {
                                    id: '1-1',
                                    pid: '1',
                                    title: '湖北',
                                    level: 2,
                                    isTop: false,
                                    isEnd: false,
                                    children: [
                                        {
                                            id: '1-1-1',
                                            pid: '1-1',
                                            level: 3,
                                            title: '武汉',
                                            isTop: false,
                                            isEnd: true,
                                            children: [],
                                        },
                                        {
                                            id: '1-1-2',
                                            pid: '1-1',
                                            level: 3,
                                            title: '黄冈',
                                            isTop: false,
                                            isEnd: true,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ])
                },
            }
        )
    })

    it('deepTraverse', function () {
        let tree = {
                id: '1',
                title: '中国',
                children: [
                    {
                        id: '1-1',
                        pid: '1',
                        title: '湖北',
                        children: [
                            {
                                id: '1-1-1',
                                pid: '1-1',
                                title: '武汉',
                            },
                        ],
                    },
                ],
            },
            cb = sinon.fake()

        deepTraverse(tree, cb)

        // first node
        cb.firstCall.firstArg.id.should.equal('1')
        Should.not.exist(cb.firstCall.args[1])
        // second node
        cb.secondCall.firstArg.id.should.equal('1-1')
        cb.secondCall.args[1].id.should.equal('1')
        // third node
        cb.thirdCall.firstArg.id.should.equal('1-1-1')
        cb.thirdCall.args[1].id.should.equal('1-1')

        let stop = sinon.fake.returns(false)
        deepTraverse(tree, stop)
        stop.calledOnce.should.be.equal(true)
    })

    it('breadthTraverse', function () {
        let tree = [
                {
                    id: '1',
                    title: '中国',
                    children: [
                        {
                            id: '1-1',
                            pid: '1',
                            title: '湖北',
                        },
                    ],
                },
                {
                    id: '2',
                    title: '美国',
                    children: [
                        {
                            id: '2-1',
                            pid: '2',
                            title: '德克萨斯州',
                        },
                    ],
                },
            ],
            cb = sinon.fake()

        breadthTraverse(tree, cb)

        cb.getCall(0).firstArg.title.should.equal('中国')
        cb.getCall(1).firstArg.title.should.equal('美国')
        cb.getCall(2).firstArg.title.should.equal('湖北')
        cb.getCall(3).firstArg.title.should.equal('德克萨斯州')

        let stop = sinon.fake.returns(false)
        breadthTraverse(tree, stop)
        stop.calledOnce.should.be.equal(true)
    })
})
