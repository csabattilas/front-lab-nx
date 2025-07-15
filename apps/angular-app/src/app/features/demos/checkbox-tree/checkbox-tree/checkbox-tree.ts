import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxTreeBase } from '../base/checkbox-tree-base';
import {
  ApiDocumentationComponent,
  ExampleCardComponent,
} from '@front-lab-nx/ng-documentation';
import {
  CheckboxComponent,
  CheckboxTreeComponent,
  CheckboxTreeNodeComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-demo',
  imports: [
    ReactiveFormsModule,
    ApiDocumentationComponent,
    ExampleCardComponent,
    CheckboxTreeNodeComponent,
    CheckboxTreeComponent,
    CheckboxComponent,
  ],
  templateUrl: './checkbox-tree.html',
  styleUrl: '../base/checkbox-tree-base.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeDemoComponent extends CheckboxTreeBase {
  public checkboxComponent = CheckboxComponent;
  public checkboxControl = new FormControl<boolean>(true);

  public exampleHtmlCode = `<fl-form-checkbox-tree [formControl]="folderTreeControl" class="mb-4">
  @for (node of data.value(); track node.id) {
    <fl-form-checkbox-tree-node
      [node]="node"
      [checkboxComponent]="checkboxComponent"
    ></fl-form-checkbox-tree-node>
  }
</fl-form-checkbox-tree>`;

  public exampleCssCode = `/* checkboxes are styled by the checkbox component. something to be changed in the future */
fl-form-checkbox-tree {
  width: 100%;
  display: block;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-hover);
}`;
}
