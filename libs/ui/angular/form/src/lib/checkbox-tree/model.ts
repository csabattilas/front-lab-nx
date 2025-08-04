import { EventEmitter, InjectionToken, InputSignal, Signal } from '@angular/core';

export interface CheckboxLike {
  checked: InputSignal<boolean> | boolean;
  indeterminate: InputSignal<boolean> | boolean;
  change?: EventEmitter<boolean>;
  registerOnChange?: (fn: (value: Event | boolean) => void) => void;
}

export interface ChildState {
  checked: boolean;
  indeterminate: boolean;
}

export interface CheckBoxTitleTemplateContext {
  node: CheckboxTreeNode;
  toggleExpanded: () => void;
  numberOfChildren: number;
}

export interface CheckboxTreeNode {
  id: number;
  title: string;
  items?: CheckboxTreeNode[];
  checked?: boolean;
}

export interface CheckboxTreeContext {
  selectedItemsIds: Signal<Set<number>>;
  selectItem(id: number): void;
  unselectItem(id: number): void;
}

export const CHECKBOX_TREE_CONTEXT = new InjectionToken<CheckboxTreeContext>('CHECKBOX_TREE_CONTEXT');
