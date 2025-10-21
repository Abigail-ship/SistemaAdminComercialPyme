import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from './roles.service';
import { environment } from '../../../environments/environment.prod'; 

export interface Usuario {
  usuarioId?: number;
  nombreUsuario: string;
  passwordHash?: string;
  nombreCompleto: string;
  rolId: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  // ✅ Usa la variable del environment
  private apiUrl = `${environment.apiUrl}/admin/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    console.log("📤 Enviando usuario:", usuario);
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from './roles.service';

export interface Usuario {
  usuarioId?: number;
  nombreUsuario: string;
  passwordHash?: string;
  nombreCompleto: string
  rolId: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'https://localhost:7046/api/admin/usuarios'; // ajusta puerto

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    console.log("📤 Enviando usuario:", usuario); // 👀 Ver qué mandas
  return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
*/