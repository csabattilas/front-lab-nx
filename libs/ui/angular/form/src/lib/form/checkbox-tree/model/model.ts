import {
  EventEmitter,
  InjectionToken,
  InputSignal,
  Signal,
} from '@angular/core';

export interface CheckboxLike {
  checked: InputSignal<boolean> | boolean;
  indeterminate: InputSignal<boolean> | boolean;
  change?: EventEmitter<boolean>;
  registerOnChange?: (fn: (value: boolean | null) => void) => void;
}

export interface CheckBoxTitleTemplateContext {
  node: CheckboxTreeNode;
  toggleExpanded: () => void;
  hasChildren: boolean;
}

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
