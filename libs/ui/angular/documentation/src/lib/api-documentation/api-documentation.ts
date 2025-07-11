import { Component, input } from '@angular/core';
import { ApiDocumentationBlock } from './api-documentation.model';

@Component({
  selector: 'fl-doc-api',
  templateUrl: './api-documentation.html',
  styleUrl: './api-documentation.scss',
})
export class ApiDocumentationComponent {
  public apiDocumentation = input.required<ApiDocumentationBlock[]>();
}
