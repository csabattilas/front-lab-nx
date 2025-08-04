import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  linkedSignal,
  signal,
  TemplateRef,
  Type,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  CHECKBOX_TREE_CONTEXT,
  CheckboxLike,
  CheckBoxTitleTemplateContext,
  CheckboxTreeContext,
  CheckboxTreeNode,
  ChildState,
} from './model';
import { projectableNodesFrom } from './projectable-node-from';
import { NgTemplateOutlet, NgComponentOutlet } from '@angular/common';
import { useRenderedSignal } from './use-rendered';

@Component({
  selector: 'fl-form-checkbox-tree-node',
  styleUrl: './checkbox-tree-node.css',
  templateUrl: './checkbox-tree-node.html',
  imports: [NgTemplateOutlet, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeNodeComponent {
  public node = input.required<CheckboxTreeNode>();
  public expanded = input<boolean>(false);
  public depth = input<number>(0);
  public checkboxComponent = input<Type<CheckboxLike>>();

  /**
   * Signal representing the checked state of the node.
   * It is computed based on the
   *  `writeValueCheckedSignal`,
   *  `childrenBasedCheckedSignal` and
   *  `inheritedCheckedSignal`.
   */
  public readonly checked = linkedSignal<boolean>(
    () => this.fromValueCheckedSignal() ?? this.childrenBasedCheckedSignal() ?? this.parentCheckedSignal()
  );

  /**
   * Signal representing the indeterminate state of the node.
   * It is computed based on the children of the node.
   */
  public readonly indeterminate = linkedSignal((): boolean => {
    const checkedCount = this.childrenState()?.filter(c => c.checked).length ?? 0;
    const indeterminateCount = this.childrenState()?.filter(c => c.indeterminate).length ?? 0;

    return indeterminateCount > 0 || (checkedCount > 0 && checkedCount < this.numberOfChildren());
  }).asReadonly();

  /**
   * Signal representing the expanded state of the node.
   * It is computed based on the expanded input and
   * the indeterminate and checked signals.
   */
  public readonly expandedSignal = linkedSignal<boolean>(() => {
    return this.expanded() || this.indeterminate() || this.checked();
  });

  /**
   * Signal to determine if the node has children (not leaf node).
   */
  public readonly numberOfChildren = computed<number>(() => this.node().items?.length ?? 0);

  /**
   * Signal representing the title node of the checkbox tree node.
   */
  public readonly titleNode = computed(() =>
    projectableNodesFrom<CheckBoxTitleTemplateContext>(
      untracked(() => this.titleTemplate()),
      {
        node: this.node(),
        toggleExpanded: this.toggleExpandedBound,
        numberOfChildren: this.numberOfChildren(),
      }
    )
  );

  /**
   * Bound toggle expanded function.
   */
  public toggleExpandedBound = this.toggleExpanded.bind(this);

  /**
   * Injected checkbox tree context. Will be provided by the checkbox tree control in order to collect the checked leafs.
   */
  private readonly ctx: CheckboxTreeContext = inject(CHECKBOX_TREE_CONTEXT);

  /**
   * Signal to determine if the node is rendered.
   */
  private readonly isRendered = useRenderedSignal();

  /**
   * View children of the checkbox tree node.
   */
  private readonly children = viewChildren(CheckboxTreeNodeComponent);

  /**
   * Component outlet of the checkbox.
   */
  private readonly checkboxOutlet = viewChild<NgComponentOutlet<CheckboxLike>>(NgComponentOutlet);

  /**
   * Title template of the checkbox tree node.
   */
  private readonly titleTemplate = viewChild.required<TemplateRef<CheckBoxTitleTemplateContext>>('titleTemplate');

  /**
   * Signal representing the checked state based on the children.
   */
  private readonly childrenState = computed<ChildState[] | null>(() => {
    // only return children state if the node is rendered and has children
    if (!this.isRendered() || !this.numberOfChildren()) {
      return null;
    }

    return this.children().map(c => {
      return {
        checked: c.checked(),
        indeterminate: c.indeterminate(),
      };
    });
  });

  /**
   * Signal representing the checked state based on the parent node.
   */
  private readonly parentCheckedSignal = signal(false);

  /**
   * Signal representing the checked state based on the writeValue from the checkbox tree control.
   */
  private readonly fromValueCheckedSignal = linkedSignal<boolean | null>((): boolean | null => {
    if (!this.isRendered() || !!this.numberOfChildren()) {
      return null;
    }

    return this.ctx.selectedItemsIds().has(this.node().id);
  });

  /**
   * Signal representing the checked state based on the children
   */
  private readonly childrenBasedCheckedSignal = linkedSignal<boolean | null>((): boolean | null => {
    const checkedCount = this.childrenState()?.filter(({ checked }) => checked).length;

    if ((checkedCount === this.numberOfChildren() && checkedCount > 0) || checkedCount === 0) {
      return checkedCount === this.numberOfChildren() && checkedCount > 0;
    }

    return this.node().checked ?? null;
  });

  constructor() {
    /**
     * Effect to update the selected items in the context
     */
    effect(() => {
      if (this.numberOfChildren()) {
        return;
      }
      if (this.checked()) {
        this.ctx.selectItem(this.node().id);
      } else {
        this.ctx.unselectItem(this.node().id);
      }
    });

    /**
     * Effect to update the checked state of the node
     */
    effect(() => {
      this.node().checked = this.checked();
    });

    /**
     * Effect to hoock the toggle event to the checkbox component
     */
    effect(() => {
      const checkboxOutlet = this.checkboxOutlet();

      if (checkboxOutlet) {
        const instance = checkboxOutlet.componentInstance;

        if (!instance) {
          return;
        }

        if (typeof instance.registerOnChange === 'function') {
          instance.registerOnChange((v?: Event | boolean | null) => this.onToggle(v));
        } else if ('change' in instance) {
          (instance.change as EventEmitter<boolean>).subscribe((v: boolean) => this.onToggle(v));
        }
      }
    });
  }

  @Input()
  set parentChecked(value: boolean) {
    this.childrenBasedCheckedSignal.set(null);
    this.fromValueCheckedSignal.set(null);
    this.parentCheckedSignal.set(value);
  }

  /**
   * Handler for the toggle event.
   */
  public onToggle(event?: Event | boolean | null): void {
    if (event === null || event === undefined) {
      return;
    }

    const isChecked = event instanceof Event ? (event.target as HTMLInputElement).checked : event;
    this.checked.set(isChecked);

    this.expandedSignal.set(false);
  }

  /**
   * Handler for the toggle expanded event.
   */
  public toggleExpanded(): void {
    this.expandedSignal.update(value => !value);
  }
}
