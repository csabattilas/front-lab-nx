import { Injectable, signal } from '@angular/core';
import { NodeState } from '../model/folder-tree-model';

@Injectable()
export class TreeSelectionContextService {
  public readonly nodeStates = new Map<string, NodeState>();

  public selectedItemsIds = new Set<number>();

  public registerOnChange(fn: (value: number[]) => void): void {
    this._onChange = fn;
  }

  public registerNode(id: number, hasChildren: boolean): NodeState {
    const existingNode = hasChildren
      ? this.nodeStates.has(this.getMapId(id, true))
      : this.nodeStates.has(this.getMapId(id, false));

    if (!existingNode) {
      this.nodeStates.set(this.getMapId(id, hasChildren), {
        id,
        checked: signal(false),
        indeterminate: signal(false),
        writeValueChecked: signal(false),
      });
    }

    return this.getNode(id, hasChildren);
  }

  public updateIndeterminateNodeSelection(
    id: number,
    isIntermediate: boolean
  ): void {
    const nodeState = this.nodeStates.get(this.getMapId(id, true));

    if (nodeState) {
      nodeState.indeterminate.set(isIntermediate);
    }
  }

  public updateNodeCheckedSelection(
    id: number,
    checked: boolean,
    hasChildren: boolean
  ): void {
    const nodeState = this.nodeStates.get(this.getMapId(id, hasChildren));

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

  public getNode(id: number, hasChildren: boolean): NodeState {
    const nodeState = this.nodeStates.get(this.getMapId(id, hasChildren));
    if (!nodeState) {
      throw new Error('Node not found');
    }

    return nodeState;
  }

  // i guess it is a mistake that folders and items can have the same id
  // but maybe not so i had to have this little hack here
  public getMapId(id: number, hasChildren: boolean): string {
    return `${id}${!hasChildren ? 'I' : 'F'}`;
  }

  private _onChange: (value: number[]) => void = () => {
    //
  };
}
