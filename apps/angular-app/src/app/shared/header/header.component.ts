import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class HeaderComponent {
  public nav = [
    {
      navItemText: 'Home',
      route: '',
    },
    {
      navItemText: 'Checkbox Tree',
      route: 'checkbox-tree',
    },
    {
      navItemText: 'Lock Select',
      route: 'lock-select',
    },
    {
      navItemText: 'Integer digit match',
      route: '/integer-digit-match',
    },
  ];

  public isMenuOpen = false;

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
  }
}
