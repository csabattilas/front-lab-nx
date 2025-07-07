import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../../base/folder-tree-base-demo';
import {
  FolderTreeNodeVcComponent,
  FolderTreeTransactionalComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-transactional-vc-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeNodeVcComponent,
    FolderTreeTransactionalComponent,
  ],
  templateUrl: './folder-tree-vc-demo.html',
  styleUrl: '../../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeVcDemoComponent extends FolderTreeBaseDemo {}
