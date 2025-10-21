import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
    standalone: true, 
  imports: [FormsModule, CommonModule, MatCardModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent {
  nombreUsuario = '';
  contrasena = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.nombreUsuario, this.contrasena).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.error = 'Usuario o contraseña incorrectos'
    });
  }
}
