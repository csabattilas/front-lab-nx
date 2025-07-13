import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Framework {
  name: string;
  logo: string;
  version: string;
}

interface Feature {
  title: string;
  subtitle: string;
  description: string;
  route: string;
}

@Component({
  selector: 'fl-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterModule],
})
export class HomeComponent {
  public features: Feature[] = [
    {
      title: 'Checkbox tree',
      subtitle: 'angular, signal, viewchildren, reactive forms, custom control',

      description: 'Checkbox tree implementation using angular signals',
      route: 'checkbox-tree',
    },
    {
      title: 'Checkbox tree (ctx)',
      subtitle:
        'angular, signal, context service, reactive forms, custom control',

      description: 'Checkbox tree implementation using angular signals',
      route: 'checkbox-tree-ctx',
    },
    {
      title: 'Lock select',
      subtitle: 'ing, lion-ui, listbox',
      description:
        'Locked select control with select and lock functionality based on ING Lion Listbox',
      route: 'lock-select',
    },
    {
      title: 'Integer digit match',
      subtitle: 'ing, lion-ui, lionfield',
      description:
        'Integer digit match control with digit match functionality based on ING Lion LionField',
      route: 'integer-digit-match',
    },
  ];

  public frameworks: Framework[] = [
    {
      name: 'Angular',
      logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
      version: '20.0.0',
    },
    {
      name: 'ING Lion UI',
      logo: 'https://lion.js.org/d5fa0103.svg',
      version: '0.11.5',
    },
  ];
}
