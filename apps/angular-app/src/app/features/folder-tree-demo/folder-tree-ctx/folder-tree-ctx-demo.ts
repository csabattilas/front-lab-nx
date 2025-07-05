import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../base/folder-tree-base-demo';
import {
  FolderTreeCtxComponent,
  FolderTreeNodeCtxComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-ctx-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeNodeCtxComponent,
    FolderTreeCtxComponent,
  ],
  templateUrl: './folder-tree-ctx-demo.html',
  styleUrl: '../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeCtxDemoComponent extends FolderTreeBaseDemo {}
