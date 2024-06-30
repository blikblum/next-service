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
 * @param {(String | Class)[]} [dependencies] Service dependencies
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
 * @param {String | Class} serviceKey Key to the service to be injected. Can be a string or the registered class
 * @returns {(target: any, fieldName: string) => void}
 */
export function inject(
  serviceKey: string | Class
): (target: any, fieldName: string) => void
/**
 * @overload
 * @param {Class} serviceKey Service key
 * @returns {InstanceType<typeof Class>}
 */
export function resolve(serviceKey: Class): InstanceType<typeof Class>
/**
 * @overload
 * @param {String} serviceKey Service key
 * @returns {any}
 */
export function resolve(serviceKey: string): any
/**
 * @typedef {{new (...args: any[]): any}} Class
 */
/**
 * Get the service id from a service key
 * @param {String | Class} serviceKey Service key
 */
export function getServiceId(serviceKey: string | Class): any
import Bottle from 'bottlejs'
