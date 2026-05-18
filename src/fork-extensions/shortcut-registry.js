// Registry for fork-added shortcut actions.
//
// Lets fork-only features register themselves at module-load time
// instead of inlining their labels, scopes, handlers, and burst flags
// into config.js / ui.js. The diff against upstream stays small and
// additive: config.js and ui.js read from this registry, but otherwise
// don't carry fork-specific code.
//
// This module deliberately has no imports — it must be safe to load
// before config.js / ui.js evaluate.

const registry = new Map();
const context = {};

export function registerShortcutAction({ key, label, scope, handler, burst = false }) {
  if (!key || typeof handler !== 'function') {
    console.warn('[shortcut-registry] Ignoring invalid registration:', key);
    return;
  }
  registry.set(key, { label, scope: scope || 'VIDEO', handler, burst });
}

export function getRegisteredActions() {
  const out = {};
  for (const [k, v] of registry) out[k] = v.label;
  return out;
}

export function getRegisteredScopes() {
  const out = {};
  for (const [k, v] of registry) out[k] = v.scope;
  return out;
}

export function getRegisteredHandler(key) {
  const entry = registry.get(key);
  return entry ? entry.handler : null;
}

export function isRegisteredBurstAction(key) {
  const entry = registry.get(key);
  return !!(entry && entry.burst);
}

// ui.js calls setContext({ showNotification }) during init so
// registered handlers can surface notifications without importing ui.js
// directly (which would create a circular evaluation order).
export function setContext(values) {
  Object.assign(context, values);
}

export function getContext() {
  return context;
}
