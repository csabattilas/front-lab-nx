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
    if (this.ctx.isFormUpdate() && !this.hasChildren) {
      this.checked.set(this.ctx.selectedItemsIds().has(this.node().id));
    }
  });

  public abstract readonly ctx: TreeSelectionComponentContext;

  protected get hasChildren(): boolean {
    return !!this.node().items?.length;
  }

  protected onToggle(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
  }

  protected toggleExpanded(): void {
    if (!this.hasChildren) {
      return;
    }
    this.expandedSignal.update(expanded => !expanded);
  }
}
