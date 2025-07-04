import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
  computed,
  linkedSignal,
  input,
} from '@angular/core';
import { TreeSelectionContextService } from '../folder-tree-context';
import { CheckboxComponent } from '../../../checkbox/checkbox';
import { TreeNode } from '../../model/folder-tree-model';

@Component({
  selector: 'fl-form-folder-tree-node-ctx',
  imports: [CheckboxComponent],
  templateUrl: './folder-tree-node-ctx.html',
  styleUrl: './folder-tree-node-ctx.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeNodeCtxComponent implements OnInit {
  public node = input.required<TreeNode>();
  public inheritedChecked = input<boolean>(false);
  public expanded = input<boolean>(false);
  public depth = input<number>(0);

  public readonly expandedSignal = linkedSignal<boolean>(() => this.expanded());

  public readonly checked = linkedSignal<boolean>(() => {
    return this.inheritedChecked();
  });

  public readonly indeterminate = signal(false);

  private readonly ctx = inject(TreeSelectionContextService);

  private readonly childStates = computed(() => {
    if (!this.hasChildren) return [];

    return (
      this.node().items?.map(item => {
        return this.ctx.registerNode(item.id, !!item.items?.length);
      }) ?? []
    );
  });

  // @ts-expect-error: TS6133
  private readonly writeValueUpdateEffect = effect(() => {
    const writeValueChecked = this.ctx
      .getNode(this.node().id, this.hasChildren)
      ?.writeValueChecked();
    this.checked.set(writeValueChecked ?? false);
  });

  // @ts-expect-error: TS6133
  private readonly updatedChecked = effect(() => {
    this.ctx.updateNodeCheckedSelection(
      this.node().id,
      this.checked(),
      this.hasChildren
    );

    if (this.checked() && !this.hasChildren) {
      this.ctx.addSelectedItems(this.node().id);
    }
    if (!this.checked() && !this.hasChildren) {
      this.ctx.removeSelectedItems(this.node().id);
    }

    if (this.checked() && this.hasChildren) {
      this.expandedSignal.set(true);
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

  // @ts-expect-error: TS6133
  private readonly updatedIntermediate = effect(() => {
    this.ctx.updateIndeterminateNodeSelection(
      this.node().id,
      this.indeterminate()
    );

    if (this.indeterminate()) {
      this.expandedSignal.set(true);
    }
  });

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

  public ngOnInit(): void {
    this.ctx.registerNode(this.node().id, this.hasChildren);
  }
}
