import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class MenuComponent {
  constructor(private router: Router) {}

  navigate(event: Event, option: string) { 
    event.preventDefault();
    this.router.navigate([option]);
  }
}