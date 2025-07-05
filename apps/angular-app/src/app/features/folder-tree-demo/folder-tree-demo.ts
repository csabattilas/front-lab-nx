import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TreeRepositoryService } from '@front-lab-nx/ng-repository';

import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeVcNoEffectDemoComponent } from './folder-tree-vc-cmp/folder-tree-vc-no-effect-demo';
import { FolderTreeCtxDemoComponent } from './folder-tree-ctx/folder-tree-ctx-demo';
import { FolderTreeVcDemoComponent } from './folder-tree-vc/folder-tree-vc-demo';
import { FolderTreeOptDemoComponent } from './folder-tree-otp/folder-tree-opt-demo';

@Component({
  selector: 'fl-tree-demo',
  imports: [
    FolderTreeOptDemoComponent,
    FolderTreeVcNoEffectDemoComponent,
    FolderTreeCtxDemoComponent,
    ReactiveFormsModule,
    FolderTreeVcDemoComponent,
  ],
  templateUrl: './folder-tree-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeDemoComponent {
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
