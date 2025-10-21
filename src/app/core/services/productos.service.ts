import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

export interface Producto {
  productoId: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: number;
  costo: number | null;
  precioVenta: number | null;
  stock: number | null;
  stockMinimo: number | null;
  fechaCreacion?: Date;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // ✅ Usa la URL base definida en environment
  private apiUrl = `${environment.apiUrl}/admin/productosadmin`;

  constructor(private http: HttpClient) {}

  getProductos(search?: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { params: { search: search || '' } });
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: Producto, imagenFile?: File): Observable<Producto> {
    const formData = new FormData();
    Object.entries(producto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (imagenFile) formData.append('imagenFile', imagenFile);

    return this.http.post<Producto>(this.apiUrl, formData);
  }

  updateProducto(id: number, producto: Producto, imagenFile?: File): Observable<void> {
    const formData = new FormData();
    Object.entries(producto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (imagenFile) formData.append('imagenFile', imagenFile);

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductosStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/stock-bajo`);
  }
}


/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  productoId: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: number;
  costo: number | null;
  precioVenta: number | null;
  stock: number | null;
  stockMinimo: number | null;
  fechaCreacion?: Date;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://localhost:7046/api/admin/productosadmin';

  constructor(private http: HttpClient) {}

  getProductos(search?: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { params: { search: search || '' } });
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: Producto, imagenFile?: File): Observable<Producto> {
    const formData = new FormData();
    Object.entries(producto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (imagenFile) formData.append('imagenFile', imagenFile);

    return this.http.post<Producto>(this.apiUrl, formData);
  }

  updateProducto(id: number, producto: Producto, imagenFile?: File): Observable<void> {
    const formData = new FormData();
    Object.entries(producto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (imagenFile) formData.append('imagenFile', imagenFile);

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductosStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/stock-bajo`);
  }
}

*/
