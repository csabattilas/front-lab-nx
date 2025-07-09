import { LionInput } from '@lion/ui/input.js';
import { MultiInputMixin } from './multi-input-mixin.js';

export declare class IntegerDigitMatch extends MultiInputMixin(LionInput) {
  static get properties(): Record<string, unknown>;
  constructor();

  get modelValue(): Array<{ resolved: boolean; selectedValue: string }>;
  set modelValue(value: Array<string>);
  set target(value: string);
}

declare global {
  interface HTMLElementTagNameMap {
    'integer-digit-match': IntegerDigitMatch;
  }
}
