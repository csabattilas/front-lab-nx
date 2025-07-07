import * as React from 'react';

// Extend JSX IntrinsicElements with custom elements
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'locked-selection': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        {
          modelValue?: { resolved: boolean; selectedValue: string }[];
          answer?: string;
        },
        HTMLElement
      >;
    }
  }
}
