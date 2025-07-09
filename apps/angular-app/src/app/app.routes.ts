import { Route } from '@angular/router';
import { FolderTreeDemosComponent } from './features/folder-tree-demo/folder-tree-demos';
import { HomeComponent } from './features/home/home.component';
import { LionLockedSelectionDemoComponent } from './features/lion-locked-selection-demo/lion-locked-selection-demo';
import { LionIntegerDigitMatchDemoComponent } from './features/lion-integer-digit-match-demo/lion-integer-digit-match-demo';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Angular Component Experiments',
    pathMatch: 'full',
  },
  {
    path: 'folder-tree',
    component: FolderTreeDemosComponent,
    title: 'Folder Tree Demo',
  },
  {
    path: 'lion-locked-selection',
    component: LionLockedSelectionDemoComponent,
    title: 'Lion Locked Selection Demo',
  },
  {
    path: 'lion-integer-digit-match',
    component: LionIntegerDigitMatchDemoComponent,
    title: 'Lion Integer Digit Match Demo',
  },
];
