export type Class = {
  new (...args: any[]): any
}
export const registry: Bottle<string>
export const container: Bottle.IContainer<string>
/**
 * Declares the decorated class as a service using the class name as service id
 * @overload
 * @param {Class} Class
 * @returns {any}
 */
export function service(Class: Class): any
/**
 * Declares the decorated class as a service and the dependencies to be injected in constructor
 * @overload
 * @param {String} serviceId Id of the service to be registered
 * @param {(String | Class)[]} [dependencies] Dependencies
 * @returns {(descriptorOrCtor: Class) => any}
 */
export function service(
  serviceId: string,
  dependencies?: (string | Class)[]
): (descriptorOrCtor: Class) => any
/**
 * Inject a service into decorated class field using field name as service key
 * @overload
 * @param {Object} target Target object (class prototype)
 * @param {String} fieldName Field name
 * @returns {void}
 */
export function inject(target: Object, fieldName: string): void
/**
 * Inject a service into decorated class field using a string id or class as service key
 * @overload
 * @param {String | Class} service Service to be injected. Can be a string or the registered class
 * @returns {(target: any, fieldName: string) => void}
 */
export function inject(
  service: string | Class
): (target: any, fieldName: string) => void
/**
 * @typedef {{new (...args: any[]): any}} Class
 */
/**
 * Get the service name
 * @param {String | Class} service Service definition
 */
export function getServiceId(service: string | Class): any
import Bottle from 'bottlejs'
