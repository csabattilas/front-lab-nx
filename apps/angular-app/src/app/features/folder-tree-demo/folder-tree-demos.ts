import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TreeRepositoryService } from '@front-lab-nx/ng-repository';

import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeDemoComponent } from './folder-tree/folder-tree-demo';
import { FolderTreeOptDemoComponent } from './folder-tree-transactional/folder-tree-otp/folder-tree-opt-demo';
import { FolderTreeVcDemoComponent } from './folder-tree-transactional/folder-tree-vc/folder-tree-vc-demo';
import { FolderTreeCtxDemoComponent } from './folder-tree-ctx/folder-tree-ctx-demo';

@Component({
  selector: 'fl-tree-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeDemoComponent,
    FolderTreeOptDemoComponent,
    FolderTreeVcDemoComponent,
    FolderTreeCtxDemoComponent,
  ],
  templateUrl: './folder-tree-demos.html',
  styleUrl: './folder-tree-demos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeDemosComponent {
  public treeData = inject(TreeRepositoryService).getTreeDataResource();
  public largeTreeData = inject(TreeRepositoryService).getTreeDataResource(
    'largeTree'
  );
  public isLargeTree = false;

  public switchToLargeTree(): void {
    this.treeData = this.largeTreeData;
    this.isLargeTree = !this.isLargeTree;
  }
}
