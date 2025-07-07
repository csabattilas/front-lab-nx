import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  input,
  linkedSignal,
  signal,
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
  selector: 'fl-form-folder-tree-node',
  imports: [CheckboxComponent],
  styleUrl: './folder-tree-node.scss',
  templateUrl: './folder-tree-node.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeNodeComponent {
  public node = input<TreeNode>();
  public expanded = input<boolean>(false);
  public depth = input<number>(0);

  public readonly expandedSignal = linkedSignal<boolean>(() => this.expanded());

  public readonly checked = linkedSignal<boolean>(() => {
    const childrenBasedChecked = this.childrenBasedChecked();
    const inheritedChecked = this._inheritedChecked();
    const writeValueChecked = this.writeValueChecked();

    const node = this.node();

    // side effect hack to save the last checked state
    if (node) {
      node.checked =
        writeValueChecked ?? childrenBasedChecked ?? inheritedChecked;
    }

    return writeValueChecked ?? childrenBasedChecked ?? inheritedChecked;
  });

  public readonly indeterminate = linkedSignal((): boolean => {
    const childrenChecked = this.children()?.map(
      (c: FolderTreeNodeComponent) => ({
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

  private readonly children = viewChildren(FolderTreeNodeComponent);

  private readonly childrenBasedChecked = linkedSignal<boolean | null>(
    (): boolean | null => {
      if (!this.hasChildren) {
        return false;
      }

      const checkedCount = this.children()
        ?.map((c: FolderTreeNodeComponent) => {
          return c.checked();
        })
        .filter(Boolean).length;

      const total = this.node()?.items?.length ?? 0;

      if ((checkedCount === total && checkedCount > 0) || checkedCount === 0) {
        return checkedCount === total && checkedCount > 0;
      }

      return this.node()?.checked ?? null;
    }
  );

  private readonly performanceService = inject(PerformanceService);

  private readonly ctx: TreeSelectionComponentContext =
    inject(FOLDER_TREE_CONTEXT);

  private readonly writeValueChecked = linkedSignal<boolean | null>(
    (): boolean | null => {
      const node = this.node();

      if (node && !this.hasChildren) {
        return this.ctx.selectedItemsIds().has(node.id);
      } else {
        return null;
      }
    }
  );

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

  private readonly _inheritedChecked = signal(false);

  public get hasChildren(): boolean {
    return !!this.node()?.items?.length;
  }

  @Input()
  set inheritedChecked(value: boolean) {
    // side effect to kill children based checked state
    this.childrenBasedChecked.set(null);
    this.writeValueChecked.set(null);
    this._inheritedChecked.set(value);
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
    this.checked.set(isChecked);
  }
}
