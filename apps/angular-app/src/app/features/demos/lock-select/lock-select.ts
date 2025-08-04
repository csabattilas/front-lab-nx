import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@lion/ui/define/lion-option.js';
import '@frontlab/lion-form/tabs';
import { ApiDocumentationBlock, ApiDocumentationComponent, ExampleCardComponent } from '@frontlab/ng-documentation';
import { LockSelectExampleComponent } from './examples/list-value/lock-select-example';
import { LockSelectLabelExampleComponent } from './examples/list-label/lock-select-label-example';

@Component({
  selector: 'fl-lion-locked-selection-demo',
  templateUrl: './lock-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ApiDocumentationComponent,
    LockSelectExampleComponent,
    LockSelectLabelExampleComponent,
    ExampleCardComponent,
  ],
})
export class LockSelectComponent {
  public apiDocumentation: ApiDocumentationBlock[] = [
    {
      name: 'Properties',
      entries: [
        {
          name: 'answer',
          type: 'string',
          description: 'The correct answer value',
        },
        {
          name: 'modelValue',
          type: 'Array<{resolved: boolean; selectedValue: string, locked: boolean}>',
          description: 'The correct answer value',
        },
        {
          name: 'direction',
          type: `'vertical' | 'horizontal'`,
          description: "Layout direction of options (default: 'vertical')",
        },
        {
          name: 'max-answers',
          type: `number | undefined`,
          description: 'Maximum number of answers to select (default: undefined)',
        },
      ],
    },
    {
      name: 'Events',
      entries: [
        {
          name: 'model-value-changed',
          type: 'Event',
          description: 'Fired when the selection changes',
        },
      ],
    },
  ];

  public exampleTsCode = `export class LockSelectExampleComponent {
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
}`;

  public exampleHtmlCode = `<p>How much is 17 + 15?</p>
<fl-lion-lock-select
  #ls
  direction="{{direction()}}"
  (model-value-changed)="onChange()"
  [answer]="'32'"
>
  @for(option of ['32','31','33','42']; track $index) {
  <lion-option
    class="rounded border-2 m-1 p-1 text-secondary hover:text-primary cursor-pointer hover:border-primary"
    [choiceValue]="option"
    >{{ option }}</lion-option
  >
  }
</fl-lion-lock-select>

@if(isSolved() === true) {
<span class="success">✓ Correct answer!</span>
} @if(isSolved() === false) {
<span class="error">✗ Wrong answer! Try again.</span>
}`;

  public exampleLabelHtmlCode = `<p>What is the capital of the Netherlands</p>
<fl-lion-lock-select
  #ls
  (model-value-changed)="onChange()"
  [answer]="'a'"
>
  @for(option of quizData; track $index) {
  <lion-option class="text-secondary" [choiceValue]="option.value"
    ><div class="flex gap-1 items-center">
      <span
        class="checkbox border-2 rounded m-1 p-1 block hover:text-primary hover:border-primary"
        >{{ option.value }}</span
      >
      <span>{{ option.label }}</span>
    </div>
  </lion-option>
  }
</fl-lion-lock-select>

@if(isSolved() === true) {
<span class="success">✓ Correct answer!</span>
} @if(isSolved() === false) {
<span class="error">✗ Wrong answer! Try again.</span>
}`;

  public exampleHtmlCodeHorizontal = `<p>How much is 17 + 15?</p>
<fl-lion-lock-select
  #ls
  direction="horizontal"
  (model-value-changed)="onChange()"
  [answer]="'32'"
>
  @for(option of ['32','31','33','42']; track $index) {
  <lion-option
    class="rounded border-2 m-1 p-1 text-secondary hover:text-primary cursor-pointer hover:border-primary"
    [choiceValue]="option"
    >{{ option }}</lion-option
  >
  }
</fl-lion-lock-select>

@if(isSolved() === true) {
<span class="success">✓ Correct answer!</span>
} @if(isSolved() === false) {
<span class="error">✗ Wrong answer! Try again.</span>
}`;

  public exampleCssCode = `lion-option[checked] {
  border: 2px solid var(--color-error);
  background-color: color-mix(in srgb, var(--color-error) 50%, white);
}
lion-option[data-expected] {
  border-color: var(--color-success);
  background-color: color-mix(in srgb, var(--color-success) 50%, white);
}`;

  public exampleLabelCssCode = `lion-option[checked] {
  color: var(--color-error);
  background-color: transparent;
}

lion-option[checked] .checkbox {
  color: var(--color-surface);
  border: 2px solid var(--color-error);
  background-color: color-mix(in srgb, var(--color-error) 30%, white);
}

lion-option[data-expected] {
  color: var(--color-success);
}

lion-option[data-expected] .checkbox {
  border-color: var(--color-success);
  background-color: color-mix(in srgb, var(--color-success) 30%, white);
}`;
}
