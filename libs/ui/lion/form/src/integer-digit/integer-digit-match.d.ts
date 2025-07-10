import { LionInput } from '@lion/ui/input.js';
import { MultiInputMixin } from './multi-input-mixin.js';

export declare class IntegerDigitMatch extends MultiInputMixin(LionInput) {
  static get properties(): Record<string, unknown>;
  constructor();

  get modelValue(): string;
  set modelValue(value: string);
  set target(value: string);
}

declare global {
  interface HTMLElementTagNameMap {
    'integer-digit-match': IntegerDigitMatch;
  }
}
