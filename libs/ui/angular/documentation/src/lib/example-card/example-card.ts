import { Component, input } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

import 'highlight.js/styles/github.css';

@Component({
  selector: 'fl-doc-example-card',
  imports: [Highlight],
  templateUrl: './example-card.html',
  styleUrl: './example-card.css',
})
export class ExampleCardComponent {
  public exampleTsCode = input<string>();
  public exampleCssCode = input<string>();
  public exampleHtmlCode = input<string>();
}
