import React, { useState } from 'react';
import '@front-lab-nx/lion-form/locked-selection';
import '@lion/ui/define/lion-option.js';

import { LockedSelection } from '@front-lab-nx/lion-form/locked-selection';

import './custom-lion-demo.scss';
// Web Component demo using Lion components
const CustomLionDemo = () => {
  const listboxRef = React.useRef<LockedSelection>(null);

  const [modelValue, setModelValue] =
    useState<{ resolved: boolean; selectedValue: string }[]>();

  const handleExclusiveChange = (e: CustomEvent) => {
    console.log(listboxRef?.current?.modelValue);
    setModelValue(listboxRef?.current?.modelValue || []);
  };

  return (
    <div className="container p-4">
      <h2 className="text-xl font-bold mb-6">
        Custom components extended from lion
      </h2>
      <div className="mb-6">
        <h3>locked selection list box</h3>
        {modelValue?.[0]?.selectedValue}
        <locked-selection
          ref={listboxRef}
          answer="option1"
          onmodel-value-changed={handleExclusiveChange}
        >
          <lion-option value="option1" choiceValue="option1">
            Option 1
          </lion-option>
          <lion-option value="option2" choiceValue="option2">
            Option 2
          </lion-option>
          <lion-option value="option3" choiceValue="option3">
            Option 3
          </lion-option>
          <lion-option value="option4" choiceValue="option4">
            Option 4
          </lion-option>
        </locked-selection>
      </div>
    </div>
  );
};

export default CustomLionDemo;
