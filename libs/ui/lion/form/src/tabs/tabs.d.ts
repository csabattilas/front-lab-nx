import { LionListbox } from '@lion/ui/listbox.js';
import { LockedSelection } from '@front-lab-nx/lion-form';

export declare class FlTabs extends LionListbox {
  static get properties(): Record<string, unknown>;
  constructor();

  get modelValue(): Array<{ resolved: boolean; selectedValue: string }>;
  set modelValue(value: Array<string>);
  set answer(value: string);
}

declare global {
  interface HTMLElementTagNameMap {
    'locked-selection': LockedSelection;
  }
}
