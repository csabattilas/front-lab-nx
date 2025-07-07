import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeNodeVcComponent } from './folder-tree-node-vc';
import { FOLDER_TREE_CONTEXT, TreeNode } from '../../model/folder-tree-model';
import { Component, Input, signal } from '@angular/core';
import { CheckboxComponent } from '../../../checkbox';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { PerformanceService } from '../../performance/performance';

function createCheckboxEvent(checked: boolean): Event {
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: { checked } });
  return event;
}

// mock context provider for testing
@Component({
  selector: 'fl-form-folder-tree-transactional-mock-context-provider',
  template: '<ng-content></ng-content>',
  standalone: true,
  providers: [
    PerformanceService,
    {
      provide: FOLDER_TREE_CONTEXT,
      useExisting: MockContextProviderComponent,
    },
  ],
})
class MockContextProviderComponent {
  private readonly _selectedItemsIds = signal<Set<number>>(new Set());
  private readonly _isFormUpdate = signal<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectedItemsIds = this._selectedItemsIds.asReadonly();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isFormUpdate = this._isFormUpdate.asReadonly();

  public addSelectedItems(id: number): void {
    this._selectedItemsIds.update(ids => {
      ids.add(id);
      return new Set(ids);
    });
  }

  public removeSelectedItems(id: number): void {
    this._selectedItemsIds.update(ids => {
      ids.delete(id);
      return new Set(ids);
    });
  }
}

@Component({
  template: `
    <fl-form-folder-tree-mock-context-provider>
      <fl-form-folder-tree-node-vc
        [node]="node"
        [expanded]="expanded"
      ></fl-form-folder-tree-node-vc>
    </fl-form-folder-tree-mock-context-provider>
  `,
  standalone: true,
  imports: [],
})
class TestHostComponent {
  @Input() public node: TreeNode = { id: 1, title: 'Test Node' };
  @Input() public expanded = false;
  @Input() public depth = 0;
}

@Component({
  template: `
    <fl-form-folder-tree-mock-context-provider>
      <fl-form-folder-tree-node-vc
        [node]="parentNode"
        [expanded]="true"
      ></fl-form-folder-tree-node-vc>
    </fl-form-folder-tree-mock-context-provider>
  `,
  standalone: true,
  imports: [],
})
class NestedTestHostComponent {
  public parentNode: TreeNode = {
    id: 1,
    title: 'Parent Node',
    items: [
      { id: 2, title: 'Child Node 1' },
      { id: 3, title: 'Child Node 2' },
    ],
  };
}

describe('FolderTreeNodeVcComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: FolderTreeNodeVcComponent;
  let contextProvider: MockContextProviderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FolderTreeNodeVcComponent,
        CheckboxComponent,
        TestHostComponent,
        MockContextProviderComponent,
      ],
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const nodeElement = hostFixture.debugElement.query(
      By.css('fl-form-folder-tree-transactional-node-vc')
    );
    if (!nodeElement) {
      throw new Error(
        'fl-form-folder-tree-transactional-node-vc element not found'
      );
    }
    component = nodeElement.componentInstance;

    const contextElement = hostFixture.debugElement.query(
      By.css('fl-form-folder-tree-transactional-mock-context-provider')
    );
    if (!contextElement) {
      throw new Error(
        'fl-form-folder-tree-transactional-mock-context-provider element not found'
      );
    }
    contextProvider = contextElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct inputs', () => {
    expect(component.node().id).toBe(1);
    expect(component.node().title).toBe('Test Node');
    expect(component.inheritedChecked()).toBe(false);
    expect(component.expanded()).toBe(false);
    expect(component.depth()).toBe(0);
  });

  it('should emit checkedChange when checked state changes', () => {
    const event = createCheckboxEvent(true);

    component.onToggle(event);
    hostFixture.detectChanges();

    expect(component.checked()).toBe(true);
  });

  it('should add selected item to context when item node is checked', () => {
    const spy = vi.spyOn(contextProvider, 'addSelectedItems');

    const event = createCheckboxEvent(true);

    component.onToggle(event);
    hostFixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should remove selected item from context when item node is unchecked', () => {
    const spy = vi.spyOn(contextProvider, 'removeSelectedItems');

    const checkEvent = createCheckboxEvent(true);
    component.onToggle(checkEvent);
    hostFixture.detectChanges();

    const uncheckEvent = createCheckboxEvent(false);
    component.onToggle(uncheckEvent);
    hostFixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should auto-expand parent node when checked', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [{ id: 2, title: 'Child Node' }],
    };
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);

    const event = createCheckboxEvent(true);
    component.onToggle(event);
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(true);
  });

  it('should toggle expanded state for nodes with children', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [{ id: 2, title: 'Child Node' }],
    };
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);

    component.toggleExpanded();
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(true);

    component.toggleExpanded();
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);
  });

  it('should not toggle expanded state for nodes without children', () => {
    hostComponent.node = { id: 1, title: 'Leaf Node' };
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);
    component.toggleExpanded();
    hostFixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);
  });
});

