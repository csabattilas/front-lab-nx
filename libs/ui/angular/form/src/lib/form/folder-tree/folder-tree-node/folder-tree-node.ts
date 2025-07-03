import { Component, input, linkedSignal, effect } from '@angular/core';
import {
  TreeNode,
  TreeSelectionComponentContext,
} from '../model/folder-tree-model';

@Component({
  selector: 'fl-form-folder-tree-node',
  template: '',
})
/**
 * node component base class
 */
export abstract class BaseFolderTreeNodeComponent {
  public node = input.required<TreeNode>();
  public inheritedChecked = input<boolean>(false);
  public expanded = input<boolean>(false);
  public depth = input<number>(0);

  public readonly expandedSignal = linkedSignal<boolean>(() => this.expanded());

  public readonly checked = linkedSignal<boolean>(() => {
    return this.inheritedChecked();
  });

  // @ts-expect-error: TS6133
  private readonly formControlChecked = effect(() => {
    // we need to only run this when we write value
    // there are other ways to do this:
    //      - untracked (but that would kill subsequent writeValue)
    //      - reading the child. did in the ctx version where i leverage the nodeMap
    if (this.ctx.isFormUpdate() && !this.hasChildren) {
      this.checked.set(this.ctx.selectedItemsIds().has(this.node().id));
    }
  });

  public abstract readonly ctx: TreeSelectionComponentContext;

  protected get hasChildren(): boolean {
    return !!this.node().items?.length;
  }

  public onToggle(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
  }

  public toggleExpanded(): void {
    if (!this.hasChildren) {
      return;
    }
    this.expandedSignal.update(expanded => !expanded);
  }
}
