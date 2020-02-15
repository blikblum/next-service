# next-service

Dependency injection using JavasScript decorators. Built on top of [bottlejs](https://github.com/young-steveo/bottlejs)

### Usage

Define a service:

```js
import { service } from 'next-service'

@service('myService')
class MyService {
  saveTheWorld() {}
}
```

Consume a service using `inject`...

```js
import { inject } from 'next-service'

// using inject without parameter (the field name is used to)
class MyClass {
  @inject
  myService

  doIt() {
    this.myService.saveTheWorld()
  }
}

// or

// using inject with a service name parameter
class MyClass {
  @inject('myService')
  savior

  doIt() {
    this.savior.saveTheWorld()
  }
}
```

... or as a dependency of another service:

```js
import { service } from 'next-service'

@service('consumerService', 'myService')
class ConsumerService {
  constructor(myService) {
    this.myService = myService
  }

  doIt() {
    this.myService.saveTheWorld()
  }
}
```

#### Bottlejs API

Its possible to use also the [Bottlejs](https://github.com/young-steveo/bottlejs) API

A Bottle instance called `registry` and its `container` are exported:

```js
import { registry, container } from 'next-service'

// register a service manually:
registry.service('myService', MyService)

// retrieve a service manually
const myService = container.myService

// add a default decorator
registry.decorator(function(service) {
  // do something with all services
  doSomething(service)
  return service
})
```

### License

MIT
Copyright © 2019 Luiz Américo
