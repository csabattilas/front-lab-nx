import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../../base/folder-tree-base-demo';
import {
  FolderTreeNodeOtpComponent,
  FolderTreeTransactionalComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-transactional-opt-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeNodeOtpComponent,
    FolderTreeTransactionalComponent,
  ],
  templateUrl: './folder-tree-opt-demo.html',
  styleUrl: '../../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeOptDemoComponent extends FolderTreeBaseDemo {}
