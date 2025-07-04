import { Route } from '@angular/router';
import { FolderTreeDemoComponent } from './features/folder-tree-demo/folder-tree-demo';
import { HomeComponent } from './features/home/home.component';
import { LionLockedSelectionDemoComponent } from './features/lion-locked-selection-demo/lion-locked-selection-demo.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Angular Component Experiments',
    pathMatch: 'full',
  },
  {
    path: 'folder-tree',
    component: FolderTreeDemoComponent,
    title: 'Folder Tree Demo',
  },
  {
    path: 'lion-locked-selection',
    component: LionLockedSelectionDemoComponent,
    title: 'Lion Locked Selection Demo',
  },
];
