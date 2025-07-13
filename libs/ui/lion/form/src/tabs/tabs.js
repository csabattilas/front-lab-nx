import { css } from 'lit';
import { LionTabs } from '@lion/ui/tabs.js';

export class FlTabs extends LionTabs {
  static styles = [
    super.styles,
    css`
      .tabs__tab-group {
        justify-content: var(
          --fl-lion-tabs-tabs-group-justify-content,
          flex-start
        );
        border-bottom: 1px solid var(--color-secondary, #ccc);
      }
    `,
  ];

  static properties = {
    persistSelectedIndexTo: {
      type: String,
      attribute: 'persist-selected-index-to',
    },
  };

  firstUpdated() {
    super.firstUpdated();
    if (this.persistSelectedIndexTo && this.__getPersistedSelectedIndex()) {
      this.selectedIndex = Number(this.__getPersistedSelectedIndex());
    }
  }

  _setSelectedIndexWithFocus(index) {
    if (this.persistSelectedIndexTo) {
      this.__persistSelectedIndex(this.persistSelectedIndexTo, index);
    }
    super._setSelectedIndexWithFocus(index);
  }

  __persistSelectedIndex(persistTo, index) {
    window.sessionStorage.setItem(`fl-lion-tabs-${persistTo}`, index);
  }

  __getPersistedSelectedIndex() {
    return window.sessionStorage.getItem(
      `fl-lion-tabs-${this.persistSelectedIndexTo}`
    );
  }
}
customElements.define('fl-lion-tabs', FlTabs);
