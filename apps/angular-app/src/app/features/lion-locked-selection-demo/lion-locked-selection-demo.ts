import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-tabs.js';
import '@front-lab-nx/lion-form/locked-selection';
import {
  ApiDocumentationBlock,
  ApiDocumentationComponent,
} from '@front-lab-nx/ng-documentation';
import { LockedSelectionHorizontalComponent } from './locked-selection-example/locked-selection-example';
import { ExampleCardComponent } from '../../../../../../libs/ui/angular/documentation/src/lib/example-card/example-card';

@Component({
  selector: 'fl-lion-locked-selection-demo',
  templateUrl: './lion-locked-selection-demo.html',
  styleUrl: './lion-locked-selection-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ApiDocumentationComponent,
    LockedSelectionHorizontalComponent,
    ExampleCardComponent,
  ],
})
export class LionLockedSelectionDemoComponent {
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
          type: `'vertical' | 'horizonta'`,
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
}
