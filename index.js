const Bottle = require('bottlejs')

const registry = new Bottle()
const container = registry.container

const inject = serviceName => elementDescriptor => {
  const { kind, key, placement, descriptor, finisher } = elementDescriptor
  return {
    kind,
    placement,
    descriptor,
    finisher,
    key,
    initializer() {
      return container[serviceName]
    }
  }
}

const createClass = (BaseClass, serviceName, dependencies) => {
  const Injectable = class extends BaseClass {
    constructor(...args) {
      for (let i = 0; i < dependencies.length; i++) {
        args[i] = container[dependencies[i]]
      }
      super(...args)
    }
  }
  registry.service(serviceName, Injectable)
}

const service = (serviceName, ...dependencies) => {
  return classDescriptor => {
    const { kind, elements } = classDescriptor
    return {
      kind,
      elements,
      finisher(Ctor) {
        createClass(Ctor, serviceName, dependencies)
      }
    }
  }
}

module.exports = { registry, container, service, inject }
