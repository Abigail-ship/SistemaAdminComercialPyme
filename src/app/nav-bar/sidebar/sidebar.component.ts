import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sidenavOpen = true;
  menuOpen: string | null = null;
  isDarkTheme = false;
  userName: string = '';  
  userRole: string = '';  

  @Output() toggleEvent = new EventEmitter<boolean>();

  constructor(private router: Router) {
  this.isDarkTheme = localStorage.getItem('theme') === 'dark';
  if (this.isDarkTheme) document.body.classList.add('dark-mode');

  // Leer usuario desde storage
  const storedName = localStorage.getItem('userName');
  const storedRole = localStorage.getItem('role');
    this.userName = storedName ?? '';  // Si hay nombre, usarlo
  this.userRole = storedRole ?? ''; 
}


  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    this.toggleEvent.emit(this.sidenavOpen);
  }

  toggleMenu(menu: string) {
    this.menuOpen = this.menuOpen === menu ? null : menu;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userName'); // ✅ limpiar también el nombre
  localStorage.removeItem('theme'); // opcional
  this.router.navigate(['/login']);
}
goHome() {
  this.router.navigate(['/home']);
}

}
