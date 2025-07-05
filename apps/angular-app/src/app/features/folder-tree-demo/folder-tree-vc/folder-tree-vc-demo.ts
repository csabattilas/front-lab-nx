import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../base/folder-tree-base-demo';
import {
  FolderTreeComponent,
  FolderTreeNodeVcComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-vc-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeComponent,
    FolderTreeNodeVcComponent,
  ],
  templateUrl: './folder-tree-vc-demo.html',
  styleUrl: '../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeVcDemoComponent extends FolderTreeBaseDemo {}
