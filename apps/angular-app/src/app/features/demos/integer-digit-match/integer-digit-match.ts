import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@frontlab/lion-form/integer-digit-match';
import '@frontlab/lion-form/tabs';
import { ApiDocumentationBlock, ApiDocumentationComponent, ExampleCardComponent } from '@frontlab/ng-documentation';

@Component({
  selector: 'fl-lion-integer-digit-match-demo',
  templateUrl: './integer-digit-match.html',
  styleUrl: './integer-digit-match.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ApiDocumentationComponent, ExampleCardComponent],
})
export class IntegerDigitMatchComponent {
  public apiDocumentation: ApiDocumentationBlock[] = [
    {
      name: 'Properties',
      entries: [
        {
          name: 'target',
          type: 'string',
          description: 'The target digit list to match',
        },
        {
          name: 'modelValue',
          type: 'string',
          description: 'The current concatenated digits as string',
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
          description: 'Fired when any digit changes',
        },
      ],
    },
  ];

  public exampleTsCode = `tbd...`;

  public exampleHtmlCode = `<fl-lion-integer-digit-match
    [target]="'4829'"
  ></fl-lion-integer-digit-match>`;

  public exampleHtmlCodeLtr = `<fl-lion-integer-digit-match
    [target]="'4829'"
    direction="ltr"
  ></fl-lion-integer-digit-match>`;

  public exampleCssCode = `:host {
  --fl-lion-integer-digit-match-input-width: 7px;
  --fl-lion-integer-digit-match-input-invalid-color: red;
  --fl-lion-integer-digit-match-input-color: black;
  --fl-lion-integer-digit-match-border-input-width: 1px;
}

fl-lion-integer-digit-match {
  display: block;
  margin: 1rem 0;
}

fl-lion-integer-digit-match::part(input-group) {
  display: flex;
  gap: 1px;
  align-items: center;
  justify-content: flex-start;
}
`;
}
