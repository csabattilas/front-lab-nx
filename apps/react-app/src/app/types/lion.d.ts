import * as React from 'react';

// Extend JSX IntrinsicElements with custom elements
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'lion-option': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          choiceValue?: string;
          'aria-selected'?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
