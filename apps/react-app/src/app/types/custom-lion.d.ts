import * as React from 'react';

// Extend JSX IntrinsicElements with custom elements
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'locked-selection-list-box': React.DetailedHTMLProps<
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
