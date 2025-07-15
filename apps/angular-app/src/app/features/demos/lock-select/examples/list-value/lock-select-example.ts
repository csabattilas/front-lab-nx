import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import '@front-lab-nx/lion-form/lock-select/index';

@Component({
  selector: 'fl-lock-select-example',
  templateUrl: './lock-select-example.html',
  styleUrl: './lock-select-example.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LockSelectExampleComponent {
  public direction = input<string>();
  public isSolved = signal<boolean | null>(null);

  private readonly listboxRef = viewChild<ElementRef>('ls');

  private readonly modelValue = signal<
    {
      resolved: boolean;
      selectedValue: string;
    }[]
  >([]);

  // @ts-expect-error not used in the component
  private readonly solvedEffect = effect(() => {
    if (!this.modelValue()?.length) {
      this.isSolved.set(null);
      return;
    }

    const solved = this.modelValue()?.[0].resolved;
    this.isSolved.set(solved);

    if (!solved) {
      setTimeout(() => {
        this.modelValue.set([]);
      }, 1000);
    }
  });

  public onChange(): void {
    this.modelValue.set(this.listboxRef()?.nativeElement?.modelValue);
  }
}
