import { WritableSignal } from '@angular/core';

export interface CheckboxTreeNodeState {
  id: number;
  checked: WritableSignal<boolean>;
  indeterminate: WritableSignal<boolean>;
  writeValueChecked: WritableSignal<boolean>;
}
