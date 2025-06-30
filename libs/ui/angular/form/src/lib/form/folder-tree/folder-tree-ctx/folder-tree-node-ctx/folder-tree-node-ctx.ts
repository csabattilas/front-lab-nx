import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
  computed,
} from '@angular/core';
import { TreeSelectionContextService } from '../folder-tree-context';
import { BaseFolderTreeNodeComponent } from '../../folder-tree-node/folder-tree-node';
import { CheckboxComponent } from '../../../checkbox/checkbox';

@Component({
  selector: 'fl-form-folder-tree-node-ctx',
  imports: [CheckboxComponent],
  templateUrl: './folder-tree-node-ctx.html',
  styleUrl: './folder-tree-node-ctx.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeNodeCtxComponent
  extends BaseFolderTreeNodeComponent
  implements OnInit
{
  public readonly ctx: TreeSelectionContextService = inject(
    TreeSelectionContextService
  );

  public readonly indeterminate = signal(false);

  private currentChecked = false;
  private indeterminateChecked = false;

  // todo: this could also be pushed out into a base class with abstract method forced to be implemented for vc and ctx nodes
  private readonly childStates = computed(() => {
    if (!this.hasChildren) return [];

    return (
      this.node().items?.map(item => {
        return this.ctx.registerNode(item.id, !!item.items?.length);
      }) ?? []
    );
  });

  // @ts-expect-error: TS6133
  private readonly updatedChecked = effect(() => {
    if (this.checked() !== this.currentChecked) {
      this.currentChecked = this.checked();
      this.ctx.updateNodeCheckedSelection(
        this.node().id,
        this.currentChecked,
        this.hasChildren
      );
      if (this.currentChecked && !this.hasChildren) {
        this.ctx.addSelectedItems(this.node().id);
      }
      if (!this.currentChecked && !this.hasChildren) {
        this.ctx.removeSelectedItems(this.node().id);
      }

      if (this.currentChecked && this.hasChildren) {
        this.expandedSignal.set(true);
      }
    }
  });

  // @ts-expect-error: TS6133
  private readonly updatedIntermediate = effect(() => {
    if (this.indeterminate() !== this.indeterminateChecked) {
      this.indeterminateChecked = this.indeterminate();
      this.ctx.updateIndeterminateNodeSelection(
        this.node().id,
        this.indeterminateChecked
      );
    }
  });

  // @ts-expect-error: TS6133
  private readonly childrenCheckedEffect = effect(() => {
    if (!this.hasChildren) return;

    const total = this.node().items?.length ?? 0;

    const checkedCount = this.childStates().filter(state =>
      state.checked()
    ).length;

    const indeterminateCount = this.childStates().filter(state =>
      state.indeterminate()
    ).length;

    if (checkedCount === total || checkedCount === 0) {
      this.indeterminate.set(false);
      this.checked.set(checkedCount === total);
    }

    this.indeterminate.set(
      indeterminateCount > 0 || (checkedCount > 0 && checkedCount < total)
    );
  });

  public ngOnInit(): void {
    this.ctx.registerNode(this.node().id, this.hasChildren);
  }
}
