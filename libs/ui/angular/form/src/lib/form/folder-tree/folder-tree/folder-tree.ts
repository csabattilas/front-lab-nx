import {
  Component,
  forwardRef,
  effect,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FOLDER_TREE_CONTEXT } from '../model/folder-tree-model';
import { signal } from '@angular/core';
import { TreeSelectionComponentContext } from '../model/folder-tree-model';

@Component({
  selector: 'fl-form-folder-tree',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: FOLDER_TREE_CONTEXT,
      useExisting: forwardRef(() => FolderTreeComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FolderTreeComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// should we have validation? perhaps next iteration
export class FolderTreeComponent
  implements ControlValueAccessor, TreeSelectionComponentContext
{
  private readonly _selectedItemsIds = signal<Set<number>>(new Set());

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectedItemsIds = this._selectedItemsIds.asReadonly();

  private readonly _isFormUpdate = signal(false);

  private readonly cdr = inject(ChangeDetectorRef);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isFormUpdate = this._isFormUpdate.asReadonly();

  constructor() {
    effect(() => {
      const selectedIds = this.selectedItemsIds();
      const idsArray = Array.from(selectedIds);
      this.onChange(idsArray);
      this.cdr.markForCheck();
    });
  }

  public writeValue(value: number[]): void {
    this.transaction(() => {
      this._selectedItemsIds.set(new Set(value || []));
    });
  }

  public registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // implement from the nodes so it marks it touched. no prio for now
  public markAsTouched(): void {
    this.onTouched();
  }

  public addSelectedItems(id: number): void {
    if (this._isFormUpdate()) {
      return;
    }

    this._selectedItemsIds.update(ids => {
      ids.add(id);
      return new Set(ids);
    });
    this.onTouched();
  }

  public removeSelectedItems(id: number): void {
    if (this._isFormUpdate()) {
      return;
    }

    this._selectedItemsIds.update(ids => {
      ids.delete(id);
      return new Set(ids);
    });
    this.onTouched();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: number[]): void => {
    //
  };

  private onTouched = (): void => {
    //
  };

  // transactional update. the writeValue will cascade back otherwise.
  private transaction<T>(fn: () => T): T {
    this._isFormUpdate.set(true);
    try {
      return fn();
    } finally {
      setTimeout(() => {
        this._isFormUpdate.set(false);
      }, 0);
    }
  }
}
