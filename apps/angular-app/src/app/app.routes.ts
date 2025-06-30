import { Route } from '@angular/router';
import { FolderTreeDemoComponent } from './features/folder-tree-demo/folder-tree-demo';
import { HomeComponent } from './features/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Angular Component Experiments',
    pathMatch: 'full',
  },
  {
    path: 'tree',
    component: FolderTreeDemoComponent,
    title: 'Tree Demo',
  },
];
