import {
  Component,
  ChangeDetectionStrategy,
  signal,
  viewChildren,
  effect,
  inject,
} from '@angular/core';
import { CheckboxComponent } from '../../../checkbox';
import { FOLDER_TREE_CONTEXT } from '../../model/folder-tree-model';
import { BaseFolderTreeNodeComponent } from '../../folder-tree-node/folder-tree-node';
@Component({
  selector: 'fl-form-folder-tree-node-vc',
  imports: [CheckboxComponent],
  styleUrl: './folder-tree-node-vc.scss',
  templateUrl: './folder-tree-node-vc.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeNodeVcComponent extends BaseFolderTreeNodeComponent {
  public readonly indeterminate = signal<boolean>(false);

  public readonly ctx = inject(FOLDER_TREE_CONTEXT);

  private readonly children = viewChildren(FolderTreeNodeVcComponent);

  // @ts-expect-error: TS6133
  private readonly checkedEffect = effect(() => {
    const checked = this.checked();

    // just add the items to the context
    if (checked && !this.hasChildren) {
      this.ctx.addSelectedItems(this.node().id);
    } else if (!checked && !this.hasChildren) {
      this.ctx.removeSelectedItems(this.node().id);
    }

    if (checked && this.hasChildren) {
      this.expandedSignal.set(true);
    }
  });

  // @ts-expect-error: TS6133
  private readonly indeterminateChecked = effect(() => {
    if (this.indeterminate()) {
      this.expandedSignal.set(true);
    }
  });

  // @ts-expect-error: TS6133
  private readonly childrenCheckedEffect = effect(() => {
    if (!this.hasChildren) return;

    const childrenChecked = this.children?.().map(
      (c: FolderTreeNodeVcComponent) => ({
        checked: c.checked(),
        indeterminate: c.indeterminate(),
      })
    );

    const total = this.node().items?.length ?? 0;
    const checkedCount = childrenChecked?.filter(c => c.checked).length;
    const indeterminateCount = childrenChecked?.filter(
      c => c.indeterminate
    ).length;

    if (checkedCount === total || checkedCount === 0) {
      this.indeterminate.set(false);
      this.checked.set(checkedCount === total);
    }

    this.indeterminate.set(
      indeterminateCount > 0 || (checkedCount > 0 && checkedCount < total)
    );
  });
}
