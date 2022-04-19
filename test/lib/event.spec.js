import { Event } from '@/index'
import sinon from 'sinon'

describe('Event', function () {
    it('events', function () {
        let bus = new Event(),
            handle1 = sinon.fake(),
            handle2 = sinon.fake(),
            handle3 = sinon.fake()

        // add
        bus.$on('click', handle1)
        bus.$once('click', handle2)
        // 1nd
        bus.$emit('click', 1, 'a')
        handle1.callCount.should.be.equal(1)
        handle1.args[0].should.eql([1, 'a'])
        handle2.callCount.should.be.equal(1)
        handle2.args[0].should.eql([1, 'a'])
        // add & 2nd
        bus.$on('click', handle3)
        bus.$emit('click', 2, 'b')
        handle1.callCount.should.be.equal(2)
        handle1.args[1].should.eql([2, 'b'])
        handle2.callCount.should.be.equal(1)
        handle3.callCount.should.be.equal(1)
        handle3.args[0].should.eql([2, 'b'])
        // rm
        bus.$off('click', handle1)
        bus.$emit('click', 3, 'c')
        handle1.callCount.should.be.equal(2)
        handle2.callCount.should.be.equal(1)
        handle3.callCount.should.be.equal(2)
        handle3.args[1].should.eql([3, 'c'])
        // rm all
        bus.$off('click')
        bus.$emit('click', 4, 'd')
        handle1.callCount.should.be.equal(2)
        handle2.callCount.should.be.equal(1)
        handle3.callCount.should.be.equal(2)
    })
})
