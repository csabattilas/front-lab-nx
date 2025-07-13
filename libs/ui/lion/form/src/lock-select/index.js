export { LockSelect } from './lock-select.js';

if (!customElements.get('fl-lion-lock-select')) {
  customElements.define('fl-lion-lock-select', LockSelect);
}

export * from './lock-select.js';
