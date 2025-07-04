import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class HeaderComponent {
  public isMenuOpen = false;

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
  }
}
