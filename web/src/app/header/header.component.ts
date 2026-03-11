import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent {
  constructor(private router: Router) { }

  navigateToMenu(event: Event) {
    event.preventDefault();     // Prevent the default form submission
    this.router.navigate(['']); // Navigate to the menu
  }
}