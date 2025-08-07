import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, inputBinding, Output, signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECKBOX_TREE_CONTEXT, CheckboxLike, CheckboxTreeNode } from './model';
import { CheckboxTreeNodeComponent } from './checkbox-tree-node';

@Component({
  selector: 'fl-form-mock-checkbox',
  template: `
    <div class="mock-checkbox">
      <input type="checkbox" [checked]="checked" [indeterminate]="indeterminate" (change)="onChange($event)" />
      <span [class.has-children]="hasChildren" class="title">{{ title }}</span>
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
})
class MockCheckboxComponent implements CheckboxLike {
  @Input() public checked = false;
  @Input() public indeterminate = false;
  @Input() public title = '';
  @Input() public hasChildren = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public change = new EventEmitter<boolean>();

  public onChange(event: Event): void {
    this.change.emit((event.target as HTMLInputElement).checked);
  }
}

describe('CheckboxTreeNodeComponent', () => {
  let component: CheckboxTreeNodeComponent;
  let fixture: ComponentFixture<CheckboxTreeNodeComponent>;
  let mockContextService: {
    valueSignal: ReturnType<typeof signal<Set<number>>>;
    updateValue: ReturnType<typeof vi.fn>;
  };

  const defaultNode = signal<CheckboxTreeNode>({ id: 1, title: 'Test Node', items: [] });
  const initialExpanded = signal(false);
  const depth = signal(0);
  const parentChecked = signal(false);
  const checkboxComponent = signal(MockCheckboxComponent);

  beforeEach(async () => {
    mockContextService = {
      valueSignal: signal(new Set<number>()),
      updateValue: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CheckboxTreeNodeComponent, MockCheckboxComponent],
      providers: [{ provide: CHECKBOX_TREE_CONTEXT, useValue: mockContextService }],
    }).compileComponents();
  });

  describe('Node without children', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxTreeNodeComponent, {
        bindings: [
          inputBinding('node', defaultNode),
          inputBinding('initialExpanded', initialExpanded),
          inputBinding('depth', depth),
          inputBinding('parentChecked', parentChecked),
          inputBinding('checkboxComponent', checkboxComponent),
        ],
      });
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should detect node has no children', () => {
      expect(component.numberOfChildren()).toBe(0);
    });

    it('should add item to selection when checked', () => {
      component.onToggle(true);
      fixture.detectChanges();

      expect(mockContextService.updateValue).toHaveBeenCalledWith(1, true);
    });

    it('should remove item from selection when unchecked', () => {
      component.onToggle(false);
      fixture.detectChanges();

      expect(mockContextService.updateValue).toHaveBeenCalledWith(1, false);
    });

    it('should update checked state when context valueSignal changes', () => {
      expect(component['checked']()).toBe(false);

      mockContextService.valueSignal.update(set => {
        set.add(1);
        return new Set(set);
      });
      fixture.detectChanges();

      expect(component['checked']()).toBe(true);
    });
  });

  describe('Node with children', () => {
    beforeEach(async () => {
      const nodeWithChildren = signal<CheckboxTreeNode>({
        id: 1,
        title: 'Parent Node',
        items: [
          { id: 2, title: 'Child 1' },
          { id: 3, title: 'Child 2' },
        ],
      });

      fixture = TestBed.createComponent(CheckboxTreeNodeComponent, {
        bindings: [
          inputBinding('node', nodeWithChildren),
          inputBinding('initialExpanded', initialExpanded),
          inputBinding('depth', depth),
          inputBinding('parentChecked', parentChecked),
          inputBinding('checkboxComponent', checkboxComponent),
        ],
      });
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should detect node has children', () => {
      expect(component.numberOfChildren()).toBe(2);
    });

    describe('Expanded state', () => {
      it('should toggle expanded state when clicked', () => {
        const initialState = component['expanded']();
        component.toggleExpanded();
        fixture.detectChanges();
        expect(component['expanded']()).not.toEqual(initialState);
      });

      it('should update expanded state when checked', () => {
        component['expanded'].set(false);
        fixture.detectChanges();

        component.onToggle(true);
        fixture.detectChanges();

        expect(component['expandedSignal']()).toBe(true);
      });

      it('should initialize expanded state from initialExpanded input', () => {
        initialExpanded.set(true);
        fixture.detectChanges();

        expect(component['expanded']()).toBe(true);
      });

      it('should expand when indeterminate', () => {
        mockContextService.valueSignal.update(set => {
          const newSet = new Set(set);
          newSet.add(2);
          return newSet;
        });

        fixture.detectChanges();

        expect(component['indeterminate']()).toBe(true);
        expect(component['expanded']()).toBe(true);
      });
    });

    describe('parentChecked', () => {
      beforeEach(() => {
        parentChecked.set(false);
        fixture.detectChanges();
      });

      it('should update parentCheckedSignal when parentChecked is set', () => {
        parentChecked.set(true);
        fixture.detectChanges();

        expect(component['parentCheckedSignal']()).toBe(true);
      });
    });

    describe('Signal computation and dependencies', () => {
      describe('checked state computation', () => {
        beforeEach(() => {
          mockContextService.valueSignal.set(new Set());
          parentChecked.set(false);
          component['resetCheckedState']();
          fixture.detectChanges();
        });

        it('should be false when no signals are set', () => {
          expect(component['checked']()).toBe(false);
        });

        describe('toggleChecked signal', () => {
          it('should be checked when toggleChecked is true', () => {
            component['toggleChecked'].set(true);
            fixture.detectChanges();
            expect(component['checked']()).toBe(true);
          });

          it('should not be checked when toggleChecked is false', () => {
            component['toggleChecked'].set(false);
            fixture.detectChanges();
            expect(component['checked']()).toBe(false);
          });
        });

        describe('fromValueCheckedSignal', () => {
          it('should be checked when all child node ids are in context value', () => {
            mockContextService.valueSignal.update(set => {
              set.add(2);
              set.add(3);
              return new Set(set);
            });
            fixture.detectChanges();
            expect(component['checked']()).toBe(true);
          });

          it('should not be checked when node id is not in context value', () => {
            mockContextService.valueSignal.update(() => new Set());
            fixture.detectChanges();
            expect(component['checked']()).toBe(false);
          });
        });

        describe('parentCheckedSignal', () => {
          it('should be checked when parent is checked', () => {
            parentChecked.set(true);
            fixture.detectChanges();
            expect(component['checked']()).toBe(true);
          });

          it('should not be checked when parent is not checked', () => {
            parentChecked.set(false);
            fixture.detectChanges();
            expect(component['checked']()).toBe(false);
          });
        });

        describe('childrenBasedCheckedSignal', () => {
          beforeEach(() => {
            defaultNode.set({
              id: 1,
              title: 'Parent Node',
              items: [
                { id: 2, title: 'Child 1' },
                { id: 3, title: 'Child 2' },
              ],
            });
            fixture.detectChanges();
          });

          it('should be checked when all children are checked', () => {
            mockContextService.valueSignal.update(set => {
              const newSet = new Set(set);
              newSet.add(2);
              newSet.add(3);
              return new Set(newSet);
            });
            fixture.detectChanges();
            expect(component['checked']()).toBe(true);
          });

          it('should not be checked when no children are checked', () => {
            mockContextService.valueSignal.update(() => new Set());
            fixture.detectChanges();
            expect(component['checked']()).toBe(false);
          });

          it('should not be checked when only some children are checked', () => {
            mockContextService.valueSignal.update(set => {
              const newSet = new Set(set);
              newSet.add(2);
              return new Set(newSet);
            });
            fixture.detectChanges();
            expect(component['checked']()).toBe(false);
          });
        });

        describe('signal precedence', () => {
          it('should prioritize childrenBasedCheckedSignal over other signals', () => {
            component['toggleChecked'].set(false);
            component['parentCheckedSignal'].set(false);
            mockContextService.valueSignal.set(new Set([2, 3]));
            fixture.detectChanges();

            expect(component['checked']()).toBe(true);

            mockContextService.valueSignal.set(new Set());
            fixture.detectChanges();

            expect(component['checked']()).toBe(false);
          });
        });
      });

      it('should compute indeterminate state correctly', () => {
        expect(component['indeterminate']()).toBe(false);

        mockContextService.valueSignal.set(new Set([2]));
        fixture.detectChanges();

        expect(component['indeterminate']()).toBe(true);

        mockContextService.valueSignal.set(new Set([2, 3]));
        fixture.detectChanges();

        expect(component['indeterminate']()).toBe(false);
      });

      it('should reset checked state correctly', () => {
        component.onToggle(true);
        expect(component['toggleChecked']()).toBe(true);

        component['resetCheckedState']();

        expect(component['toggleChecked']()).toBe(null);
      });
    });

    describe('Edge cases', () => {
      beforeEach(() => {
        mockContextService.valueSignal.set(new Set());
        parentChecked.set(false);
        defaultNode.set({
          id: 1,
          title: 'Parent Node',
          items: [],
        });
        fixture = TestBed.createComponent(CheckboxTreeNodeComponent, {
          bindings: [
            inputBinding('node', defaultNode),
            inputBinding('initialExpanded', initialExpanded),
            inputBinding('depth', depth),
            inputBinding('parentChecked', parentChecked),
            inputBinding('checkboxComponent', checkboxComponent),
          ],
        });

        component = fixture.componentInstance;

        fixture.detectChanges();
      });

      it('should handle undefined items array', () => {
        defaultNode.set({ id: 1, title: 'Node without items property' });
        fixture.detectChanges();

        expect(component.numberOfChildren()).toBe(0);
      });

      it('should handle empty items array', () => {
        expect(component.numberOfChildren()).toBe(0);
      });

      it('should handle rapid toggle changes', () => {
        vi.resetAllMocks();
        component.onToggle(true);
        fixture.detectChanges();
        component.onToggle(false);
        fixture.detectChanges();
        component.onToggle(true);
        fixture.detectChanges();

        expect(component['toggleChecked']()).toBe(true);

        expect(mockContextService.updateValue).toHaveBeenCalledTimes(3);
        expect(mockContextService.updateValue).toHaveBeenCalledWith(1, true);
      });
    });

    describe('Custom checkbox component', () => {
      @Component({
        selector: 'fl-form-custom-checkbox',
        template: '<div>Custom</div>',
        standalone: true,
      })
      class CustomCheckboxComponent implements CheckboxLike {
        @Input() public checked = false;
        @Input() public indeterminate = false;
        // eslint-disable-next-line @angular-eslint/no-output-native
        @Output() public change = new EventEmitter<boolean>();
      }

      beforeEach(() => {
        fixture = TestBed.createComponent(CheckboxTreeNodeComponent, {
          bindings: [
            inputBinding('node', defaultNode),
            inputBinding('initialExpanded', initialExpanded),
            inputBinding('depth', depth),
            inputBinding('parentChecked', parentChecked),
            inputBinding('checkboxComponent', signal(CustomCheckboxComponent)),
          ],
        });

        fixture.detectChanges();
      });

      it('should handle custom checkbox component', () => {
        expect(fixture.componentInstance).toBeTruthy();
      });

      it('should handle change events from custom checkbox component', () => {
        const checkboxDebugEl = fixture.debugElement.query(
          el => el.componentInstance instanceof CustomCheckboxComponent
        );
        const checkboxInstance = checkboxDebugEl.componentInstance as CustomCheckboxComponent;

        expect(fixture.componentInstance['checked']()).toBe(false);
        expect(mockContextService.valueSignal().has(1)).toBe(false);

        checkboxInstance.change.emit(true);
        fixture.detectChanges();

        expect(mockContextService.updateValue).toHaveBeenCalledWith(1, true);
        expect(fixture.componentInstance['toggleChecked']()).toBe(true);

        vi.clearAllMocks();

        checkboxInstance.change.emit(false);
        fixture.detectChanges();

        expect(mockContextService.updateValue).toHaveBeenCalledWith(1, false);
        expect(fixture.componentInstance['toggleChecked']()).toBe(false);
      });
    });
  });
});
