import Bottle from 'bottlejs'

const registry = new Bottle()
const container = registry.container

/**
 * Inject a service into decorated class field
 * @param {String} [service] Service name to be injected
 */
const inject = (serviceNameOrDescriptor, serviceName) => {
  if (typeof serviceNameOrDescriptor === 'string') {
    return function (descriptor) {
      return inject(descriptor, serviceNameOrDescriptor)
    }
  }

  const { kind, key, placement, descriptor, finisher } = serviceNameOrDescriptor
  return {
    kind,
    placement,
    descriptor,
    finisher,
    key,
    initializer() {
      return container[serviceName || key]
    },
  }
}

const createClass = (BaseClass, serviceName, dependencies = []) => {
  const Injectable = class extends BaseClass {
    constructor(...args) {
      for (let i = 0; i < dependencies.length; i++) {
        args[i] = container[dependencies[i]]
      }
      super(...args)
    }
  }
  Object.defineProperty(Injectable, 'name', {
    value: BaseClass.name,
    configurable: true,
  })
  registry.service(serviceName, Injectable)
  if (typeof BaseClass.decorator === 'function') {
    registry.decorator(serviceName, BaseClass.decorator)
  }
  if (typeof BaseClass.factory === 'function') {
    registry.factory(serviceName, BaseClass.factory)
  }
}

/**
 * Declares the decorated class as a service and the dependencies to be injected in constructor
 * @param {String} [service] Service name
 * @param {String[]} [dependencies] Dependencies
 */
const service = (
  serviceNameOrDescriptor,
  serviceNameOrDependencies,
  dependencies
) => {
  if (typeof serviceNameOrDescriptor === 'string') {
    return function (descriptor) {
      return service(
        descriptor,
        serviceNameOrDescriptor,
        serviceNameOrDependencies
      )
    }
  }

  const { kind, elements } = serviceNameOrDescriptor
  return {
    kind,
    elements,
    finisher(Ctor) {
      createClass(Ctor, serviceNameOrDependencies || Ctor.name, dependencies)
    },
  }
}

export { registry, container, service, inject }
