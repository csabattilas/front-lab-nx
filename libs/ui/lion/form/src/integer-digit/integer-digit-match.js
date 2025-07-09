import { css, html } from 'lit';
import { MultiInputMixin } from './multi-input-mixin.js';
import { LionInput } from '@lion/ui/input.js';
import '@lion/ui/define/lion-input.js';

export class IntegerDigitMatch extends MultiInputMixin(LionInput) {
  static get styles() {
    return css`
      :host {
        --lion-input-width: 1rem;
        --lion-input-height: 1rem;
      }

      input {
        width: var(--lion-input-width);
        height: var(--lion-input-height);
        text-align: center;
      }
    `;
  }

  /**
   * @override properties
   */
  static get properties() {
    return {
      ...super.properties,
      /** the “target” number as a string, e.g. '4829' */
      target: { type: String },
    };
  }

  constructor() {
    super();
    console.log('constructor');
    this.target = '';
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
      // whenever target changes, rebuild segments and reset the value
      this.segments = Array.from(this.target);
      /** @ts-expect-error - type */
      this.modelValue = ''; // clear previous inputs
      // this.setValidity({}); // reset validity
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
      <lion-input
        .modelValue=${this.modelValue[i] || ''}
        placeholder=""
        @model-value-changed=${
          /** @param {*} e */ e => this._onDigit(i, e.detail.modelValue)
        }
        @blur=${() => this._validate()}
      ></lion-input>
    `;
  }

  /**
   *
   * @param {number} index
   * @param {string} char
   * @ts-expect-error - type
   */
  _onDigit(index, char) {
    const cleaned = (char.match(/\d/) || [''])[0];
    /** @ts-expect-error - type */
    const arr = Array.from(this.modelValue.padEnd(this.segments.length, ''));
    arr[index] = cleaned;
    this.modelValue = arr.join('');
    //this.setValidity({});
  }

  /**
   * Validates the input value.
   */
  _validate() {
    const allMatch = this.modelValue === this.target;
    console.log(allMatch);
    // this.setValidity(
    //   { customError: !allMatch },
    //   allMatch ? '' : `Must match ${this.target}`
    // );
  }
}

if (!customElements.get('fl-lion-integer-digit-match')) {
  customElements.define('fl-lion-integer-digit-match', IntegerDigitMatch);
}
