import { css, html } from 'lit';
import { MultiInputMixin } from './multi-input-mixin.js';
import { LionField, Validator } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-input.js';

export class IntegerDigitMatch extends MultiInputMixin(LionField) {
  static styles = css`
    input {
      padding: 0;
      width: var(--fl-lion-integer-digit-match-input-width);
      text-align: center;
      border: 0;
      border-bottom-width: var(
        --fl-lion-integer-digit-match-input-border-width
      );
      border-bottom-style: solid;
      border-bottom-color: var(--fl-lion-integer-digit-match-input-color);
    }

    input:focus-visible {
      outline: 0;
    }

    input[data-invalid] {
      border-color: var(--fl-lion-integer-digit-match-input-invalid-color);
      color: var(--fl-lion-integer-digit-match-input-invalid-color);
    }
  `;

  static properties = {
    target: { type: String },
    direction: { type: String },
  };

  get slots() {
    return {
      ...super.slots,
      input: function () {
        return html`<input type="hidden" />`;
      },
    };
  }

  get __digitInputs() {
    return Array.from(this.shadowRoot.querySelectorAll('input'));
  }

  get _focusableNode() {
    if (!this.__digitInputs?.length) {
      return this._inputNode;
    }

    const length = this.__digitInputs.length;

    return this.direction === 'ltr'
      ? this.__digitInputs[0]
      : this.__digitInputs[length - 1];
  }

  constructor() {
    super();
    this.target = '';
    this.direction = 'rtl';
    // internal array of target digits: ['4','8','2','9']
    /** @type {string[]} */
    this.segments = [];
  }

  /**
   *
   * @param {*} changed
   */
  updated(changed) {
    if (changed.has('target')) {
      this.segments = Array.from(this.target);

      /** @ts-expect-error - type */
      this.modelValue = ''; // clear previous inputs

      this.updateComplete.then(() => {
        if (this._focusableNode) {
          this._focusableNode.focus();
        }
      });

      this.validators = [
        new (class extends Validator {
          static get validatorName() {
            return 'digits';
          }

          execute(modelValue, params) {
            if (!modelValue?.length) {
              return false;
            }

            if (params.direction === 'rtl') {
              return modelValue === params.target.slice(-modelValue.length)
                ? false
                : 'mismatch';
            } else if (params.direction === 'ltr') {
              return modelValue === params.target.slice(0, modelValue.length)
                ? false
                : 'mismatch';
            }

            return false;
          }
        })({ target: this.target, direction: this.direction }),
      ];
    }
  }

  /**
   * Renders one <lion-input> for segment index `i`.
   * We hook into its model-value and blur to do per-digit + full validation.
   *
   * @param {number} i - The index of the segment.
   * @returns {HTMLElement} - The rendered input element.
   * @override this *in your subclass* to return a single <lion-input> (or any other input-like node) for segment `i`.
   */
  _renderSingleInput(i) {
    // @ts-expect-error - type
    return html`
      <input
        type="text"
        tabindex="0"
        id="${i}--integer-digit-match"
        placeholder=""
        @input=${e => this._onInput(i, e.target.value)}
        @focus=${e => this._onFocus(i)}
        @keydown=${e => this._onKeyDown(i)}
      />
    `;
  }

  /**
   *
   * @param {number} index
   * @param {string} char
   * @ts-expect-error - type
   */
  _onInput(index, char) {
    // Only keep the first digit if any

    const cleaned = (char.match(/\d/) || [''])[0];

    console.log(char);

    if (!this.__digitInputs || this.__digitInputs.length === 0) return;

    this.modelValue = this.__digitInputs.map(i => i.value).join('');

    if (this.validationStates.error.digits === 'mismatch') {
      this.__digitInputs[index].setAttribute('data-invalid', '');
    } else {
      this.__digitInputs[index].removeAttribute('data-invalid');
    }

    if (cleaned && this.validationStates.error.digits !== 'mismatch') {
      const nextIndex =
        this.direction === 'ltr'
          ? Math.min(index + 1, this.__digitInputs.length - 1)
          : Math.max(index - 1, 0);

      // Only move focus if we're not already at the edge
      if (nextIndex !== index) {
        this.updateComplete.then(() => {
          this.__digitInputs[nextIndex].focus();
        });
      }
    }
  }

  _onFocus(index) {
    //if(this.direction === 'ltr' && i === ) {}
    const currentDigits = this.__digitInputs.map(input => input.value);
    const isInvalid = this.validationStates.error.digits === 'mismatch';

    console.log(isInvalid);

    if (
      index > 0 &&
      this.direction === 'ltr' &&
      (!currentDigits[index - 1] || isInvalid)
    ) {
      this.__digitInputs[index - 1].focus();
    }

    if (
      index < currentDigits.length - 1 &&
      this.direction === 'rtl' &&
      (!currentDigits[index + 1] || isInvalid)
    ) {
      this.__digitInputs[index + 1].focus();
    }
  }

  _onKeyDown(index) {
    console.log('keydown', this.validationStates.error.digits);

    if (this.validationStates.error.digits === 'mismatch') {
      this.__digitInputs[index].value = '';
    }
  }
}

// todo clean this up
if (!customElements.get('fl-lion-integer-digit-match')) {
  customElements.define('fl-lion-integer-digit-match', IntegerDigitMatch);
}
