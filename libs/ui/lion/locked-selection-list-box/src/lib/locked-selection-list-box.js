import { LionListbox } from '@lion/ui/listbox.js';

/**
 * LockedSelectionListBox component
 * Extends Lion's ListBox with locked selection functionality to mimic quiz functionality with one answer
 * `modelValue` is read-only and returns an array of objects with `resolved` and `selectedValue` properties
 * Once an option is selected, it cannot be reselected
 * Once the answer is found, all the not selected options will stop receiving any interaction
 *
 * It should be used with lion-option components
 */
export class LockedSelectionListBox extends LionListbox {
  __lockedIndexes = new Set();
  __lastCheckedIndex = -1;
  __answer = '';

  static get properties() {
    return {
      ...super.properties,
      answer: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.multipleChoice = true;

    this.addEventListener(
      'model-value-changed',
      this.__onModelValueChanged.bind(this)
    );
  }

  /**
   * @override
   * @returns {Array<{ resolved: boolean; selectedValue: string }>}
   */
  get modelValue() {
    if (this.__lastCheckedIndex !== -1) {
      const modelValue =
        this.formElements?.[this.__lastCheckedIndex]?.choiceValue;
      const resolved = this.__answer === modelValue;
      console.log('modelValue', modelValue, this.__answer, resolved);
      return [
        {
          resolved,
          selectedValue: modelValue,
        },
      ];
    }
    return [];
  }

  /**
   * @param {string} value
   */
  set answer(value) {
    if (!this.__answer) {
      this.__answer = value;
    } else {
      throw new Error('answer is already set');
    }
  }

  /**
   * Update the locked state of all options based on selection.
   * @private
   */
  __onModelValueChanged() {
    const lastCheckedIndex = this.__getLastCheckedIndex();
    if (lastCheckedIndex === -1) return;
    this.__lockFormElement(lastCheckedIndex);
    this.__lastCheckedIndex = lastCheckedIndex;
  }

  /**
   * @private
   * @returns {number} - The index of the last checked element.
   */
  __getLastCheckedIndex() {
    if (
      !this.checkedIndex ||
      !Array.isArray(this.checkedIndex) ||
      this.checkedIndex.length === 0
    )
      return -1;

    for (let i = 0; i < this.checkedIndex.length; i++) {
      const index = this.checkedIndex[i];
      if (!this.__lockedIndexes.has(index)) {
        this.__lastCheckedIndex = index;
        this.__lockedIndexes.add(index);
        return index;
      }
    }
    return -1;
  }

  /**
   * Locks the form element at the given index by setting the 'disabled' attribute.
   * @param {number} index - The index of the form element to lock.
   */
  __lockFormElement(index) {
    if (!this.formElements?.[index]) return;
    this.formElements[index].setAttribute('disabled', '');
    if (this.formElements[index]?.choiceValue === this.__answer) {
      this.formElements[index].setAttribute('data-expected', '');
      this.__lockNotSelectedElements();
    }
  }

  /**
   * Locks all form elements that are not selected.
   * @private
   */
  __lockNotSelectedElements() {
    this.formElements.forEach((element, index) => {
      if (!this.__lockedIndexes.has(index)) {
        element.style.pointerEvents = 'none';
      }
    });
  }
}

if (!customElements.get('locked-selection-list-box')) {
  customElements.define('locked-selection-list-box', LockedSelectionListBox);
}
