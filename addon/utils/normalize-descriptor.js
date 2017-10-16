/**
 * Normalizes property descriptor values.
 *
 * By default, the current babel class fields transform does not provide
 * `writable` or `configurable` property values on descriptors. Instead, it
 * checks to see if a value or initializer exists on the descriptor and if
 * so makes the property writable. This is an issue with class fields
 * that do not provide a default value or provide a falsy default value,
 * since the initializer will just be the value, and writable will then
 * default to false.
 *
 * This function normalizes the descriptor, making it writable/configurable
 * by default if it hasn't already been provided (by another decorator, for
 * instance).
 *
 * @param {PropertyDescriptor} desc
 */
export default function normalizeDescriptor(desc) {
  desc.writable = 'writable' in desc ? desc.writable : true;
  desc.configurable = 'configurable' in desc ? desc.configurable : true;
  desc.enumerable = 'enumerable' in desc ? desc.enumerable : true;
}
