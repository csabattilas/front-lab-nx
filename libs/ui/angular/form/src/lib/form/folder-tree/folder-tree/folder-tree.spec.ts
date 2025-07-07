import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderTreeComponent } from './folder-tree';
import { Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `<fl-form-folder-tree
    [formControl]="control"
  ></fl-form-folder-tree>`,
  standalone: true,
  imports: [FolderTreeComponent, ReactiveFormsModule],
})
class TestHostComponent {
  @ViewChild(FolderTreeComponent) public folderTree!: FolderTreeComponent;
  public control = new FormControl<number[]>([]);
}

describe('FolderTreeComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: FolderTreeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    component = hostComponent.folderTree;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selectedItemsIds when form control value changes', () => {
    const testIds = [1, 2, 3];
    hostComponent.control.setValue(testIds);
    hostFixture.detectChanges();

    expect(component.selectedItemsIds()).toEqual(new Set(testIds));
  });

  it('should update form control when adding selected items', () => {
    component.addSelectedItems(5);
    hostFixture.detectChanges();

    expect(hostComponent.control.value).toContain(5);
  });

  it('should update form control when removing selected items', () => {
    hostComponent.control.setValue([5, 10]);
    hostFixture.detectChanges();

    component.removeSelectedItems(5);
    hostFixture.detectChanges();

    expect(hostComponent.control.value).not.toContain(5);
    expect(hostComponent.control.value).toContain(10);
  });

  it('should add item to selection', () => {
    component.addSelectedItems(42);
    expect(component.selectedItemsIds()).toContain(42);
  });

  it('should remove item from selection', () => {
    component.addSelectedItems(42);
    component.removeSelectedItems(42);
    expect(component.selectedItemsIds()).not.toContain(42);
  });
});
