export { FlTabs } from './tabs.js';

if (!customElements.get('fl-lion-tabs')) {
  customElements.define('fl-lion-tabs', FlTabs);
}

export * from './tabs.js';
