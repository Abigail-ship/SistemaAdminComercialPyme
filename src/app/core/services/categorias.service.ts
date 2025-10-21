import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // 🔹 Importar environment
import { Producto } from './productos.service';

export interface Categoria {
  categoriaId?: number;
  nombre: string;
  productos?: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/admin/categorias`; // 🔹 URL usando environment

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categoria): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './productos.service';

export interface Categoria {
  categoriaId?: number;
  nombre: string;
  productos?: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = 'https://localhost:7046/api/admin/categorias';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categoria): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
*/  