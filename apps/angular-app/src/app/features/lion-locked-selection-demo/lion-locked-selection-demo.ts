import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import '@lion/ui/define/lion-option.js';
import '@front-lab-nx/lion-form/locked-selection';

@Component({
  selector: 'fl-lion-locked-selection-demo',
  templateUrl: './lion-locked-selection-demo.html',
  styleUrl: './lion-locked-selection-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LionLockedSelectionDemoComponent {
  public isSolved = signal<boolean | null>(null);
  public isSolved2 = signal<boolean | null>(null);

  private readonly listboxRef = viewChild<ElementRef>('lls');
  private readonly listboxRef2 = viewChild<ElementRef>('lls2');

  private readonly modelValue = signal<
    {
      resolved: boolean;
      selectedValue: string;
    }[]
  >([]);
  private readonly modelValue2 = signal<
    {
      resolved: boolean;
      selectedValue: string;
    }[]
  >([]);

  // @ts-expect-error: TS6133
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
      }, 1000); // 1 second delay
    }
  });

  // @ts-expect-error: TS6133
  private readonly solved2Effect = effect(() => {
    if (!this.modelValue2()?.length) {
      this.isSolved2.set(null);
      return;
    }

    const solved = this.modelValue2()?.[0].resolved;
    this.isSolved2.set(solved);

    if (!solved) {
      setTimeout(() => {
        this.modelValue2.set([]);
      }, 1000); // 1 second delay
    }
  });

  public onChange(): void {
    this.modelValue.set(this.listboxRef()?.nativeElement?.modelValue);
    this.modelValue2.set(this.listboxRef2()?.nativeElement?.modelValue);
  }

  public onChange2(): void {
    this.modelValue2.set(this.listboxRef2()?.nativeElement?.modelValue);
  }
}
