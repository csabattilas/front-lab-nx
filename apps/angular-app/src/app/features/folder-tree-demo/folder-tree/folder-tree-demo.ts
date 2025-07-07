import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../base/folder-tree-base-demo';
import {
  FolderTreeComponent,
  FolderTreeNodeComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-demo',
  imports: [ReactiveFormsModule, FolderTreeComponent, FolderTreeNodeComponent],
  templateUrl: './folder-tree-demo.html',
  styleUrl: '../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeDemoComponent extends FolderTreeBaseDemo {}
