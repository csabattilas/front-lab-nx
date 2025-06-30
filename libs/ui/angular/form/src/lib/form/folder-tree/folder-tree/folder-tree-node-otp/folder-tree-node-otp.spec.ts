import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeNodeOtpComponent } from './folder-tree-node-otp';
import { FOLDER_TREE_CONTEXT, TreeNode } from '../../model/folder-tree-model';
import { Component, Input, signal } from '@angular/core';
import { CheckboxComponent } from '../../../checkbox';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';

function createCheckboxEvent(checked: boolean): Event {
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: { checked } });
  return event;
}

@Component({
  selector: 'fl-form-folder-tree-mock-context-provider',
  template: '<ng-content></ng-content>',
  providers: [
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

  //eslint-disable-next-line @typescript-eslint/member-ordering
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
  @Input() public node: TreeNode = { id: 1, title: 'Test Node' };
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

  it('should update checked state when onChildSelection is called', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1' },
        { id: 3, title: 'Child Node 2' },
      ],
    };
    hostFixture.detectChanges();

    expect(component.checked()).toBe(false);
    expect(component.indeterminate()).toBe(false);

    component.onChildSelection(true);
    hostFixture.detectChanges();

    expect(component.checked()).toBe(false);
  });

  it('should update indeterminate state when onChildSelection is called', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1' },
        { id: 3, title: 'Child Node 2' },
      ],
    };
    hostFixture.detectChanges();

    const indeterminateChangeSpy = vi.spyOn(
      component.indeterminateChange,
      'emit'
    );

    component.onChildSelection(true);
    hostFixture.detectChanges();

    expect(component.indeterminate()).toBe(true);
    expect(indeterminateChangeSpy).toHaveBeenCalledWith(true);
  });

  it('should handle unchecking both children correctly', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1' },
        { id: 3, title: 'Child Node 2' },
      ],
    };
    hostFixture.detectChanges();

    component.onChildSelection(true);
    component.onChildSelection(true);

    expect(component.checked()).toBe(true);
    expect(component.indeterminate()).toBe(false);

    component.onChildSelection(false);
    expect(component.checked()).toBe(true);
    expect(component.indeterminate()).toBe(true);

    component.onChildSelection(false);
    expect(component.checked()).toBe(false);
    expect(component.indeterminate()).toBe(false);

    component.onIndeterminateChange(false);
    expect(component.indeterminate()).toBe(false);
    expect(component.checked()).toBe(false);
  });

  it('should update indeterminate state when onIndeterminateChange is called', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1' },
        { id: 3, title: 'Child Node 2' },
      ],
    };
    hostFixture.detectChanges();

    expect(component.indeterminate()).toBe(false);

    const indeterminateChangeSpy = vi.spyOn(
      component.indeterminateChange,
      'emit'
    );

    component.onIndeterminateChange(true);
    hostFixture.detectChanges();

    expect(component.indeterminate()).toBe(true);
    expect(indeterminateChangeSpy).toHaveBeenCalledWith(true);

    indeterminateChangeSpy.mockReset();

    component.onIndeterminateChange(false);
    hostFixture.detectChanges();

    expect(component.indeterminate()).toBe(false);
    expect(indeterminateChangeSpy).toHaveBeenCalledWith(false);
  });

  it('should emit indeterminateChange when indeterminate state changes', () => {
    hostComponent.node = {
      id: 1,
      title: 'Parent Node',
      items: [
        { id: 2, title: 'Child Node 1' },
        { id: 3, title: 'Child Node 2' },
      ],
    };
    hostFixture.detectChanges();

    component.onChildSelection(true);
    hostFixture.detectChanges();

    expect(hostComponent.indeterminateChangeValue).toBe(true);
  });
});
