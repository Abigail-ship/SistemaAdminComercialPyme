import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // 🔹 Importar environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin/auth`; // 🔹 URL dinámica usando environment

  constructor(private http: HttpClient) {}

  login(nombreUsuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      { NombreUsuario: nombreUsuario, Contraseña: contrasena },
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role?.nombre ?? 'Usuario');
          localStorage.setItem('userName', res.nombreCompleto ?? nombreUsuario);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7046/api/admin/auth'; // Ajusta a tu backend

  constructor(private http: HttpClient) {}

login(nombreUsuario: string, contrasena: string) {
  return this.http.post<any>(
    `${this.apiUrl}/login`,
    { NombreUsuario: nombreUsuario, Contraseña: contrasena },
    { headers: { 'Content-Type': 'application/json' } }
  ).pipe(
    tap(res => {
      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role?.nombre ?? 'Usuario');
        localStorage.setItem('userName', res.nombreCompleto ?? nombreUsuario); // ✅ Guardar nombre real
      }
    })
  );
}
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
*/