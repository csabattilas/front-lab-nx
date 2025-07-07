import { LockedSelection } from './locked-selection.js';

if (!customElements.get('fl-lion-locked-selection')) {
  customElements.define('fl-lion-locked-selection', LockedSelection);
}

export { LockedSelection };
