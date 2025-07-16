import {
  ChangeDetectionStrategy,
  Component,
  createComponent,
  effect,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  inject,
  Input,
  input,
  inputBinding,
  linkedSignal,
  signal,
  TemplateRef,
  Type,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  CHECKBOX_TREE_CONTEXT,
  CheckboxLike,
  CheckBoxTitleTemplateContext,
  CheckboxTreeContext,
  CheckboxTreeNode,
} from '../../model/model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { projectableNodesFrom } from '../../../utils/projectable-node-from';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fl-form-checkbox-tree-node',
  styleUrl: './checkbox-tree-node.scss',
  templateUrl: './checkbox-tree-node.html',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeNodeComponent {
  public node = input<CheckboxTreeNode>();
  public expanded = input<boolean>(false);
  public depth = input<number>(0);
  public checkboxComponent = input<Type<CheckboxLike>>();

  public readonly expandedSignal = linkedSignal<boolean>(
    () => this.expandedInputSignal() || this.indeterminate() || this.checked()
  );

  public readonly checked = linkedSignal<boolean>(() => {
    const writeValueChecked = this.writeValueCheckedSignal();
    const childrenBasedChecked = this.childrenBasedCheckedSignal();
    const inheritedChecked = this.inheritedCheckedSignal();

    return writeValueChecked ?? childrenBasedChecked ?? inheritedChecked;
  });

  public readonly indeterminate = linkedSignal((): boolean => {
    const childrenChecked = this.children()?.map(
      (c: CheckboxTreeNodeComponent) => ({
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

  private readonly expandedInputSignal = linkedSignal<boolean>(() =>
    this.expanded()
  );

  private readonly ctx: CheckboxTreeContext = inject(CHECKBOX_TREE_CONTEXT);

  private readonly children = viewChildren(CheckboxTreeNodeComponent);

  private readonly titleTemplate =
    viewChild.required<TemplateRef<CheckBoxTitleTemplateContext>>(
      'titleTemplate'
    );

  private readonly checkboxHost = viewChild<ElementRef, ViewContainerRef>(
    'checkboxHost',
    { read: ViewContainerRef }
  );

  private readonly environmentInjector = inject(EnvironmentInjector);

  // @ts-expect-error: TS6133
  private readonly checkboxCreateEffect = effect(() => {
    const componentType = this.checkboxComponent();
    const hostElement = this.checkboxHost();
    const titleTemplate = this.titleTemplate();
    const node = this.node();

    if (hostElement && componentType && titleTemplate && node) {
      hostElement.clear();

      const bindings = [
        inputBinding('checked', this.checked),
        inputBinding('indeterminate', this.indeterminate),
      ];

      const componentRef = createComponent(componentType, {
        environmentInjector: this.environmentInjector,
        bindings,
        projectableNodes: [
          projectableNodesFrom(titleTemplate, {
            node,
            toggleExpanded: this.toggleExpanded.bind(this),
            hasChildren: this.hasChildren,
          }),
        ],
      });

      const accessors = componentRef.injector.get<ControlValueAccessor[]>(
        NG_VALUE_ACCESSOR,
        []
      );
      if (accessors.length) {
        accessors[0].registerOnChange((v: boolean) => this.onToggle(v));
      } else if ('change' in componentRef.instance) {
        (componentRef.instance.change as EventEmitter<boolean>).subscribe(
          (v: boolean) => this.onToggle(v)
        );
      }

      hostElement.insert(componentRef.hostView);
    }
  });

  // collect the checked state from the writeValue from the checkbox tree control.
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
        ?.map((c: CheckboxTreeNodeComponent) => {
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

  public onToggle(event: Event | boolean): void {
    const isChecked =
      event instanceof Event
        ? (event.target as HTMLInputElement).checked
        : event;
    this.checked.set(isChecked);

    this.expandedInputSignal.set(false);
  }

  public toggleExpanded(): void {
    this.expandedSignal.update(value => !value);
    this.expandedInputSignal.set(false);
  }
}
