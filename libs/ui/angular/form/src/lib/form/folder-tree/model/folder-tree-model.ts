import { InjectionToken, Signal, WritableSignal } from '@angular/core';

export interface TreeNode {
  id: number;
  title: string;
  items?: TreeNode[];
}

export interface NodeState {
  id: number;
  checked: WritableSignal<boolean>;
  indeterminate: WritableSignal<boolean>;
  writeValueChecked: WritableSignal<boolean>;
}

export interface TreeSelectionComponentContext {
  selectedItemsIds: Signal<Set<number>>;
  isFormUpdate: Signal<boolean>;
  addSelectedItems(id: number): void;
  removeSelectedItems(id: number): void;
}

export const FOLDER_TREE_CONTEXT =
  new InjectionToken<TreeSelectionComponentContext>('FOLDER_TREE_CONTEXT');
