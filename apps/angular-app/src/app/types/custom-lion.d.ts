declare namespace CustomLion {
  interface LockSelect extends HTMLElement {
    modelValue?: { resolved: boolean; selectedValue: string }[];
    answer?: string;
    onmodelValueChanged?: (event: CustomEvent) => void;
  }

  interface IntegerDigitMatch extends HTMLElement {
    modelValue?: { resolved: boolean; selectedValue: string }[];
    answer?: string;
    target?: string;
    onmodelValueChanged?: (event: CustomEvent) => void;
  }
}

// Declare the custom elements for Angular
declare global {
  interface HTMLElementTagNameMap {
    'fl-lion-lock-select': CustomLion.LockSelect;
    'fl-lion-integer-digit-match': CustomLion.IntegerDigitMatch;
  }
}
