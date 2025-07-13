import { Injectable, signal } from '@angular/core';
import { CheckboxTreeNodeState } from './model';

@Injectable()
export class CheckboxTreeSelectionContextService {
  public readonly nodeStates = new Map<number, CheckboxTreeNodeState>();

  public selectedItemsIds = new Set<number>();

  public registerOnChange(fn: (value: number[]) => void): void {
    this._onChange = fn;
  }

  public registerNode(id: number): CheckboxTreeNodeState {
    if (!this.nodeStates.has(id)) {
      this.nodeStates.set(id, {
        id,
        checked: signal(false),
        indeterminate: signal(false),
        writeValueChecked: signal(false),
      });
    }

    return this.getNode(id);
  }

  public updateIndeterminateNodeSelection(
    id: number,
    isIntermediate: boolean
  ): void {
    const nodeState = this.nodeStates.get(id);

    if (nodeState) {
      nodeState.indeterminate.set(isIntermediate);
    }
  }

  public updateNodeCheckedSelection(
    id: number,
    checked: boolean,
    hasChildren: boolean
  ): void {
    const nodeState = this.nodeStates.get(id);

    if (nodeState) {
      nodeState.checked.set(checked);
      nodeState.writeValueChecked.set(checked);
    }
  }

  public updateSelectedItemsIds(ids: number[]): void {
    this.selectedItemsIds = new Set(ids);
  }

  public addSelectedItems(id: number): void {
    if (this.selectedItemsIds.has(id)) {
      return;
    }
    this.selectedItemsIds.add(id);
    this._onChange(Array.from(this.selectedItemsIds));
  }

  public removeSelectedItems(id: number): void {
    if (!this.selectedItemsIds.has(id)) {
      return;
    }
    this.selectedItemsIds.delete(id);
    this._onChange(Array.from(this.selectedItemsIds));
  }

  public getNode(id: number): CheckboxTreeNodeState {
    const nodeState = this.nodeStates.get(id);
    if (!nodeState) {
      throw new Error('Node not found');
    }

    return nodeState;
  }
  
  private _onChange: (value: number[]) => void = () => {
    //
  };
}
