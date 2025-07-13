import { LionListbox } from '@lion/ui/listbox.js';

export declare class LockedSelection extends LionListbox {
  static get properties(): Record<string, unknown>;
  constructor();

  get modelValue(): Array<{ resolved: boolean; selectedValue: string }>;
  set modelValue(value: Array<string>);
  set answer(value: string);
}

declare global {
  interface HTMLElementTagNameMap {
    'lock-select': LockedSelection;
  }
}
