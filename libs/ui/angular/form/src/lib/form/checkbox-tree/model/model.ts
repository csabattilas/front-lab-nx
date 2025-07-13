import { InjectionToken, Signal } from '@angular/core';

export interface CheckboxTreeNode {
  id: number;
  title: string;
  items?: CheckboxTreeNode[];
  checked?: boolean;
  indeterminate?: boolean;
}

export interface CheckboxTreeContext {
  selectedItemsIds: Signal<Set<number>>;
  addSelectedItems(id: number): void;
  removeSelectedItems(id: number): void;
}

export const CHECKBOX_TREE_CONTEXT = new InjectionToken<CheckboxTreeContext>(
  'CHECKBOX_TREE_CONTEXT'
);
