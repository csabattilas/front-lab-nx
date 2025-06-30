import {
  Component,
  forwardRef,
  input,
  Input,
  ChangeDetectionStrategy,
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
  @Input() public value: boolean | null = null;
  public indeterminate = input<boolean>(false);
  public readonly id = `checkbox-${Math.random().toString()}`;

  @Input()
  get checked(): boolean {
    return this.value === true;
  }

  set checked(val: boolean) {
    if (this.value !== val) {
      this.value = val;
      this.onChange(this.value);
      this.onTouched();
    }
  }

  public writeValue(value: boolean | null): void {
    this.value = value;
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
    this.value = checkbox.checked;
    this.onChange(this.value);
    this.onTouched();
  }

  private onChange: (value: boolean | null) => void = () => {
    // empty by design
  };

  private onTouched: () => void = () => {
    // empty by design
  };
}
