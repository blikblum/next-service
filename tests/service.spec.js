const { service, container, registry } = require('..')
const { expect } = require('chai')

describe('service', () => {
  beforeEach(() => {
    registry.resetProviders()
  })

  it('should register a class with the passed name', () => {
    @service('myService')
    class MyService {}

    expect(container.myService).to.be.instanceOf(MyService)
  })

  it('should use class name when no option is passed', () => {
    @service
    class MyService {}

    expect(container.MyService).to.be.instanceOf(MyService)
  })

  it('should allow to define dependencies', () => {
    @service('otherService')
    class OtherService {}

    @service('myService', ['otherService'])
    class MyService {
      constructor(otherService) {
        this.otherService = otherService
      }
    }

    const myService = container.myService
    expect(myService).to.be.instanceOf(MyService)
    expect(myService.otherService).to.be.instanceOf(OtherService)
  })

  it('should not overwrite constructor arguments when instantiated directly', () => {
    @service('otherService')
    class OtherService {}

    @service('myService', ['otherService'])
    class MyService {
      constructor(otherService) {
        this.otherService = otherService
      }
    }

    class NotRegistered {}

    const myService = new MyService(new NotRegistered())
    expect(myService).to.be.instanceOf(MyService)
    expect(myService.otherService).to.be.instanceOf(NotRegistered)
  })

  it('should allow to define a decorator', () => {
    @service('myService')
    class MyService {
      static decorator(instance) {
        instance.x = 'y'
        return instance
      }
    }

    const myService = container.myService
    expect(myService.x).to.be.equal('y')
  })

  it('should allow to define a factory', () => {
    @service('otherService')
    class OtherService {}

    @service('myService')
    class MyService {
      static factory(container) {
        const instance = new MyService()
        instance.otherService = container.otherService
        return instance
      }
    }

    const myService = container.myService
    expect(myService.otherService).to.be.instanceOf(OtherService)
  })
})
