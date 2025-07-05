import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FolderTreeBaseDemo } from '../base/folder-tree-base-demo';
import {
  FolderTreeComponent,
  FolderTreeNodeVcNoEffectComponent,
} from '@front-lab-nx/ng-form';

@Component({
  selector: 'fl-folder-tree-vc-no-effect-demo',
  imports: [
    ReactiveFormsModule,
    FolderTreeComponent,
    FolderTreeNodeVcNoEffectComponent,
  ],
  templateUrl: './folder-tree-vc-no-effect-demo.html',
  styleUrl: '../base/folder-tree-base-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeVcNoEffectDemoComponent extends FolderTreeBaseDemo {}
