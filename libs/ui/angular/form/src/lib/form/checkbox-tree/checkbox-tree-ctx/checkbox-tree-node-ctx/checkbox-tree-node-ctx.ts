import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  OnInit,
  signal,
  TemplateRef,
  Type,
  viewChild,
} from '@angular/core';
import { CheckboxTreeSelectionContextService } from '../checkbox-tree-context';
import { CheckboxLike } from '../../model/model';
import { CheckboxTreeNode } from '../../model/model';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { projectableNodesFrom } from '../../../utils/projectable-node-from';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fl-form-checkbox-tree-node-ctx',
  templateUrl: './checkbox-tree-node-ctx.html',
  styleUrl: './checkbox-tree-node-ctx.scss',
  imports: [NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeNodeCtxComponent implements OnInit {
  public node = input.required<CheckboxTreeNode>();
  public inheritedChecked = input<boolean>(false);
  public expanded = input<boolean>(false);
  public depth = input<number>(0);
  public checkboxComponent = input<Type<CheckboxLike>>();

  public readonly expandedSignal = linkedSignal<boolean>(() => this.expanded());

  public readonly checked = linkedSignal<boolean>(() => {
    return this.inheritedChecked();
  });

  public readonly indeterminate = signal(false);

  public readonly titleNode = computed(() => {
    return projectableNodesFrom(this.titleTemplate(), { node: this.node() });
  });

  private readonly ctx = inject(CheckboxTreeSelectionContextService);

  private readonly titleTemplate =
    viewChild.required<TemplateRef<{ node: CheckboxTreeNode }>>(
      'titleTemplate'
    );

  private readonly checkboxOutlet =
    viewChild<NgComponentOutlet>(NgComponentOutlet);

  // @ts-expect-error: TS6133
  private readonly checkboxCreateEffect = effect(() => {
    const checkboxOutlet = this.checkboxOutlet();

    if (checkboxOutlet) {
      const instance = checkboxOutlet.componentInstance;
      if (!instance) {
        return;
      }
      if (typeof instance.registerOnChange === 'function') {
        instance.registerOnChange((v: boolean) => this.onToggle(v));
      } else if ('change' in instance) {
        (instance.change as EventEmitter<boolean>).subscribe((v: boolean) =>
          this.onToggle(v)
        );
      }
    }
  });

  private readonly childStates = computed(() => {
    if (!this.hasChildren) return [];

    return (
      this.node().items?.map(item => {
        return this.ctx.registerNode(item.id);
      }) ?? []
    );
  });

  // @ts-expect-error: TS6133
  private readonly writeValueUpdateEffect = effect(() => {
    const writeValueChecked = this.ctx
      .getNode(this.node().id)
      ?.writeValueChecked();
    this.checked.set(writeValueChecked ?? false);
  });

  // @ts-expect-error: TS6133
  private readonly updatedChecked = effect(() => {
    this.ctx.updateNodeCheckedSelection(this.node().id, this.checked());

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

  public onToggle(event: Event | boolean): void {
    const isChecked =
      event instanceof Event
        ? (event.target as HTMLInputElement).checked
        : event;
    this.checked.set(isChecked);
  }

  public toggleExpanded(): void {
    if (!this.hasChildren) {
      return;
    }
    this.expandedSignal.update(expanded => !expanded);
  }

  public ngOnInit(): void {
    this.ctx.registerNode(this.node().id);
  }
}
