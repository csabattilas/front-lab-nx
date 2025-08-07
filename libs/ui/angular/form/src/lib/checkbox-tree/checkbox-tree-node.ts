import {
  afterNextRender,
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
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fl-form-checkbox-tree-node',
  styleUrl: './checkbox-tree-node.css',
  templateUrl: './checkbox-tree-node.html',
  imports: [NgTemplateOutlet, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeNodeComponent {
  // We go with required node.
  // optional node would remove the need for the afterNextRender,
  // but the node data needs to be there in order the component exists.
  // Also, we would not have to check for undefined in the template and in the code.
  public node = input.required<CheckboxTreeNode>();
  public initialExpanded = input<boolean>(false);
  public depth = input<number>(0);
  public checkboxComponent = input<Type<CheckboxLike>>();

  /**
   * Signal to determine if the node has children (not leaf node).
   */
  public readonly numberOfChildren = computed<number>(() => this.node().items?.length ?? 0);

  /**
   * Signal representing the checked state of the node.
   * It is computed based on the
   *  `writeValueCheckedSignal`,
   *  `childrenBasedCheckedSignal`,
   *  `parentCheckedSignal` and
   *  `toggleChecked`.
   */
  protected readonly checked = computed<boolean>(() => {
    return (
      this.childrenBasedCheckedSignal() ??
      this.fromValueCheckedSignal() ??
      this.toggleChecked() ??
      this.parentCheckedSignal() ??
      false
    );
  });

  /**
   * Signal representing the indeterminate state of the node.
   * It is computed based on the children of the node.
   */
  protected readonly indeterminate = computed(() => {
    const checkedCount = this.childrenState()?.filter(c => c.checked).length ?? 0;
    const indeterminateCount = this.childrenState()?.filter(c => c.indeterminate).length ?? 0;

    return indeterminateCount > 0 || (checkedCount > 0 && checkedCount < this.numberOfChildren());
  });

  /**
   * Signal representing the expanded state of the node.
   * It is computed based on the expanded input and
   * the indeterminate and checked signals.
   */
  protected readonly expanded = linkedSignal<boolean>(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    () => this.expandedSignal() || this.initialExpanded() || this.indeterminate()
  );

  /**
   * Signal representing the title node of the checkbox tree node.
   */
  protected readonly titleNode = computed(() =>
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
  protected readonly toggleExpandedBound = this.toggleExpanded.bind(this);

  // privates

  /**
   * Signal representing the checked state based on the parent node.
   */
  private readonly parentCheckedSignal = signal<boolean | null>(null);

  /**
   * Signal representing the checked state based on the writeValue from the checkbox tree control.
   */
  private readonly fromValueCheckedSignal = linkedSignal<boolean | null>(() => {
    if (this.isRendered() && !this.numberOfChildren()) {
      return this.ctx.valueSignal().has(this.node().id);
    }

    return null;
  });

  /**
   * Helper signal representing the state of the children.
   *
   * It is computed based on the children of the node.
   *
   * It returns an array of objects with checked and indeterminate states
   * for each child only if the component is rendered, and it has children.
   */
  private readonly childrenState = computed((): ChildState[] | undefined =>
    // only return children state if the node is rendered and has children
    this.isRendered() && !!this.numberOfChildren()
      ? this.children().map(c => ({
          checked: c.checked(),
          indeterminate: c.indeterminate(),
        }))
      : undefined
  );

  /**
   * Signal representing the checked state based on the children
   */
  private readonly childrenBasedCheckedSignal = linkedSignal((): boolean | null => {
    const checkedCount = this.childrenState()?.filter(({ checked }) => checked).length;

    if ((checkedCount === this.numberOfChildren() && checkedCount > 0) || checkedCount === 0) {
      return checkedCount === this.numberOfChildren() && checkedCount > 0;
    }

    return null;
  });

  /**
   * Injected checkbox tree context.
   * Will be provided by the checkbox tree control in order to collect the checked leafs as its value.
   */
  private readonly ctx: CheckboxTreeContext = inject(CHECKBOX_TREE_CONTEXT);

  /**
   * Signal to determine if the node is rendered.
   */
  private readonly isRendered = signal(false);

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
   * Define signals which will control the checked state of the node.
   *
   * There are 4 possible sources for the checked state:
   * 1. `fromValueCheckedSignal` - based on the writeValue from the checkbox tree control.
   * 2. `childrenBasedCheckedSignal` - based on the children state.
   * 3. `parentCheckedSignal` - based on the parent node.
   * 4. `toggleChecked` - based on the toggle event from the checkbox component
   *
   * When we imperatively toggle the checkbox, either via direct toggle interaction, either via indirect parent based toggle,
   * we unset (set to null) the other signals to mimic the imperative nature of the set.
   *
   */

  /**
   * Signal representing the checked state based on the children.
   */
  private readonly toggleChecked = signal<boolean | null>(null);

  /**
   * Signal representing the expanded state of the node.
   */
  private readonly expandedSignal = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isRendered.set(true);
    });

    /**
     * Side effect to update the selected items in the context
     */
    effect(() => {
      if (!this.numberOfChildren()) {
        this.ctx.updateValue(this.node().id, this.checked());
      }
    });

    /**
     * Side effect to hook the toggle event to the generic checkbox component
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
    this.resetCheckedState();

    this.parentCheckedSignal.set(value);
  }

  /**
   * Handler for the toggle event.
   */
  public onToggle(event?: Event | boolean | null): void {
    if (event === null || event === undefined) {
      return;
    }
    this.resetCheckedState();

    const isChecked = event instanceof Event ? (event.target as HTMLInputElement).checked : event;

    this.toggleChecked.set(isChecked);

    this.updateExpandedState(isChecked);
  }

  /**
   * Expand via label click.
   */
  public toggleExpanded(): void {
    this.expanded.update(value => !value);
  }

  /**
   * Reset internal checked states.
   * @private
   */
  private resetCheckedState(): void {
    this.toggleChecked.set(null);
    this.childrenBasedCheckedSignal.set(null);
    this.fromValueCheckedSignal.set(null);
    this.parentCheckedSignal.set(null);
  }

  /**
   * Expand logic via checked state.
   * @param isChecked
   */
  private updateExpandedState(isChecked: boolean): void {
    if (this.expanded() && !this.indeterminate()) {
      return;
    }

    this.expandedSignal.set(isChecked);
  }
}
