import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

export interface Proveedor {
  proveedorId?: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  activo?: boolean;
}

export interface ProveedoresResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Proveedor[];
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  // ✅ Usa la URL base desde environment
  private apiUrl = `${environment.apiUrl}/admin/proveedoresadmin`;

  constructor(private http: HttpClient) {}

  getProveedores(searchString: string = ''): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}?searchString=${searchString}`);
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  proveedorId?: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  activo?: boolean;
}

export interface ProveedoresResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Proveedor[];
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = 'https://localhost:7046/api/admin/proveedoresadmin';

  constructor(private http: HttpClient) {}
   getProveedores(searchString: string = ''): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}?searchString=${searchString}`);
  }


  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
*/