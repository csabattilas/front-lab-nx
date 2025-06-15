import * as React from 'react';

// Extend JSX IntrinsicElements with custom elements
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'lion-listbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        modelValue & {
          options?: string[];
        },
        HTMLElement
      >;
      'lion-option': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          choiceValue?: string;
          'aria-selected'?: boolean;
        },
        HTMLElement
      >;
      'lion-input': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          modelValue?: string;
          name?: string;
          onChange?: React.FormEventHandler<HTMLElement>;
          label?: string;
          'onModel-value-changed'?: (e: Event) => void;
        },
        HTMLElement
      >;
      'lion-checkbox-group': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          mode?: 'toggle' | 'exclusive';
          modelValue?: string;
          'onModel-value-changed'?: (e: Event) => void;
        },
        HTMLElement
      >;

      'lion-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          choiceValue?: string;
          label?: string;
          checked?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
