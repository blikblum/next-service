import Bottle from 'bottlejs'

const registry = new Bottle()
const container = registry.container
const serviceMap = new Map()

/**
 * @typedef {{new (...args: any[]): any}} Class
 */

/**
 * Get the service name
 * @param {String | Class} service Service definition
 */
function getServiceId(service) {
  if (typeof service === 'string') return service
  if (serviceMap.has(service)) return serviceMap.get(service)
  return service.name
}

/**
 * Inject a service into decorated class field using field name as service key
 * @overload
 * @param {Object} target Target object (class prototype)
 * @param {String} fieldName Field name
 * @returns {void}
 */

/**
 * Inject a service into decorated class field using a string id or class as service key
 * @overload
 * @param {String | Class} service Service to be injected. Can be a string or the registered class
 * @returns {(target: any, fieldName: string) => void}
 */
function inject(serviceOrProtoOrDescriptor, fieldName, service) {
  const isLegacy = typeof fieldName === 'string'
  if (!isLegacy && typeof serviceOrProtoOrDescriptor.kind !== 'string') {
    return function (protoOrDescriptor, realFieldName) {
      return inject(
        protoOrDescriptor,
        realFieldName,
        serviceOrProtoOrDescriptor
      )
    }
  }

  if (!isLegacy) {
    const { kind, key, placement, descriptor, finisher } =
      serviceOrProtoOrDescriptor
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

  serviceOrProtoOrDescriptor[fieldName] =
    container[getServiceId(service || fieldName)]
}

function createClass(BaseClass, serviceName, dependencies = []) {
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
 * Declares the decorated class as a service using the class name as service id
 * @overload
 * @param {Class} Class
 * @returns {any}
 */

/**
 * Declares the decorated class as a service and the dependencies to be injected in constructor
 * @overload
 * @param {String} serviceId Id of the service to be registered
 * @param {(String | Class)[]} [dependencies] Dependencies
 * @returns {(descriptorOrCtor: Class) => any}
 */
function service(
  serviceOrDescriptorOrCtor,
  serviceOrDependencies,
  dependencies
) {
  if (typeof serviceOrDescriptorOrCtor === 'string') {
    return function (descriptorOrCtor) {
      return service(
        descriptorOrCtor,
        serviceOrDescriptorOrCtor,
        serviceOrDependencies
      )
    }
  }

  const isLegacy = typeof serviceOrDescriptorOrCtor === 'function'

  if (!isLegacy) {
    const { kind, elements } = serviceOrDescriptorOrCtor
    return {
      kind,
      elements,
      finisher(Ctor) {
        createClass(Ctor, serviceOrDependencies || Ctor.name, dependencies)
      },
    }
  }

  createClass(
    serviceOrDescriptorOrCtor,
    serviceOrDependencies || serviceOrDescriptorOrCtor.name,
    dependencies
  )
}

export { registry, container, service, inject, getServiceId }
