import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, ValueChangeEvent } from '@angular/forms';
import { filter } from 'rxjs';
import { TreeRepositoryService } from '@front-lab-nx/ng-repository';
import { ApiDocumentationBlock } from '@front-lab-nx/ng-documentation';

@Component({
  template: '',
})
export class CheckboxTreeBase implements OnInit {
  public apiDocumentation: ApiDocumentationBlock[] = [
    {
      name: 'Properties',
      entries: [
        {
          name: 'node',
          type: 'CheckboxTreeNode',
          description:
            'Data node. An element from the root nodes of the tree(data) node',
        },
        {
          name: 'expanded',
          type: 'boolean',
          description: 'Whether the node is expanded',
        },
      ],
    },
  ];

  public folderTreeControl = new FormControl<number[]>([]);
  public newValueControl = new FormControl<string>('11, 12, 13, 14');

  public data = inject(TreeRepositoryService).getTreeDataResource('tree');

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

  // @ts-expect-error TS6133
  private readonly treeEffec = effect(() => {
    const value = `11, 12, 13, 14`;
    this.newValueControl.setValue(value);
  });

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
  }

  public resetControl(): void {
    this.folderTreeControl.reset();
  }
}
