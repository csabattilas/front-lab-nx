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
  FOLDER_TREE_CONTEXT,
  TreeSelectionComponentContext,
} from '../model/folder-tree-model';
import { PerformanceService } from '../performance/performance';

@Component({
  selector: 'fl-form-folder-tree',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  providers: [
    PerformanceService,
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

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly performanceService = inject(PerformanceService);

  public writeValue(value: number[]): void {
    this.performanceService.resetCheckedCount();
    this._selectedItemsIds.set(new Set(value || []));
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
    this._selectedItemsIds.update(ids => {
      ids.add(id);
      return new Set(ids);
    });
    this.onTouched();
    this.emitChange();
  }

  public removeSelectedItems(id: number): void {
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

  private emitChange(): void {
    const selectedIds = untracked(() => this.selectedItemsIds());
    const idsArray = Array.from(selectedIds);
    this.onChange(idsArray);
    this.cdr.markForCheck();
  }
}
