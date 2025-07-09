export { LockedSelection } from './locked-selection.js';

console.log('hello');

if (!customElements.get('fl-lion-locked-selection')) {
  customElements.define('fl-lion-locked-selection', LockedSelection);
}

export * from './locked-selection.js';
