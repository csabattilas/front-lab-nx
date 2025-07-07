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
    const writeValueChecked = this.writeValueCheckedSignal();
    const childrenBasedChecked = this.childrenBasedCheckedSignal();
    const inheritedChecked = this.inheritedCheckedSignal();

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

  private readonly performanceService = inject(PerformanceService);

  private readonly ctx: TreeSelectionComponentContext =
    inject(FOLDER_TREE_CONTEXT);

  private readonly children = viewChildren(FolderTreeNodeComponent);

  // collect the checked state from the writeValue from the folder tree control.
  private readonly writeValueCheckedSignal = linkedSignal<boolean | null>(
    (): boolean | null => {
      const id = this.node()?.id;

      if (id && !this.hasChildren) {
        return this.ctx.selectedItemsIds().has(id);
      } else {
        return null;
      }
    }
  );

  // computes the checked state from the children.
  private readonly childrenBasedCheckedSignal = linkedSignal<boolean | null>(
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

  private readonly inheritedCheckedSignal = signal(false);

  // @ts-expect-error: TS6133
  // this one we need, as we push towards the context
  private readonly checkedEffect = effect(() => {
    const node = this.node();

    if (node) {
      // save the latest checked state
      node.checked = this.checked();

      const id = this.node()?.id ?? 0;

      // update selected items in the context
      if (node.checked && !this.hasChildren) {
        this.ctx.addSelectedItems(id);
      } else if (!node.checked && !this.hasChildren) {
        this.ctx.removeSelectedItems(id);
      }

      // manage expanded state
      if (node.checked && this.hasChildren) {
        this.expandedSignal.set(true);
      }

      // update performance mark
      this.performanceService.updateCheckedCount('vc-no-effect');
    }
  });

  public get hasChildren(): boolean {
    return !!this.node()?.items?.length;
  }

  @Input()
  set inheritedChecked(value: boolean) {
    // side effect to kill children and writeValue based checked state
    this.childrenBasedCheckedSignal.set(null);
    this.writeValueCheckedSignal.set(null);

    this.inheritedCheckedSignal.set(value);
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
