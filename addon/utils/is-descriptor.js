export default function isDescriptor(item) {
  return item &&
    typeof item === 'object' &&
    'enumerable' in item &&
    'configurable' in item;
}
