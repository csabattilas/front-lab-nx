import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'fl-locked-selection-example',
  templateUrl: './locked-selection-example.html',
  styleUrl: './locked-selection-example.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LockedSelectionHorizontalComponent {
  public direction = input<string>();
  public isSolved = signal<boolean | null>(null);

  private readonly listboxRef = viewChild<ElementRef>('ls');

  private readonly modelValue = signal<
    {
      resolved: boolean;
      selectedValue: string;
    }[]
  >([]);

  // @ts-expect-error
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


