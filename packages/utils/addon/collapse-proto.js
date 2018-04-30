export default function collapseProto(target) {
  // We must collapse the superclass prototype to make sure that the `actions`
  // object will exist. Since collapsing doesn't generally happen until a class is
  // instantiated, we have to do it manually.
  let superClass = Object.getPrototypeOf(target.constructor);

  if (superClass.hasOwnProperty('proto') && typeof superClass.proto === 'function') {
    superClass.proto();
  }
}
