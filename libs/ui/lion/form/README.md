# Lion/lit element based form controls

## Installation

This component is part of the front-lab-nx monorepo. To use it in your project:

```sh
npm install
```

## Locked Selection List Box

A custom web component extending Lion's `LionListbox` that implements locked selection functionality, similar to a quiz or test interface. Once an option is selected, it becomes locked, preventing further changes.

### Features

- Extends the Lion UI listbox component
- Locks options after selection
- Validates answers against a correct answer
- Provides resolved state for each selection
- Written in vanilla JavaScript as an ES module

### Usage

#### HTML

```html
<locked-selection-list-box answer="option1">
  <lion-option value="option1">Option 1</lion-option>
  <lion-option value="option2">Option 2</lion-option>
  <lion-option value="option3">Option 3</lion-option>
</locked-selection-list-box>
```

#### JavaScript

```js
import '@front-lab/locked-selection';
import '@lion/ui/define/lion-option.js';
```

#### React

```tsx
import React, { useRef } from 'react';
import '@front-lab/locked-selection';
import '@lion/ui/define/lion-option.js';
import { LockedSelection } from '@front-lab/locked-selection';

const MyComponent = () => {
  const listboxRef = useRef<LockedSelection>(null);
  
  const handleChange = (e: CustomEvent) => {
    console.log(listboxRef.current?.modelValue);
  };
  
  return (
    <locked-selection-list-box
      ref={listboxRef}
      answer="option1"
      onmodel-value-changed={handleChange}
    >
      <lion-option value="option1">Option 1</lion-option>
      <lion-option value="option2">Option 2</lion-option>
      <lion-option value="option3">Option 3</lion-option>
    </locked-selection-list-box>
  );
};
```

## API

### Properties

| Property    | Type     | Description                                |
|-------------|----------|--------------------------------------------|  
| `answer`    | String   | The correct answer value                   |
| `modelValue`| Array    | Array of selected values with resolved state|

### Events

| Event                | Description                                 |
|----------------------|---------------------------------------------|  
| `model-value-changed`| Fired when the selection changes            |

## Development

### Building

```sh
npm run build:locked-selection
```

### Running unit tests

```sh
npm run test:locked-selection
```
