declare namespace CustomLion {
  interface LockedSelection extends HTMLElement {
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
    'fl-lion-locked-selection': CustomLion.LockedSelection;
    'fl-lion-integer-digit-match': CustomLion.IntegerDigitMatch;
  }
}
