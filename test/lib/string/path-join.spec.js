import pathJoin from 'string/path-join'

describe('path-join', function () {
    it('empty', function () {
        pathJoin().should.equal('.')
        pathJoin('').should.equal('.')

        Should.Throw(
            () => pathJoin('', 2),
            'The "pathJoin" argument must be of type string'
        )
    })

    it('absolute path', function () {
        // concat
        pathJoin('/a', '/b', '/c').should.equal('/a/b/c')
        pathJoin('/a', 'b', '/c').should.equal('/a/b/c')
        pathJoin('/a', 'b', 'c').should.equal('/a/b/c')
        // back stack
        pathJoin('/a', 'b', '.').should.equal('/a/b')
        pathJoin('/a', 'b', './').should.equal('/a/b/')
        pathJoin('/a', 'b', '..').should.equal('/a')
        pathJoin('/a', 'b', '../').should.equal('/a/')
        // above root
        pathJoin('/a', '../', 'c').should.equal('/c')
        pathJoin('/a', '../', '../').should.equal('/')
        // trail '/'
        pathJoin('/a', '/b', '/c/').should.equal('/a/b/c/')
        pathJoin('/a/', 'b', '..').should.equal('/a')
        pathJoin('/a/').should.equal('/a/')
    })

    it('relative path', function () {
        pathJoin('a', 'b', 'c').should.equal('a/b/c')
        pathJoin('a', '../', 'c').should.equal('c')
        pathJoin('a', 'b', '..').should.equal('a')
        pathJoin('a', 'b', '../').should.equal('a/')
        pathJoin('a', '../', '../').should.equal('../')
        pathJoin('a', '../', '..').should.equal('..')
        pathJoin('a', '../', '../', '..').should.equal('../..')
        pathJoin('a', '../', '../', '../').should.equal('../../')
    })

    it('backward slash', function () {
        pathJoin('\\a', '\\b', '\\c').should.equal('/a/b/c')
        pathJoin('\\a', '\\b', '.').should.equal('/a/b')
        pathJoin('\\a', '../', '\\c').should.equal('/c')
        pathJoin('\\a/', '\\b', '..').should.equal('/a')
        pathJoin('a', '\\b', '..').should.equal('a')
        pathJoin('a', '\\b', '..').should.equal('a')
        pathJoin('a', '..\\', '..').should.equal('..')
    })

    it('UNC path', function () {
        pathJoin('//www.baidu.com', '#zh').should.equal('/www.baidu.com/#zh')
        pathJoin('///www.baidu.com', '#zh').should.equal('/www.baidu.com/#zh')
        pathJoin('////www.baidu.com', '#zh').should.equal('/www.baidu.com/#zh')
    })
})
