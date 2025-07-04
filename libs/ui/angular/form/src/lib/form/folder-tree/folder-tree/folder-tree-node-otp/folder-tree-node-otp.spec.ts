import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeNodeOtpComponent } from './folder-tree-node-otp';
import { FOLDER_TREE_CONTEXT, TreeNode } from '../../model/folder-tree-model';
import { Component, Input, signal } from '@angular/core';
import { CheckboxComponent } from '../../../checkbox';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { PerformanceService } from '../../performance/performance';

function createCheckboxEvent(checked: boolean): Event {
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: { checked } });
  return event;
}

@Component({
  selector: 'fl-form-folder-tree-mock-context-provider',
  template: '<ng-content></ng-content>',
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

  public setFormUpdate(value: boolean): void {
    this._isFormUpdate.set(value);
  }
}

@Component({
  template: `
    <fl-form-folder-tree-mock-context-provider>
      <fl-form-folder-tree-node-otp
        [node]="node"
        [expanded]="expanded"
        (checkedChange)="onCheckedChange($event)"
        (indeterminateChange)="onIndeterminateChange($event)"
      ></fl-form-folder-tree-node-otp>
    </fl-form-folder-tree-mock-context-provider>
  `,
  imports: [MockContextProviderComponent, FolderTreeNodeOtpComponent],
})
class TestHostComponent {
  @Input() public node: TreeNode = {
    id: 1,
    title: 'Test Node',
    checked: false,
    indeterminate: false,
  };
  @Input() public expanded = false;
  @Input() public depth = 0;

  public checkedChangeValue: boolean | null = null;
  public indeterminateChangeValue: boolean | null = null;

  public onCheckedChange(value: boolean): void {
    this.checkedChangeValue = value;
  }

  public onIndeterminateChange(value: boolean): void {
    this.indeterminateChangeValue = value;
  }
}

describe('FolderTreeNodeOtpComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: FolderTreeNodeOtpComponent;
  let contextProvider: MockContextProviderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FolderTreeNodeOtpComponent,
        CheckboxComponent,
        TestHostComponent,
        MockContextProviderComponent,
      ],
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const nodeElement = hostFixture.debugElement.query(
      By.css('fl-form-folder-tree-node-otp')
    );
    if (!nodeElement) {
      throw new Error('fl-form-folder-tree-node-otp element not found');
    }
    component = nodeElement.componentInstance;

    const contextElement = hostFixture.debugElement.query(
      By.css('fl-form-folder-tree-mock-context-provider')
    );
    if (!contextElement) {
      throw new Error(
        'fl-form-folder-tree-mock-context-provider element not found'
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
    expect(hostComponent.checkedChangeValue).toBe(true);
    expect(component.node().checked).toBe(true);
  });

  it('should add selected item to context when leaf node is checked', () => {
    const spy = vi.spyOn(contextProvider, 'addSelectedItems');
    const event = createCheckboxEvent(true);
    component.onToggle(event);
    hostFixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should remove selected item from context when leaf node is unchecked', () => {
    const spy = vi.spyOn(contextProvider, 'removeSelectedItems');
    const checkEvent = createCheckboxEvent(true);
    component.onToggle(checkEvent);
    hostFixture.detectChanges();
    const uncheckEvent = createCheckboxEvent(false);
    component.onToggle(uncheckEvent);
    hostFixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should toggle expanded state when toggleExpanded is called', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node', checked: false, indeterminate: false },
        { id: 3, title: 'Child Node', checked: false, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };
    component.toggleExpanded();
    hostFixture.detectChanges();
    expect(component.expandedSignal()).toBe(true);
    component.toggleExpanded();
    hostFixture.detectChanges();
    expect(component.expandedSignal()).toBe(false);
  });

  it('should not toggle expanded state for nodes without children', () => {
    hostComponent.node = {
      id: 1,
      title: 'Leaf Node',
      checked: false,
      indeterminate: false,
    };
    hostFixture.detectChanges();
    expect(component.expandedSignal()).toBe(false);
    component.toggleExpanded();
    hostFixture.detectChanges();
    expect(component.expandedSignal()).toBe(false);
  });

  it('should auto-expand parent node when checked', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node', checked: false, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };
    hostFixture.detectChanges();
    const event = createCheckboxEvent(true);
    component.onToggle(event);
    hostFixture.detectChanges();
    expect(component.expandedSignal()).toBe(true);
  });

  it('should update indeterminate state when some children are checked', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1', checked: false, indeterminate: false },
        { id: 3, title: 'Child Node 2', checked: false, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };
    component['total'] = 2; // Simulate total count of children

    hostFixture.detectChanges();
    component.onChildSelection();
    expect(component.indeterminate()).toBe(false);

    if (hostComponent.node?.items?.length) {
      hostComponent.node.items[0].checked = true;
    }

    hostFixture.detectChanges();
    component.onChildSelection();

    expect(component.indeterminate()).toBe(true);
  });

  it('should update checked state when all children are checked', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1', checked: true, indeterminate: false },
        { id: 3, title: 'Child Node 2', checked: true, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };
    hostFixture.detectChanges();
    component['total'] = 2; // Simulate total count of children
    if (hostComponent.node?.items?.length) {
      // thet get reset
      hostComponent.node.items[0].checked = true;
      hostComponent.node.items[1].checked = true;
    }
    component.onChildSelection();
    hostFixture.detectChanges();
    expect(component.checked()).toBe(true);
    expect(component.indeterminate()).toBe(false);
  });

  it('should update indeterminate state when child has indeterminate state', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1', checked: false, indeterminate: true },
        { id: 3, title: 'Child Node 2', checked: false, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };
    hostFixture.detectChanges();
    component.onIndeterminateChange();
    expect(component.indeterminate()).toBe(true);
    expect(hostComponent.indeterminateChangeValue).toBe(true);
  });

  it('should emit indeterminateChange when indeterminate state changes', () => {
    hostFixture.detectChanges();
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1', checked: true, indeterminate: false },
        { id: 3, title: 'Child Node 2', checked: false, indeterminate: false },
      ],
      checked: false,
      indeterminate: false,
    };

    const indeterminateChangeSpy = vi.spyOn(
      component.indeterminateChange,
      'emit'
    );

    component['total'] = 2; // Simulate total count of children
    hostFixture.detectChanges();

    if (hostComponent.node?.items?.length) {
      hostComponent.node.items[0].indeterminate = true;
    }
    component.onIndeterminateChange();
    hostFixture.detectChanges();

    expect(indeterminateChangeSpy).toHaveBeenCalledWith(true);
    expect(hostComponent.indeterminateChangeValue).toBe(true);
  });
});
