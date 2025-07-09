import { html } from 'lit';

/**
 *
 * @param {*} superclass
 * @returns
 */
export const MultiInputMixin = superclass => {
  return class MultiInput extends superclass {
    /**
     * @type {Array<string>}
     */
    static get properties() {
      return {
        // @ts-expect-error - type is not type
        segments: { type: Array },
      };
    }

    constructor() {
      super();

      /** @type {Array<string>} */
      this.segments = [];
    }

    /**
     * Implement this in your subclass to return a single <lion-input> (or any other input-like node) for segment `i`.
     * @param {number} i - The index of the segment.
     * @returns {HTMLElement} - The rendered input element.
     */
    _renderSingleInput(i) {
      throw new Error('Implement _renderSingleInput(i) in subclass');
    }

    render() {
      return html`
        <div part="input-group">
          ${this.segments.map((_, i) => this._renderSingleInput(i))}
        </div>
      `;
    }
  };
};
