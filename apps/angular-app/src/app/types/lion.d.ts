declare namespace Lion {
  interface LionOption extends HTMLElement {
    value?: string;
    choiceValue?: string;
    'aria-selected'?: boolean;
  }

  interface LionListbox extends HTMLElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue?: any;
    options?: string[];
  }

  interface LionInput extends HTMLElement {
    modelValue?: string;
    name?: string;
    label?: string;
  }

  interface LionCheckboxGroup extends HTMLElement {
    mode?: 'exclusive' | 'toggle';
    modelValue?: string;
  }

  interface LionCheckbox extends HTMLElement {
    choiceValue?: string;
    label?: string;
    checked?: boolean;
  }
}

// Declare the custom elements for Angular
declare global {
  interface HTMLElementTagNameMap {
    'lion-listbox': Lion.LionListbox;
    'lion-option': Lion.LionOption;
    'lion-input': Lion.LionInput;
    'lion-checkbox-group': Lion.LionCheckboxGroup;
    'lion-checkbox': Lion.LionCheckbox;
  }
}
