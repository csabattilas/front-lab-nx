import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeComponent } from './folder-tree';
import { FOLDER_TREE_CONTEXT } from '../model/folder-tree-model';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// test the component as a form control
@Component({
  template: `
    <form [formGroup]="form">
      <fl-form-folder-tree formControlName="folders">
        <div>Tree content</div>
      </fl-form-folder-tree>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, FolderTreeComponent],
})
class TestHostComponent {
  public form = new FormGroup({
    folders: new FormControl<number[]>([]),
  });
}

describe('FolderTreeComponent', () => {
  let component: FolderTreeComponent;
  let fixture: ComponentFixture<FolderTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FolderTreeComponent, ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(FolderTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide FOLDER_TREE_CONTEXT', () => {
    // the component itself provides is the context
    const context = fixture.debugElement.injector.get(FOLDER_TREE_CONTEXT);
    expect(context).toBe(component);
  });

  it('should initialize with empty selectedItemsIds', () => {
    expect(component.selectedItemsIds().size).toBe(0);
  });

  it('should add item to selectedItemsIds when addSelectedItems is called', () => {
    component.addSelectedItems(1);
    expect(component.selectedItemsIds().has(1)).toBe(true);
  });

  it('should remove item from selectedItemsIds when removeSelectedItems is called', () => {
    component.addSelectedItems(1);
    expect(component.selectedItemsIds().has(1)).toBe(true);

    component.removeSelectedItems(1);
    expect(component.selectedItemsIds().has(1)).toBe(false);
  });

  it('should not add or remove items when isFormUpdate is true', () => {
    vi.useFakeTimers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).transaction(() => {
      component.addSelectedItems(1);
      expect(component.selectedItemsIds().has(1)).toBe(false);
    });

    vi.runAllTimers();

    component.addSelectedItems(1);
    expect(component.selectedItemsIds().has(1)).toBe(true);

    vi.useFakeTimers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).transaction(() => {
      component.removeSelectedItems(1);
      expect(component.selectedItemsIds().has(1)).toBe(true);
    });

    vi.runAllTimers();
  });

  it('should call onTouched when addSelectedItems is called', () => {
    const spy = vi.spyOn(component as never, 'onTouched');
    component.addSelectedItems(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onTouched when removeSelectedItems is called', () => {
    const spy = vi.spyOn(component as never, 'onTouched');
    component.addSelectedItems(1);
    spy.mockReset();

    component.removeSelectedItems(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onChange with array of ids when selectedItemsIds changes', () => {
    // fancy
    vi.useFakeTimers();

    const spy = vi.spyOn(component as never, 'onChange');
    spy.mockClear();

    component.addSelectedItems(1);

    vi.runAllTimers();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith([1]);
  });
});

describe('FolderTreeComponent as FormControl', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let folderTreeComponent: FolderTreeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    vi.useFakeTimers();
    hostFixture.detectChanges();
    vi.runAllTimers();
    folderTreeComponent = hostFixture.debugElement.query(
      selector => selector.componentInstance instanceof FolderTreeComponent
    ).componentInstance;
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should update form value when selectedItemsIds changes', () => {
    folderTreeComponent.addSelectedItems(1);
    folderTreeComponent.addSelectedItems(2);

    hostFixture.detectChanges();

    expect(hostComponent.form.get('folders')?.value).toEqual([1, 2]);
  });

  it('should update selectedItemsIds when form value changes', () => {
    expect(folderTreeComponent.selectedItemsIds().size).toBe(0);
    hostComponent.form.get('folders')?.setValue([3, 4]);
    hostFixture.detectChanges();

    expect(folderTreeComponent.selectedItemsIds().size).toBe(2);
    expect(Array.from(folderTreeComponent.selectedItemsIds())).toEqual(
      expect.arrayContaining([3, 4])
    );
  });

  it('should handle null form values', () => {
    hostComponent.form.get('folders')?.setValue(null);
    hostFixture.detectChanges();

    expect(folderTreeComponent.selectedItemsIds().size).toBe(0);
  });

  it('should use transaction to prevent feedback loops', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(folderTreeComponent as never, 'transaction');
    hostComponent.form.get('folders')?.setValue([5]);
    hostFixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    vi.runAllTimers();
    expect(folderTreeComponent.selectedItemsIds().size).toBe(1);
    expect(Array.from(folderTreeComponent.selectedItemsIds())).toEqual(
      expect.arrayContaining([5])
    );
  });

  it('should set isFormUpdate to true during transaction and reset to false after', async () => {
    vi.useFakeTimers();

    hostComponent.form.get('folders')?.setValue([5]);
    hostFixture.detectChanges();

    expect(folderTreeComponent.isFormUpdate()).toBe(true);

    vi.runAllTimers();
    expect(folderTreeComponent.isFormUpdate()).toBe(false);
  });
});
