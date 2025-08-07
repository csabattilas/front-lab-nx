import { ChangeDetectionStrategy, Component, effect, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { ApiDocumentationBlock, ApiDocumentationComponent, ExampleCardComponent } from '@frontlab/ng-documentation';
import { CheckboxComponent, CheckboxTreeComponent, CheckboxTreeNodeComponent } from '@frontlab/ng-form';
import { TreeRepositoryService } from '@frontlab/ng-repository';
import { filter } from 'rxjs';

@Component({
  selector: 'fl-folder-tree-demo',
  imports: [
    ReactiveFormsModule,
    ApiDocumentationComponent,
    ExampleCardComponent,
    CheckboxTreeNodeComponent,
    CheckboxTreeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './checkbox-tree.html',
  styleUrl: './checkbox-tree.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTreeDemoComponent implements OnInit {
  public apiDocumentation: ApiDocumentationBlock[] = [
    {
      name: 'Properties',
      entries: [
        {
          name: 'node',
          type: 'CheckboxTreeNode',
          description: 'Data node. An element from the root nodes of the tree(data) node',
        },
        {
          name: 'initialExpanded',
          type: 'boolean',
          description:
            'Whether the node is expanded initially. Can be used to expand only the non-leaf nodes initially',
        },
      ],
    },
  ];

  public folderTreeControl = new FormControl<number[]>([]);
  public newValueControl = new FormControl<string>('11, 12, 13, 14');
  public data = inject(TreeRepositoryService).getTreeDataResource('tree');
  public checkboxComponent = CheckboxComponent;
  public checkboxControl = new FormControl<boolean>(true);
  public exampleTsCode = `public folderTreeControl = new FormControl<number[]>([]);
public newValueControl = new FormControl<string>('11, 12, 13, 14');

public data = inject(TreeRepositoryService).getTreeDataResource('tree');

public ngOnInit(): void {
  this.newValueControl.events
    .pipe(filter(event => event instanceof ValueChangeEvent))
    .subscribe(({ value }) =>
      this.folderTreeControl.setValue(
        value
          .split(',')
          .map((v: string) => parseInt(v.trim(), 10))
          .filter(Boolean)
      )
    );
}`;

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

  constructor() {
    effect(() => {
      const value = `11, 12, 13, 14`;
      this.newValueControl.setValue(value);
    });
  }

  public ngOnInit(): void {
    this.newValueControl.events.pipe(filter(event => event instanceof ValueChangeEvent)).subscribe(({ value }) =>
      this.folderTreeControl.setValue(
        value
          .split(',')
          .map((v: string) => parseInt(v.trim(), 10))
          .filter(Boolean)
      )
    );
  }

  public resetControl(): void {
    this.folderTreeControl.reset();
  }
}
