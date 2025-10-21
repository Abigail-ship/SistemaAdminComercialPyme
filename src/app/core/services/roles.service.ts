import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface Rol {
  rolId: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // ✅ Usa environment.apiUrl para mayor flexibilidad
  private apiUrl = `${environment.apiUrl}/admin/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  getRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  createRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol);
  }

  updateRol(id: number, rol: Rol): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, rol);
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
  rolId: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://localhost:7046/api/admin/roles'; // ajusta puerto de tu API

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  getRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  createRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol);
  }

  updateRol(id: number, rol: Rol): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, rol);
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

*/