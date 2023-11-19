import Bottle from 'bottlejs'

const registry = new Bottle()
const container = registry.container
const serviceMap = new Map()

/**
 * Get the service name
 * @param {String | Function} [service] Service definition
 */
function getServiceId(service) {
  if (typeof service === 'string') return service
  if (serviceMap.has(service)) return serviceMap.get(service)
  return service.name
}

/**
 * Inject a service into decorated class field
 * @param {String | Function} [service] Service to be injected. Can be a string or the registered class
 */
const inject = (serviceOrDescriptor, service) => {
  if (typeof serviceOrDescriptor !== 'object') {
    return function (descriptor) {
      return inject(descriptor, serviceOrDescriptor)
    }
  }

  const { kind, key, placement, descriptor, finisher } = serviceOrDescriptor
  return {
    kind,
    placement,
    descriptor,
    finisher,
    key,
    initializer() {
      return container[getServiceId(service || key)]
    },
  }
}

const createClass = (BaseClass, serviceName, dependencies = []) => {
  const Injectable = class extends BaseClass {
    constructor(...args) {
      for (let i = 0; i < dependencies.length; i++) {
        args[i] = container[getServiceId(dependencies[i])]
      }
      super(...args)
    }
  }
  serviceMap.set(BaseClass, serviceName)
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
const service = (serviceOrDescriptor, serviceOrDependencies, dependencies) => {
  if (typeof serviceOrDescriptor === 'string') {
    return function (descriptor) {
      return service(descriptor, serviceOrDescriptor, serviceOrDependencies)
    }
  }

  const { kind, elements } = serviceOrDescriptor
  return {
    kind,
    elements,
    finisher(Ctor) {
      createClass(Ctor, serviceOrDependencies || Ctor.name, dependencies)
    },
  }
}

export { registry, container, service, inject, getServiceId }
