import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  viewChildren,
} from '@angular/core';
import { CheckboxComponent } from '../../../checkbox';
import {
  FOLDER_TREE_CONTEXT,
  TreeNode,
  TreeSelectionComponentContext,
} from '../../model/folder-tree-model';
import { PerformanceService } from '../../performance/performance';

@Component({
  selector: 'fl-form-folder-tree-node-vc-no-effect',
  imports: [CheckboxComponent],
  styleUrl: './folder-tree-node-vc-no-effect.scss',
  templateUrl: './folder-tree-node-vc-no-effect.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeNodeVcNoEffectComponent {
  public node = input<TreeNode>();
  public inheritedChecked = input<boolean>(false);
  public expanded = input<boolean>(false);
  public depth = input<number>(0);

  public readonly expandedSignal = linkedSignal<boolean>(() => this.expanded());

  public readonly checked = linkedSignal<boolean>(() => {
    const childrenBasedChecked = this.childrenBasedChecked();

    if (!this.hasChildren) {
      return this.manualChecked();
    }

    return childrenBasedChecked;
  });

  public readonly manualChecked = linkedSignal((): boolean =>
    this.inheritedChecked()
  );

  public readonly indeterminate = linkedSignal((): boolean => {
    const childrenChecked = this.children()?.map(
      (c: FolderTreeNodeVcNoEffectComponent) => ({
        checked: c.checked(),
        indeterminate: c.indeterminate(),
      })
    );

    const checkedCount = childrenChecked?.filter(c => c.checked).length;
    const indeterminateCount = childrenChecked?.filter(
      c => c.indeterminate
    ).length;

    const total = this.node()?.items?.length ?? 0;

    return indeterminateCount > 0 || (checkedCount > 0 && checkedCount < total);
  });

  private readonly children = viewChildren(FolderTreeNodeVcNoEffectComponent);

  private readonly childrenBasedChecked = computed((): boolean => {
    const checkedCount = this.children()
      ?.map((c: FolderTreeNodeVcNoEffectComponent) => {
        return c.checked();
      })
      .filter(Boolean).length;

    const total = this.node()?.items?.length ?? 0;

    if ((checkedCount === total && checkedCount > 0) || checkedCount === 0) {
      return checkedCount === total && checkedCount > 0;
    }

    return this.inheritedChecked();
  });

  private readonly performanceService = inject(PerformanceService);

  private readonly ctx: TreeSelectionComponentContext =
    inject(FOLDER_TREE_CONTEXT);

  // @ts-expect-error: TS6133
  private readonly formControlChecked = effect(() => {
    // we need to only run this when we write value
    // there are other ways to do this:
    //      - untracked (but that would kill subsequent writeValue)
    //      - reading the child. did in the ctx version where I leverage the nodeMap
    if (this.ctx.isFormUpdate() && !this.hasChildren) {
      const id = this.node()?.id ?? 0;
      this.checked.set(this.ctx.selectedItemsIds().has(id));
    }
  });

  // @ts-expect-error: TS6133
  // this one we need, as we push towards the context
  private readonly checkedEffect = effect(() => {
    const checked = this.checked();

    const id = this.node()?.id ?? 0;

    // just add the items to the context
    if (checked && !this.hasChildren) {
      this.ctx.addSelectedItems(id);
    } else if (!checked && !this.hasChildren) {
      this.ctx.removeSelectedItems(id);
    }

    if (checked && this.hasChildren) {
      this.expandedSignal.set(true);
    }

    this.performanceService.updateCheckedCount('vc-no-effect');
  });

  public get hasChildren(): boolean {
    return !!this.node()?.items?.length;
  }

  public toggleExpanded(): void {
    if (!this.hasChildren) {
      return;
    }
    this.expandedSignal.update(expanded => !expanded);
  }

  public onToggle(event: Event): void {
    this.performanceService.resetCheckedCount();
    const isChecked = (event.target as HTMLInputElement).checked;
    // this will break the racing cycle
    setTimeout(() => {
      this.manualChecked.set(isChecked);
    }, 0);
  }
}
