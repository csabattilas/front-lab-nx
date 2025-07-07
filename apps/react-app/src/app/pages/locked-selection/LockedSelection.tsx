import React, { useState, useRef } from 'react';
import '@front-lab-nx/lion-form/locked-selection';
import '@lion/ui/define/lion-option.js';
import { LockedSelection as LionLockedSelection } from '@front-lab-nx/lion-form/locked-selection';
import './LockedSelection.scss';

const LockedSelectionPage: React.FC = () => {
  const listboxRef1 = useRef<LionLockedSelection>(null);
  const listboxRef2 = useRef<LionLockedSelection>(null);

  const [isSolved1, setIsSolved1] = useState<boolean | null>(null);
  const [isSolved2, setIsSolved2] = useState<boolean | null>(null);

  const handleChange1 = () => {
    const modelValue = listboxRef1?.current?.modelValue;
    
    if (!modelValue?.length) {
      setIsSolved1(null);
      return;
    }

    const solved = modelValue[0].resolved;
    setIsSolved1(solved);

    if (!solved) {
      setTimeout(() => {
        if (listboxRef1.current) {
          listboxRef1.current.modelValue = [];
        }
      }, 1000); // 1 second delay
    }
  };

  const handleChange2 = () => {
    const modelValue = listboxRef2?.current?.modelValue;
    
    if (!modelValue?.length) {
      setIsSolved2(null);
      return;
    }

    const solved = modelValue[0].resolved;
    setIsSolved2(solved);

    if (!solved) {
      setTimeout(() => {
        if (listboxRef2.current) {
          listboxRef2.current.modelValue = [];
        }
      }, 1000); // 1 second delay
    }
  };

  return (
    <div className="locked-selection-container">
      <h2>Lion based locked selection demo</h2>

      <div className="container">
        <div>
          <p>How much is 17 + 15?</p>
          <locked-selection
            ref={listboxRef1}
            answer="32"
            onmodel-value-changed={handleChange1}
          >
            <lion-option value="32" choiceValue="32">32</lion-option>
            <lion-option value="31" choiceValue="31">31</lion-option>
            <lion-option value="33" choiceValue="33">33</lion-option>
            <lion-option value="42" choiceValue="42">42</lion-option>
          </locked-selection>

          {isSolved1 === true && <span className="success">Correct answer!</span>}
          {isSolved1 === false && <span className="error">Wrong answer!</span>}
        </div>

        <div>
          <p>How much is 18 + 15?</p>
          <locked-selection
            ref={listboxRef2}
            answer="33"
            direction="horizontal"
            onmodel-value-changed={handleChange2}
          >
            <lion-option value="32" choiceValue="32">32</lion-option>
            <lion-option value="31" choiceValue="31">31</lion-option>
            <lion-option value="33" choiceValue="33">33</lion-option>
            <lion-option value="42" choiceValue="42">42</lion-option>
          </locked-selection>

          {isSolved2 === true && <span className="success">Correct answer!</span>}
          {isSolved2 === false && <span className="error">Wrong answer!</span>}
        </div>
      </div>
    </div>
  );
};

export default LockedSelectionPage;
