import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECKBOX_TREE_CONTEXT, CheckboxLike, CheckboxTreeNode } from './model';
import { CheckboxTreeNodeComponent } from './checkbox-tree-node';
import { CheckboxComponent } from '../checkbox/checkbox';

// Mock context service
const mockContextService = {
  selectedItemsIds: signal(new Set<number>()),
  selectItem: vi.fn(),
  unselectItem: vi.fn(),
};

// Mock checkbox component
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

@Component({
  selector: 'fl-form-test-host',
  template: `
    <fl-form-checkbox-tree-node
      [node]="node"
      [expanded]="expanded"
      [depth]="depth"
      [parentChecked]="inheritedChecked"
      [checkboxComponent]="checkboxComponent"
    ></fl-form-checkbox-tree-node>
  `,
  standalone: true,
  imports: [CheckboxTreeNodeComponent],
})
class TestHostComponent {
  @Input() public node: CheckboxTreeNode = { id: 1, title: 'Test Node', items: [] };
  @Input() public expanded = false;
  @Input() public depth = 0;
  @Input() public inheritedChecked = false;
  @Input() public checkboxComponent = MockCheckboxComponent;
}

describe('CheckboxTreeNodeComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: CheckboxTreeNodeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CheckboxComponent, MockCheckboxComponent],
      providers: [{ provide: CHECKBOX_TREE_CONTEXT, useValue: mockContextService }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    component = hostFixture.debugElement.query(By.directive(CheckboxTreeNodeComponent)).componentInstance;

    // Reset mocks
    vi.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Node without children', () => {
    beforeEach(() => {
      hostComponent.node = { id: 1, title: 'Leaf Node' };
      hostFixture.detectChanges();
    });

    it('should detect node has no children', () => {
      expect(component.numberOfChildren()).toBe(0);
    });

    it('should display node title', () => {
      // Wait for ngComponentOutlet to render
      hostFixture.detectChanges();

      // Find the mock checkbox component
      const mockCheckbox = hostFixture.debugElement.query(By.directive(MockCheckboxComponent));
      expect(mockCheckbox).toBeTruthy();

      // Check the title span inside the mock checkbox
      const titleElement = mockCheckbox.query(By.css('.title'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain('Leaf Node');
    });

    it('should not have has-children class', () => {
      // Wait for ngComponentOutlet to render
      hostFixture.detectChanges();

      // Find the mock checkbox component
      const mockCheckbox = hostFixture.debugElement.query(By.directive(MockCheckboxComponent));
      expect(mockCheckbox).toBeTruthy();

      // Check the title span inside the mock checkbox
      const titleElement = mockCheckbox.query(By.css('.title'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.classList.contains('has-children')).toBe(false);
    });

    it('should not show expand/collapse chevron', () => {
      const chevron = hostFixture.debugElement.query(By.css('.chevron'));
      expect(chevron).toBeNull();
    });

    it('should add item to selection when checked', () => {
      // Directly call onToggle with boolean value
      component.onToggle(true);
      hostFixture.detectChanges();

      expect(mockContextService.selectItem).toHaveBeenCalledWith(1);
    });

    it('should remove item from selection when unchecked', () => {
      // First check it
      component.onToggle(true);

      // Reset mock
      vi.resetAllMocks();

      // Then uncheck it
      component.onToggle(false);

      expect(mockContextService.unselectItem).toHaveBeenCalledWith(1);
    });
  });

  describe('Node with children', () => {
    beforeEach(() => {
      hostComponent.node = {
        id: 1,
        title: 'Parent Node',
        items: [
          { id: 2, title: 'Child 1' },
          { id: 3, title: 'Child 2' },
        ],
      };
      hostFixture.detectChanges();
    });

    it('should detect node has children', () => {
      expect(component.numberOfChildren()).toBe(2);
    });

    it('should have has-children class', () => {
      // Wait for ngComponentOutlet to render
      hostFixture.detectChanges();

      // Find the mock checkbox component
      const mockCheckbox = hostFixture.debugElement.query(By.directive(MockCheckboxComponent));
      expect(mockCheckbox).toBeTruthy();

      // Check if the mock checkbox component has the hasChildren input set
      const mockCheckboxInstance = mockCheckbox.componentInstance as MockCheckboxComponent;
      expect(mockCheckboxInstance.hasChildren).toBe(true);
    });

    it('should toggle expanded state when clicked', () => {
      const initialState = component.expandedSignal();
      component.toggleExpanded();
      hostFixture.detectChanges();
      expect(component.expandedSignal()).not.toEqual(initialState);
    });

    it('should update expanded state when checked', () => {
      // Set expanded to false initially
      component.expandedSignal.set(false);
      hostFixture.detectChanges();

      // Check the checkbox
      component.onToggle(true);
      hostFixture.detectChanges();

      // Expanded should be set to false when checked
      expect(component.expandedSignal()).toBe(false);
    });
  });

  describe('parentChecked behavior', () => {
    it('should update parentCheckedSignal when parentChecked is set', () => {
      hostComponent.inheritedChecked = true;
      hostFixture.detectChanges();

      // Access the signal via the public getter
      expect(component['parentCheckedSignal']()).toBe(true);
    });
  });
});
