import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxTreeBase } from '../base/checkbox-tree-base';
import {
  CheckboxTreeCtxComponent,
  CheckboxTreeNodeCtxComponent,
} from '@front-lab-nx/ng-form';
import {
  ApiDocumentationComponent,
  ExampleCardComponent,
} from '@front-lab-nx/ng-documentation';
import { CheckboxComponent } from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-ctx-demo',
  imports: [
    ReactiveFormsModule,
    CheckboxTreeNodeCtxComponent,
    CheckboxTreeCtxComponent,
    ExampleCardComponent,
    ApiDocumentationComponent,
  ],
  templateUrl: './checkbox-tree-ctx.html',
  styleUrl: '../base/checkbox-tree-base.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeCtxDemoComponent extends CheckboxTreeBase {
  public checkboxComponent = CheckboxComponent;

  public exampleHtmlCode = `<fl-form-checkbox-tree-ctx [formControl]="folderTreeControl" class="mb-4">
  @for (node of data.value(); track node.id) {
    <fl-form-checkbox-tree-node-ctx
      [node]="node"
      [checkboxComponent]="checkboxComponent"
    ></fl-form-checkbox-tree-node-ctx>
  }
</fl-form-checkbox-tree-ctx>`;

  public exampleCssCode = `/* checkboxes are styled by the checkbox component. something to be changed in the future */
fl-form-checkbox-tree-ctx {
  width: 100%;
  display: block;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-hover);
}`;
}
