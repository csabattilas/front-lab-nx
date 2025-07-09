import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import '@front-lab-nx/lion-form/integer-digit';

@Component({
  selector: 'fl-lion-integer-digit-match-demo',
  templateUrl: './lion-integer-digit-match-demo.html',
  styleUrl: './lion-integer-digit-match-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LionIntegerDigitMatchDemoComponent {}
