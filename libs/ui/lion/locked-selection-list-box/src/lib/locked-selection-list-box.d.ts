import { LionListbox } from '@lion/ui/listbox.js';

export declare class LockedSelectionListBox extends LionListbox {
  __lockedIndexes: Set<number>;
  __lastCheckedIndex: number;
  __answer: string;

  static get properties(): Record<string, unknown>;
  constructor();

  get modelValue(): Array<{ resolved: boolean; selectedValue: string }>;
  set modelValue(value: Array<string>);
  set answer(value: string);

  __onModelValueChanged(): void;
  __getLastCheckedIndex(): number;
  __lockFormElement(index: number): void;
  __lockNotSelectedElements(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'locked-selection-list-box': LockedSelectionListBox;
  }
}