describe('FolderTreeNodeVcComponent - Parent-Child Relationship', () => {
  let nestedHostFixture: ComponentFixture<NestedTestHostComponent>;
  let parentComponent: FolderTreeNodeVcComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FolderTreeNodeVcComponent,
        CheckboxComponent,
        NestedTestHostComponent,
        MockContextProviderComponent,
      ],
    });

    nestedHostFixture = TestBed.createComponent(NestedTestHostComponent);
    nestedHostFixture.detectChanges();

    const parentElement = nestedHostFixture.debugElement.query(
      By.css('fl-form-folder-tree-transactional-node-vc')
    );
    if (!parentElement) {
      throw new Error('Parent node element not found');
    }
    parentComponent = parentElement.componentInstance;

    const contextElement = nestedHostFixture.debugElement.query(
      By.css('fl-form-folder-tree-transactional-mock-context-provider')
    );
    if (!contextElement) {
      throw new Error('Context provider element not found');
    }

    nestedHostFixture.detectChanges();
  });

  it('should update parent state when all children are checked', () => {
    const childElements = nestedHostFixture.debugElement.queryAll(
      By.css(
        'fl-form-folder-tree-transactional-node-vc fl-form-folder-tree-transactional-node-vc'
      )
    );
    expect(childElements.length).toBe(2);
    childElements.forEach(childEl => {
      const childComponent =
        childEl.componentInstance as FolderTreeNodeVcComponent;
      const event = createCheckboxEvent(true);
      childComponent.onToggle(event);
    });

    nestedHostFixture.detectChanges();

    expect(parentComponent.checked()).toBe(true);
    expect(parentComponent.indeterminate()).toBe(false);
  });

  it('should set parent to indeterminate when some children are checked', () => {
    const childElements = nestedHostFixture.debugElement.queryAll(
      By.css(
        'fl-form-folder-tree-transactional-node-vc fl-form-folder-tree-transactional-node-vc'
      )
    );

    const firstChildComponent = childElements[0]
      .componentInstance as FolderTreeNodeVcComponent;
    const event = createCheckboxEvent(true);
    firstChildComponent.onToggle(event);

    nestedHostFixture.detectChanges();

    expect(parentComponent.indeterminate()).toBe(true);
    expect(parentComponent.checked()).toBe(false);
  });

  it('should check all children when parent is checked', () => {
    const event = createCheckboxEvent(true);
    parentComponent.onToggle(event);
    nestedHostFixture.detectChanges();

    const childElements = nestedHostFixture.debugElement.queryAll(
      By.css(
        'fl-form-folder-tree-transactional-node-vc fl-form-folder-tree-transactional-node-vc'
      )
    );
    childElements.forEach(childEl => {
      const childComponent =
        childEl.componentInstance as FolderTreeNodeVcComponent;
      expect(childComponent.checked()).toBe(true);
    });
  });
});
