declare namespace CustomLion {
  interface LockedSelectionListBox extends HTMLElement {
    modelValue?: { resolved: boolean; selectedValue: string }[];
    answer?: string;
    onmodelValueChanged?: (event: CustomEvent) => void;
  }
}

// Declare the custom elements for Angular
declare global {
  interface HTMLElementTagNameMap {
    'locked-selection-list-box': CustomLion.LockedSelectionListBox;
    'fl-lion-locked-selection-list-box': CustomLion.LockedSelectionListBox;
    'fl-lion-option': Lion.LionOption;
  }
}
