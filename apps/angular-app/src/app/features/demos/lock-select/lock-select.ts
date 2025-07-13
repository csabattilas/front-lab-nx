import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import '@lion/ui/define/lion-option.js';
import '@front-lab-nx/lion-form/tabs';
import {
  ApiDocumentationBlock,
  ApiDocumentationComponent,
  ExampleCardComponent,
} from '@front-lab-nx/ng-documentation';
import { LockSelectExampleComponent } from './example/lock-select-example';

@Component({
  selector: 'fl-lion-locked-selection-demo',
  templateUrl: './lock-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ApiDocumentationComponent,
    LockSelectExampleComponent,
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
          type: 'string',
          description: 'The correct answer value',
        },
        {
          name: 'direction',
          type: `'vertical' | 'horizontal'`,
          description: "Layout direction of options (default: 'vertical')",
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

  public exampleHtmlCode = `<fl-lion-lock-select
    #ls
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
</fl-lion-lock-select>`;

  public exampleHtmlCodeHorizontal = `<fl-lion-lock-select
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
</fl-lion-lock-select>`;

  public exampleCssCode = `lion-option[checked] {
  color: var(--color-surface);
  border: 2px solid var(--color-error);
  background-color: color-mix(in srgb, var(--color-error) 50%, white);
}
lion-option[data-expected] {
  border-color: var(--color-success);
  background-color: color-mix(in srgb, var(--color-success) 50%, white);
}`;
}
