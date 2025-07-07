import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFolderTreeNodeComponent } from './folder-tree-node-base';
import {
  FOLDER_TREE_CONTEXT,
  TreeSelectionComponentContext,
} from '../../model/folder-tree-model';
import { Component, Injectable, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

// Mock context service for testing
@Injectable()
class MockTreeSelectionContext implements TreeSelectionComponentContext {
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

  public setSelectedItems(ids: number[]): void {
    this._selectedItemsIds.set(new Set(ids));
  }
}

// be able to extend and test the component functionalities
@Component({
  selector: 'fl-form-folder-tree-transactional-node-test',
  template: `
    <div class="node" [attr.data-depth]="depth()">
      <div class="node-content">
        <input
          type="checkbox"
          [checked]="checked()"
          (change)="onToggle($event)"
          data-testid="checkbox"
        />
        <span
          class="title"
          (click)="toggleExpanded()"
          (keydown.space)="toggleExpanded()"
          (keydown.enter)="toggleExpanded()"
          role="button"
          tabindex="0"
          >{{ node().title }}</span
        >
      </div>
      @if (expandedSignal() && hasChildren) {
        <ng-content></ng-content>
      }
    </div>
  `,
  standalone: true,
})
class TestFolderTreeNodeComponent extends BaseFolderTreeNodeComponent {
  public override readonly ctx = TestBed.inject(FOLDER_TREE_CONTEXT);

  public override get hasChildren(): boolean {
    return super.hasChildren;
  }

  public override onToggle(event: Event): void {
    super.onToggle(event);
  }

  public override toggleExpanded(): void {
    super.toggleExpanded();
  }
}

describe('BaseFolderTreeNodeComponent', () => {
  let component: TestFolderTreeNodeComponent;
  let fixture: ComponentFixture<TestFolderTreeNodeComponent>;
  let mockContext: MockTreeSelectionContext;

  beforeEach(() => {
    mockContext = new MockTreeSelectionContext();

    TestBed.configureTestingModule({
      imports: [TestFolderTreeNodeComponent],
      providers: [{ provide: FOLDER_TREE_CONTEXT, useValue: mockContext }],
    });

    fixture = TestBed.createComponent(TestFolderTreeNodeComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('node', {
      id: 1,
      title: 'Test Node',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.node().id).toBe(1);
    expect(component.node().title).toBe('Test Node');
    expect(component.inheritedChecked()).toBe(false);
    expect(component.expanded()).toBe(false);
    expect(component.depth()).toBe(0);
    expect(component.expandedSignal()).toBe(false);
    expect(component.checked()).toBe(false);
  });

  it('should detect if node has children', () => {
    expect(component.hasChildren).toBe(false);

    fixture.componentRef.setInput('node', {
      id: 1,
      title: 'Parent Node',
      items: [{ id: 2, title: 'Child Node' }],
    });
    fixture.detectChanges();

    expect(component.hasChildren).toBe(true);
  });

  it('should update checked state when onToggle is called', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { checked: true } });

    component.onToggle(event);
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
  });

  it('should toggle expanded state for nodes with children', () => {
    fixture.componentRef.setInput('node', {
      id: 1,
      title: 'Parent Node',
      items: [{ id: 2, title: 'Child Node' }],
    });
    fixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);

    component.toggleExpanded();
    fixture.detectChanges();

    expect(component.expandedSignal()).toBe(true);

    component.toggleExpanded();
    fixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);
  });

  it('should not toggle expanded state for nodes without children', () => {
    fixture.componentRef.setInput('node', { id: 1, title: 'Leaf Node' });
    fixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);

    component.toggleExpanded();
    fixture.detectChanges();

    expect(component.expandedSignal()).toBe(false);
  });

  it('should update checked state based on inheritedChecked input', () => {
    fixture.componentRef.setInput('inheritedChecked', true);
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
  });

  it('should update checked state when selected in context during form update', () => {
    mockContext.setFormUpdate(true);
    mockContext.setSelectedItems([1]);

    fixture.detectChanges();

    expect(component.checked()).toBe(true);
  });
});
