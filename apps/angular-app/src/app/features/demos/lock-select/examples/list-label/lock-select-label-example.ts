import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import '@frontlab/lion-form/lock-select/index';

@Component({
  selector: 'fl-lock-select-label-example',
  templateUrl: './lock-select-label-example.html',
  styleUrl: './lock-select-label-example.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LockSelectLabelExampleComponent {
  public direction = input<string>();
  public isSolved = signal<boolean | null>(null);
  public quizData = [
    {
      value: 'a',
      label: 'Amsterdam',
    },
    {
      value: 'b',
      label: 'Berlin',
    },
    {
      value: 'c',
      label: 'Brussels',
    },
    {
      value: 'd',
      label: 'The Hague',
    },
  ];
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
