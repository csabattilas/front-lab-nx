# Lion/lit element based form controls

This library provides custom form controls based on Lion UI components. These components are designed to be used in Angular, React, or any other web application.

## Installation

This component is part of the front-lab-nx monorepo. To use it in your project:

```sh
npm install
```

## Components

### 1. Locked Selection (`fl-lion-locked-selection`)

A custom web component extending Lion's `LionListbox` that implements locked selection functionality, similar to a quiz or test interface. Once an option is selected, it becomes locked, preventing further changes.

#### Features

- Extends the Lion UI listbox component
- Locks options after selection
- Validates answers against a correct answer
- Provides resolved state for each selection
- Supports both vertical and horizontal layouts
- Visually indicates correct answers

#### Usage

##### Angular

```typescript
// In your component TS file
import '@front-lab-nx/lion-form/locked-selection';
import '@lion/ui/define/lion-option.js';

@Component({
  selector: 'app-quiz',
  template: `
    <fl-lion-locked-selection
      #listbox
      (model-value-changed)="onChange()"
      answer="33"
      [direction]="'horizontal'"
    >
      <lion-option [choiceValue]="'32'">32</lion-option>
      <lion-option [choiceValue]="'33'">33</lion-option>
      <lion-option [choiceValue]="'34'">34</lion-option>
    </fl-lion-locked-selection>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuizComponent {
  @ViewChild('listbox') listboxRef!: ElementRef;

  onChange(): void {
    const modelValue = this.listboxRef.nativeElement.modelValue;
    console.log(modelValue); // [{resolved: true|false, selectedValue: string}]
  }
}
```

##### React

```tsx
import React, { useRef, useEffect } from 'react';
import '@front-lab-nx/lion-form/locked-selection';
import '@lion/ui/define/lion-option.js';

const QuizComponent = () => {
  const listboxRef = useRef(null);

  const handleChange = () => {
    console.log(listboxRef.current?.modelValue);
  };

  return (
    <fl-lion-locked-selection
      ref={listboxRef}
      answer="33"
      onmodel-value-changed={handleChange}
    >
      <lion-option choiceValue="32">32</lion-option>
      <lion-option choiceValue="33">33</lion-option>
      <lion-option choiceValue="34">34</lion-option>
    </fl-lion-locked-selection>
  );
};
```

#### API

##### Properties

| Property     | Type       | Description                                                     |
| ------------ | ---------- | --------------------------------------------------------------- | ------------------------------------------------- |
| `answer`     | String     | The correct answer value                                        |
| `direction`  | 'vertical' | 'horizontal'                                                    | Layout direction of options (default: 'vertical') |
| `modelValue` | Array      | Array of objects with `resolved` and `selectedValue` properties |

##### Events

| Event                 | Description                      |
| --------------------- | -------------------------------- |
| `model-value-changed` | Fired when the selection changes |

### 2. Integer Digit Match (`fl-lion-integer-digit-match`)

A custom web component extending Lion's `LionInput` that creates a multi-input field for matching individual digits of a target number. Useful for PIN entry, verification codes, or educational applications.

#### Features

- Creates individual input fields for each digit
- Validates input against a target number
- Restricts input to numeric values only
- Provides visual feedback on validation
- Supports dynamic target numbers

#### Usage

##### Angular

```typescript
// In your component TS file
import '@front-lab-nx/lion-form/integer-digit';

@Component({
  selector: 'app-digit-match',
  template: `
    <fl-lion-integer-digit-match
      [target]="'4829'"
    ></fl-lion-integer-digit-match>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DigitMatchComponent {}
```

##### React

```tsx
import React from 'react';
import '@front-lab-nx/lion-form/integer-digit';

const DigitMatchComponent = () => {
  return (
    <fl-lion-integer-digit-match target="4829"></fl-lion-integer-digit-match>
  );
};
```

#### API

##### Properties

| Property     | Type   | Description                                               |
| ------------ | ------ | --------------------------------------------------------- |
| `target`     | String | The target number to match (e.g., '4829')                 |
| `modelValue` | String | The current input value as a concatenated string          |
| `segments`   | Array  | Internal array of target digits (e.g., ['4','8','2','9']) |

##### Events

| Event                 | Description                        |
| --------------------- | ---------------------------------- |
| `model-value-changed` | Fired when any digit input changes |

## Development

### Building

```sh
npm run build
```

### Running unit tests

```sh
npm run test
```

## Browser Support

These components are built using standard web components and work in all modern browsers that support the Custom Elements v1 specification.

## Accessibility

These components inherit accessibility features from Lion UI components, including keyboard navigation, focus management, and ARIA attributes.
