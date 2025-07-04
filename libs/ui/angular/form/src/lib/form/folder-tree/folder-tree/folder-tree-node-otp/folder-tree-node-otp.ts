import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  effect,
  inject,
  OnInit,
} from '@angular/core';

import { FOLDER_TREE_CONTEXT } from '../../model/folder-tree-model';
import { CheckboxComponent } from '../../../checkbox/';
import { BaseFolderTreeNodeComponent } from '../../folder-tree-node/folder-tree-node';
import { PerformanceService } from '../../performance/performance';

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
export class FolderTreeNodeOtpComponent
  extends BaseFolderTreeNodeComponent
  implements OnInit
{
  public checkedChange = output<boolean>();
  public indeterminateChange = output<boolean>();

  public readonly ctx = inject(FOLDER_TREE_CONTEXT);

  public readonly indeterminate = signal<boolean>(false);

  private readonly performanceService = inject(PerformanceService);
  private initialTimeReset = true;
  // side effects to notify the parent about their children checked state
  // I could not use computed/linkedSignals as it is hard design this only declaratively
  // the checked state depends on the order of the actions. always latest wins
  // perhaps there is a way, but I could not find it

  // @ts-expect-error: TS6133
  private readonly checkedEffect = effect(() => {
    if (this.initialTimeReset) {
      this.performanceService.resetCheckedCount();
      this.initialTimeReset = false;
    }

    const checked = this.checked();
    this.node().checked = checked;
    this.checkedChange.emit(checked);

    if (checked && !this.hasChildren) {
      this.ctx.addSelectedItems(this.node().id);
    } else if (!checked && !this.hasChildren) {
      this.ctx.removeSelectedItems(this.node().id);
    }

    if (checked && this.hasChildren) {
      this.expandedSignal.set(true);
    }

    this.performanceService.updateCheckedCount('otp');
  });

  //side effect to notify the parent about their children indeterminate state
  // @ts-expect-error: TS6133
  private readonly indeterminateEffect = effect(() => {
    if (!this.hasChildren) return;

    this.node().indeterminate = this.indeterminate();
    this.indeterminateChange.emit(this.indeterminate());

    if (this.indeterminate() && this.hasChildren) {
      this.expandedSignal.set(true);
    }

    this.performanceService.updateCheckedCount('otp');
  });

  private total = 0;

  public onChildSelection(): void {
    const count =
      this.node().items?.reduce((acc, item) => {
        return acc + (item.checked ? 1 : 0);
      }, 0) ?? 0;

    const indeterminateCheckedCount =
      this.node().items?.reduce((acc, item) => {
        return acc + (item.indeterminate ? 1 : 0);
      }, 0) ?? 0;

    if (this.total === count || count === 0) {
      this.checked.set(this.total === count);
    }

    this.indeterminate.set(
      indeterminateCheckedCount > 0 || (this.total > count && count > 0)
    );
  }

  public onIndeterminateChange(): void {
    const count =
      this.node().items?.reduce((acc, item) => {
        return acc + (item.checked ? 1 : 0);
      }, 0) ?? 0;

    const indeterminateCheckedCount =
      this.node().items?.reduce((acc, item) => {
        return acc + (item.indeterminate ? 1 : 0);
      }, 0) ?? 0;

    this.indeterminate.set(
      indeterminateCheckedCount > 0 || (this.total > count && count > 0)
    );
  }

  public ngOnInit(): void {
    this.total = this.node().items?.length ?? 0;
  }

  public override onToggle(event: Event): void {
    this.performanceService.resetCheckedCount();
    super.onToggle(event);
  }
}
