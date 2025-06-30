import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import {
  TreeSelectionComponentContext,
  NodeState,
} from '../model/folder-tree-model';

@Injectable()
export class TreeSelectionContextService
  implements TreeSelectionComponentContext
{
  private readonly _selectedItemsIds = signal<Set<number>>(new Set());

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectedItemsIds = this._selectedItemsIds.asReadonly();

  private readonly nodeStates = new Map<string, NodeState>();

  private readonly _isFormUpdate = signal(false);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isFormUpdate = this._isFormUpdate.asReadonly();

  public transaction<T>(fn: () => T): T {
    this._isFormUpdate.set(true);
    try {
      return fn();
    } finally {
      setTimeout(() => {
        this._isFormUpdate.set(false);
      }, 0);
    }
  }

  public registerNode(id: number, hasChildren: boolean): NodeState {
    const existingNode = hasChildren
      ? this.nodeStates.has(this.getMapId(id, true))
      : this.nodeStates.has(this.getMapId(id, false));

    if (!existingNode) {
      this.nodeStates.set(this.getMapId(id, hasChildren), {
        checked: signal(false),
        indeterminate: signal(false),
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
    }
  }

  public updateSelectedItemsIds(ids: number[]): void {
    this._selectedItemsIds.set(new Set(ids));
  }

  public addSelectedItems(id: number): void {
    if (this._isFormUpdate()) {
      return;
    }
    this._selectedItemsIds.update(ids => {
      ids.add(id);
      return new Set(ids);
    });
  }

  public removeSelectedItems(id: number): void {
    if (this._isFormUpdate()) {
      return;
    }
    this._selectedItemsIds.update(ids => {
      ids.delete(id);
      return new Set(ids);
    });
  }

  private getNode(id: number, hasChildren: boolean): NodeState {
    const nodeState = this.nodeStates.get(this.getMapId(id, hasChildren));
    if (!nodeState) {
      throw new Error('Node not found');
    }

    return nodeState;
  }

  // i guess it is a mistake that folders and items can have the same id
  // but maybe not so i had to have this little hack here
  private getMapId(id: number, hasChildren: boolean): string {
    return `${id}${!hasChildren ? 'I' : 'F'}`;
  }
}
