import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { LockSelect } from './lock-select.js';
import '@lion/ui/define/lion-option.js';

describe('LockedSelectionListBox', () => {
  let element;
  let options;

  beforeEach(async () => {
    if (!customElements.get('locked-selection-test')) {
      customElements.define('locked-selection-test', LockSelect);
    }

    element = await fixture(html`
      <locked-selection-test answer="option1">
        <lion-option value="option1" choiceValue="option1"
          >Option 1</lion-option
        >
        <lion-option value="option2" choiceValue="option2"
          >Option 2</lion-option
        >
        <lion-option value="option3" choiceValue="option3"
          >Option 3</lion-option
        >
      </locked-selection-test>
    `);

    options = element.querySelectorAll('lion-option');
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with multipleChoice set to true', () => {
    expect(element.multipleChoice).toBe(true);
  });

  it('should have empty modelValue initially', () => {
    expect(element.modelValue).toEqual([]);
  });

  it('should throw error when trying to set modelValue', () => {
    expect(() => {
      element.modelValue = ['option1'];
    }).toThrow('modelValue is read-only');
  });

  it('should throw error when trying to set answer after it is already set', () => {
    expect(() => {
      element.answer = 'option2';
    }).toThrow('answer is already set');
  });

  it('should lock an option after it is selected', async () => {
    options[0].click();
    await element.updateComplete;
    expect(options[0].hasAttribute('disabled')).toBe(true);
  });

  it('should mark the correct answer with data-expected attribute', async () => {
    options[0].click();
    await element.updateComplete;
    expect(options[0].hasAttribute('data-expected')).toBe(true);
  });

  it('should lock all other options when correct answer is selected', async () => {
    options[0].click();
    await element.updateComplete;
    expect(options[1].style.pointerEvents).toBe('none');
    expect(options[2].style.pointerEvents).toBe('none');
  });

  it('should not lock other options when incorrect answer is selected', async () => {
    options[1].click();
    await element.updateComplete;
    expect(options[1].hasAttribute('disabled')).toBe(true);
    expect(options[0].style.pointerEvents).not.toBe('none');
    expect(options[2].style.pointerEvents).not.toBe('none');
  });

  it('should return correct modelValue after selection', async () => {
    options[0].click();
    await element.updateComplete;
    expect(element.modelValue).toEqual([
      {
        resolved: true,
        selectedValue: 'option1',
      },
    ]);
  });

  it('should return modelValue with resolved=false for incorrect selection', async () => {
    options[1].click();
    await element.updateComplete;
    expect(element.modelValue).toEqual([
      {
        resolved: false,
        selectedValue: 'option2',
      },
    ]);
  });

  it('should not allow reselection of a locked option', async () => {
    options[1].click();
    await element.updateComplete;
    const initialModelValue = JSON.stringify(element.modelValue);
    options[1].click();
    await element.updateComplete;
    expect(JSON.stringify(element.modelValue)).toBe(initialModelValue);
  });

  it('should handle multiple selections correctly', async () => {
    options[1].click();
    await element.updateComplete;
    options[2].click();
    await element.updateComplete;
    expect(options[1].hasAttribute('disabled')).toBe(true);
    expect(options[2].hasAttribute('disabled')).toBe(true);
    expect(element.modelValue).toEqual([
      {
        resolved: false,
        selectedValue: 'option3',
      },
    ]);
  });
});
