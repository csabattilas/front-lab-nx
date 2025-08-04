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
import { CHECKBOX_TREE_CONTEXT, CheckboxTreeContext } from './model';

@Component({
  selector: 'fl-form-checkbox-tree',
  imports: [],
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: CHECKBOX_TREE_CONTEXT,
      useExisting: forwardRef(() => CheckboxTreeComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxTreeComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// should we have validation? perhaps next iteration
export class CheckboxTreeComponent implements ControlValueAccessor, CheckboxTreeContext {
  private readonly _selectedItemsIds = signal<Set<number>>(new Set());

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectedItemsIds = this._selectedItemsIds.asReadonly();

  private readonly cdr = inject(ChangeDetectorRef);

  public writeValue(value: number[]): void {
    // todo: explain this
    queueMicrotask(() => {
      this._selectedItemsIds.set(new Set(value || []));
    });
  }

  public registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public markAsTouched(): void {
    this.onTouched();
  }

  public selectItem(id: number): void {
    this._selectedItemsIds.update(ids => {
      ids.add(id);
      return new Set(ids);
    });
    this.onTouched();
    this.emitChange();
  }

  public unselectItem(id: number): void {
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
    const selectedIds = untracked(() => this._selectedItemsIds());
    const idsArray = Array.from(selectedIds);
    this.onChange(idsArray);
    this.cdr.markForCheck();
  }
}
