import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

export interface Cliente {
  clienteId?: number;
  nombres: string;
  apellidos: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tipoCliente?: string;
  fechaRegistro?: Date;
  esGenerico?: boolean;
}

export interface ClientesResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Cliente[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/admin/clientesadmin`; // 🔹 URL usando environment

  constructor(private http: HttpClient) {}

  getClientes(searchString: string = '', page: number = 1, pageSize: number = 10): Observable<ClientesResponse> {
    return this.http.get<ClientesResponse>(
      `${this.apiUrl}?searchString=${searchString}&page=${page}&pageSize=${pageSize}`
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  clienteId?: number;
  nombres: string;
  apellidos: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tipoCliente?: string;
  fechaRegistro?: Date;
  esGenerico?: boolean;
}
export interface ClientesResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Cliente[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'https://localhost:7046/api/admin/clientesadmin';

  constructor(private http: HttpClient) {}

getClientes(searchString: string = '', page: number = 1, pageSize: number = 10): Observable<ClientesResponse> {
  return this.http.get<ClientesResponse>(
    `${this.apiUrl}?searchString=${searchString}&page=${page}&pageSize=${pageSize}`
  );
}

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
*/