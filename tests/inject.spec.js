import { service, inject, container, registry } from '..'
import { expect } from 'chai'

describe('inject', () => {
  beforeEach(() => {
    registry.resetProviders()
  })

  it('should instantiate the service registered with the key parameter', () => {
    @service('otherService')
    class OtherService {}

    @service('myService')
    class MyService {
      @inject('otherService')
      otherService
    }

    expect(container.myService.otherService).to.be.instanceOf(OtherService)
  })

  it('should allow to use service class as key', () => {
    @service('otherService')
    class OtherService {}

    @service('myService')
    class MyService {
      @inject(OtherService)
      otherService
    }

    expect(container.myService.otherService).to.be.instanceOf(OtherService)
  })

  it('should use field name when service name not defined', () => {
    @service('otherService')
    class OtherService {}

    @service('myService')
    class MyService {
      @inject
      otherService
    }

    expect(container.myService.otherService).to.be.instanceOf(OtherService)
  })

  it('should allow to overwrite injected value', () => {
    @service('otherService')
    class OtherService {}

    @service('myService')
    class MyService {
      @inject('otherService')
      otherService
    }

    class NotRegistered {}

    const myService = container.myService
    myService.otherService = new NotRegistered()

    expect(myService.otherService).to.be.instanceOf(NotRegistered)
  })
})
