export { IntegerDigitMatch } from './integer-digit-match.js';

if (!customElements.get('fl-lion-integer-digit-match')) {
  customElements.define('fl-lion-integer-digit-match', IntegerDigitMatch);
}

export * from './integer-digit-match.js';
