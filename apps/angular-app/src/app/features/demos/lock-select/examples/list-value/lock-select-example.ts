import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import '@frontlab/lion-form/lock-select';

@Component({
  selector: 'fl-lock-select-example',
  templateUrl: './lock-select-example.html',
  styleUrl: './lock-select-example.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LockSelectExampleComponent {
  public direction = input<string>();
  public isSolved = signal<boolean | null>(null);
  public isLocked = signal<boolean>(false);

  private readonly listboxRef = viewChild<ElementRef>('ls');

  private readonly modelValue = signal<
    {
      resolved: boolean;
      selectedValue: string;
      locked: boolean;
    }[]
  >([]);

  private timeoutId = 0;

  // @ts-expect-error not used in the component
  private readonly solvedEffect = effect(() => {
    if (!this.modelValue()?.length) {
      this.isSolved.set(null);
      return;
    }

    this.isSolved.set(this.modelValue()?.[0].resolved);
    this.isLocked.set(this.modelValue()?.[0].locked);

    if (!this.isSolved() && !this.isLocked()) {
      this.timeoutId = window.setTimeout(() => {
        this.modelValue.set([]);
      }, 1000);
    } else if (this.isSolved()) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  });

  public onChange(): void {
    this.modelValue.set(this.listboxRef()?.nativeElement?.modelValue);
  }
}
