import { LionTabs } from '@lion/ui/tabs.js';

export declare class FlTabs extends LionTabs {
  static properties: Record<string, unknown>;
}

declare global {
  interface HTMLElementTagNameMap {
    'fl-tabs': FlTabs;
  }
}
