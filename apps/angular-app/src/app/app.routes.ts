import { Route } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LockSelectComponent } from './features/demos/lock-select/lock-select';
import { IntegerDigitMatchComponent } from './features/demos/integer-digit-match/integer-digit-match';
import { CheckboxTreeDemoComponent } from './features/demos/checkbox-tree/checkbox-tree/checkbox-tree';
import { CheckboxTreeCtxDemoComponent } from './features/demos/checkbox-tree/checkbox-tree-ctx/checkbox-tree-ctx';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Frontend Lab',
    pathMatch: 'full',
  },
  {
    path: 'checkbox-tree',
    component: CheckboxTreeDemoComponent,
    title: 'Checkbox Tree Demo',
  },
  {
    path: 'checkbox-tree-ctx',
    component: CheckboxTreeCtxDemoComponent,
    title: 'Checkbox Tree Demo',
  },
  {
    path: 'lock-select',
    component: LockSelectComponent,
    title: 'Lion Locked Selection Demo',
  },
  {
    path: 'integer-digit-match',
    component: IntegerDigitMatchComponent,
    title: 'Lion Integer Digit Match Demo',
  },
];
