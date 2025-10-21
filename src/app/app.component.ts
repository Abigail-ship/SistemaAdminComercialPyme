import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './nav-bar/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, SidebarComponent, MatSidenavModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SistemaComercialPyme';
  isLoggedIn = false;

  constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.isLoggedIn = !!localStorage.getItem('token') && event.url !== '/login';
    }
  });
}

}
