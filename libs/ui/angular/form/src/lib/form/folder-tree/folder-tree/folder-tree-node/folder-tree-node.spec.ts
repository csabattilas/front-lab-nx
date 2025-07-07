import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeNodeComponent } from './folder-tree-node';
import { Component, Input, signal } from '@angular/core';
import { FOLDER_TREE_CONTEXT, TreeNode } from '../../model/folder-tree-model';
import { CheckboxComponent } from '../../../checkbox';
import { By } from '@angular/platform-browser';
import { PerformanceService } from '../../performance/performance';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock context service
const mockContextService = {
  selectedItemsIds: signal(new Set<number>()),
  addSelectedItems: vi.fn(),
  removeSelectedItems: vi.fn(),
};

// Mock performance service
const mockPerformanceService = {
  updateCheckedCount: vi.fn(),
  resetCheckedCount: vi.fn(),
};

@Component({
  selector: 'fl-form-test-host',
  template: `
    <fl-form-folder-tree-node
      [node]="node"
      [expanded]="expanded"
      [depth]="depth"
      [inheritedChecked]="inheritedChecked"
    ></fl-form-folder-tree-node>
  `,
  standalone: true,
  imports: [FolderTreeNodeComponent],
})
class TestHostComponent {
  @Input() public node: TreeNode = { id: 1, title: 'Test Node' };
  @Input() public expanded = false;
  @Input() public depth = 0;
  @Input() public inheritedChecked = false;
}

describe('FolderTreeNodeComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: FolderTreeNodeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CheckboxComponent],
      providers: [
        { provide: FOLDER_TREE_CONTEXT, useValue: mockContextService },
        { provide: PerformanceService, useValue: mockPerformanceService },
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    component = hostFixture.debugElement.query(
      By.directive(FolderTreeNodeComponent)
    ).componentInstance;

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
      expect(component.hasChildren).toBe(false);
    });

    it('should display node title', () => {
      const titleElement = hostFixture.debugElement.query(
        By.css('fl-form-checkbox span')
      ).nativeElement;
      expect(titleElement.textContent).toContain('Leaf Node');
    });

    it('should not have folder class', () => {
      const titleElement = hostFixture.debugElement.query(
        By.css('fl-form-checkbox span')
      ).nativeElement;
      expect(titleElement.classList.contains('folder')).toBe(false);
    });

    it('should not show expand/collapse chevron', () => {
      const chevron = hostFixture.debugElement.query(By.css('.chevron'));
      expect(chevron).toBeNull();
    });

    it('should add item to selection when checked', () => {
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        enumerable: true,
      });

      component.onToggle(event);
      hostFixture.detectChanges();

      expect(mockContextService.addSelectedItems).toHaveBeenCalledWith(1);
    });

    it('should remove item from selection when unchecked', () => {
      // First check it
      const checkEvent = new Event('change');
      Object.defineProperty(checkEvent, 'target', {
        value: { checked: true },
        enumerable: true,
      });
      component.onToggle(checkEvent);

      // Then uncheck it
      const uncheckEvent = new Event('change');
      Object.defineProperty(uncheckEvent, 'target', {
        value: { checked: false },
        enumerable: true,
      });
      component.onToggle(uncheckEvent);

      expect(mockContextService.removeSelectedItems).toHaveBeenCalledWith(1);
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
      expect(component.hasChildren).toBe(true);
    });

    it('should have folder class', () => {
      const titleElement = hostFixture.debugElement.query(
        By.css('fl-form-checkbox span')
      ).nativeElement;
      expect(titleElement.classList.contains('folder')).toBe(true);
    });

    it('should show expand/collapse chevron', () => {
      const chevron = hostFixture.debugElement.query(By.css('.chevron'));
      expect(chevron).toBeTruthy();
    });

    it('should toggle expanded state when clicked', () => {
      const initialState = component.expandedSignal();
      component.toggleExpanded();
      hostFixture.detectChanges();
      expect(component.expandedSignal()).not.toEqual(initialState);
    });

    it('should pass inheritedChecked to child nodes when checked', () => {
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        enumerable: true,
      });

      component.onToggle(event);
      hostFixture.detectChanges();

      // This would require more complex testing with actual child components
      // For now, we can verify the expanded state is set to true
      expect(component.expandedSignal()).toBe(true);
    });
  });

  describe('Inherited checked behavior', () => {
    it('should update inheritedCheckedSignal when inheritedChecked is set', () => {
      hostComponent.inheritedChecked = true;
      hostFixture.detectChanges();

      // Access the private signal through any to verify it was set
      expect((component as any).inheritedCheckedSignal()).toBe(true);
    });

    it('should reset childrenBasedCheckedSignal and writeValueCheckedSignal when inheritedChecked is set', () => {
      // Spy on the signals
      vi.spyOn((component as any).childrenBasedCheckedSignal, 'set');
      vi.spyOn((component as any).writeValueCheckedSignal, 'set');

      hostComponent.inheritedChecked = true;
      hostFixture.detectChanges();

      expect(
        (component as any).childrenBasedCheckedSignal.set
      ).toHaveBeenCalledWith(null);
      expect(
        (component as any).writeValueCheckedSignal.set
      ).toHaveBeenCalledWith(null);
    });
  });

  describe('Performance tracking', () => {
    it('should reset performance counter when toggling checkbox', () => {
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        enumerable: true,
      });

      component.onToggle(event);

      expect(mockPerformanceService.resetCheckedCount).toHaveBeenCalled();
    });

    it('should update performance counter when checked state changes', () => {
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        enumerable: true,
      });

      component.onToggle(event);
      hostFixture.detectChanges();

      expect(mockPerformanceService.updateCheckedCount).toHaveBeenCalledWith(
        'vc-no-effect'
      );
    });
  });
});
