import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  FOLDER_TREE_TRANSACTIONAL_CONTEXT,
  TreeSelectionComponentTransactionalContext,
} from '../model/folder-tree-model';
import { PerformanceService } from '../performance/performance';

@Component({
  selector: 'fl-form-folder-tree-transactional',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  providers: [
    PerformanceService,
    {
      provide: FOLDER_TREE_TRANSACTIONAL_CONTEXT,
      useExisting: forwardRef(() => FolderTreeTransactionalComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FolderTreeTransactionalComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// should we have validation? perhaps next iteration
export class FolderTreeTransactionalComponent
  implements ControlValueAccessor, TreeSelectionComponentTransactionalContext
{
  private readonly _selectedItemsIds = signal<Set<number>>(new Set());

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectedItemsIds = this._selectedItemsIds.asReadonly();

  private readonly _isFormUpdate = signal(false);

  private readonly cdr = inject(ChangeDetectorRef);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isFormUpdate = this._isFormUpdate.asReadonly();

  private readonly performanceService = inject(PerformanceService);

  public writeValue(value: number[]): void {
    this.transaction(() => {
      this.performanceService.resetCheckedCount();
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
    this.emitChange();
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
    this.emitChange();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: number[]): void => {
    //
  };

  private onTouched = (): void => {
    //
  };

  // transactional update. the writeValue will cascade back otherwise.
  // it's a trick to separate the writeValue updates from interactive updates
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

  private emitChange(): void {
    const selectedIds = untracked(() => this.selectedItemsIds());
    const idsArray = Array.from(selectedIds);
    this.onChange(idsArray);
    this.cdr.markForCheck();
  }
}
