import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  linkedSignal,
  effect,
  inject,
} from '@angular/core';

import { FOLDER_TREE_CONTEXT } from '../../model/folder-tree-model';
import { CheckboxComponent } from '../../../checkbox/';
import { BaseFolderTreeNodeComponent } from '../../folder-tree-node/folder-tree-node';

@Component({
  selector: 'fl-form-folder-tree-node-otp',
  templateUrl: './folder-tree-node-otp.html',
  styleUrl: './folder-tree-node-otp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent],
})
/**
 * this approach is based on the idea of children telling (outputting) to their parent their checked and intermediate state
 * then the parent updates their own state based on manually keep counting it's checked and indeterminate children
 */
export class FolderTreeNodeOtpComponent extends BaseFolderTreeNodeComponent {
  public checkedChange = output<boolean>();
  public indeterminateChange = output<boolean>();

  public readonly ctx = inject(FOLDER_TREE_CONTEXT);

  public readonly indeterminate = linkedSignal<boolean>(() => {
    const childrenCheckedCount = this.childrenCheckedCount() ?? 0;

    return (
      childrenCheckedCount > 0 &&
      childrenCheckedCount < (this.node().items?.length ?? 0)
    );
  });

  // side effects to notify the parent about their children checked state
  // I could not use computed/linkedSignals as it is hard design this only declaratively
  // the checked state depends on the order of the actions. always latest wins
  // perhaps there is a way, but I could not find it
  private readonly checkedEffect = effect(() => {
    if (this.currentChecked !== this.checked()) {
      this.currentChecked = this.checked();
      this.checkedChange.emit(this.currentChecked);
    }

    const node = this.node();

    if (this.checked() && !this.hasChildren) {
      this.ctx.addSelectedItems(node.id);
    } else if (!this.checked() && !this.hasChildren) {
      this.ctx.removeSelectedItems(node.id);
    }

    if (this.checked() && this.hasChildren) {
      this.expandedSignal.set(true);
    }
  });

  //side effect to notify the parent about their children indeterminate state
  private readonly indeterminateEffect = effect(() => {
    if (!this.hasChildren) return;

    if (this.currentIndeterminate !== this.indeterminate()) {
      this.currentIndeterminate = this.indeterminate();
      this.indeterminateChange.emit(this.currentIndeterminate);
    }
  });

  private readonly childrenCheckedCount = signal<number>(0);
  private readonly indeterminateCheckedCount = signal<number>(0);

  private currentChecked = false;
  private currentIndeterminate = false;

  public onChildSelection($event: boolean): void {
    const updateCount = $event ? 1 : -1;
    // counting the checked children
    this.childrenCheckedCount.update(count => {
      return count + updateCount;
    });

    const count = this.childrenCheckedCount();
    const total = this.node().items?.length ?? 0;

    if (total === count || count === 0) {
      this.checked.set(total === count);
    }

    if (this.indeterminateCheckedCount() > 0) {
      this.indeterminate.set(true);
    }
  }

  public onIndeterminateChange($event: boolean): void {
    const updateCount = $event ? 1 : -1;
    // counting the indeterminate children they have a role in defining the indeterminate state of the parent
    this.indeterminateCheckedCount.update(count => {
      return count + updateCount;
    });

    const allChecked =
      this.childrenCheckedCount() === this.node().items?.length;
    const noneChecked = this.childrenCheckedCount() === 0;

    if ($event || allChecked || noneChecked) {
      this.indeterminate.set($event);
    }
  }
}
