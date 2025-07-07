declare namespace Lion {
  interface LionOption extends HTMLElement {
    value?: string;
    choiceValue?: string;
    'aria-selected'?: boolean;
  }
}

// Declare the custom elements for Angular
declare global {
  interface HTMLElementTagNameMap {
    'lion-option': Lion.LionOption;
  }
}
