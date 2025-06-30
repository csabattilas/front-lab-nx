import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FolderTreeComponent,
  FolderTreeNodeOtpComponent,
  FolderTreeNodeVcComponent,
  FolderTreeCtxComponent,
  FolderTreeNodeCtxComponent,
} from '@front-lab-nx/ng-form';
import { TreeRepositoryService } from '@front-lab-nx/ng-repository';
import { inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fl-tree-demo',
  imports: [
    FolderTreeComponent,
    FolderTreeNodeOtpComponent,
    FolderTreeNodeVcComponent,
    FolderTreeCtxComponent,
    FolderTreeNodeCtxComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './folder-tree-demo.scss',
  templateUrl: './folder-tree-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeDemoComponent implements OnInit {
  public treeData = inject(TreeRepositoryService).getTreeDataResource();
  public folderSelectionControlOutputBasedTree = new FormControl<number[]>([3]);
  public folderSelectionControlViewChildBasedTree = new FormControl<number[]>([
    4,
  ]);

  public folderSelectionControlContextServiceBasedTree = new FormControl<
    number[]
  >([3]);

  private readonly cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    // perhaps better to have a formgroup here
    this.folderSelectionControlViewChildBasedTree.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });

    this.folderSelectionControlContextServiceBasedTree.valueChanges.subscribe(
      () => {
        this.cdr.markForCheck();
      }
    );

    this.folderSelectionControlOutputBasedTree.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  public clearSelectionOutputBasedTree(): void {
    this.folderSelectionControlOutputBasedTree.reset();
  }

  public clearSelectionViewchildBasedTree(): void {
    this.folderSelectionControlViewChildBasedTree.reset();
  }

  public clearSelectionContextBasedTree(): void {
    this.folderSelectionControlContextServiceBasedTree.reset();
  }
}
