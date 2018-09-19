const MODIFIER_META_MAP = new WeakMap();

export function getModifierMeta(target) {
  return MODIFIER_META_MAP.get(target);
}

export function getOrCreateModifierMeta(target) {
  if (!MODIFIER_META_MAP.has(target)) {
    MODIFIER_META_MAP.set(target, {});
  }

  return MODIFIER_META_MAP.get(target);
}
