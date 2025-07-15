import {
  Component,
  forwardRef,
  input,
  ChangeDetectionStrategy,
  linkedSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fl-form-checkbox',
  templateUrl: './checkbox.html',
  styleUrls: ['./checkbox.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// have a minimal custom checkbox
export class CheckboxComponent implements ControlValueAccessor {
  public checked = input<boolean>(false);
  public indeterminate = input<boolean>(false);
  public readonly id = `checkbox-${Math.random().toString()}`;

  // public value: boolean | null = null;

  public readonly checkedSignal = linkedSignal<boolean>(() => this.checked());

  public writeValue(value: boolean | null): void {
    this.checkedSignal.set(value === true);
  }

  public registerOnChange(fn: (value: boolean | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public forwardKey(event: Event, native: HTMLInputElement): void {
    event.preventDefault();
    event.stopPropagation();
    native.click();
  }

  public stopEvent(event: Event): void {
    event.stopPropagation();
  }

  public onNativeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.checkedSignal.set(checkbox.checked);
    this.onChange(this.checkedSignal());
    this.onTouched();
  }

  private onChange: (value: boolean | null) => void = () => {
    // empty by design
  };

  private onTouched: () => void = () => {
    // empty by design
  };
}
