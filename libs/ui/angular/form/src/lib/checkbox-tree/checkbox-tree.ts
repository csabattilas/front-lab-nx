import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, signal } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);

  private value = new Set<number>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly valueSignal = signal<Set<number>>(new Set());

  public writeValue(value: number[] | null | undefined): void {
    this.value = new Set(value ?? []);
    this.valueSignal.set(new Set(value ?? []));
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

  public updateValue(id: number, checked: boolean): void {
    if (checked) {
      this.value.add(id);
    } else {
      this.value.delete(id);
    }
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
    this.onChange(Array.from(this.value));
    this.cdr.markForCheck();
  }
}
