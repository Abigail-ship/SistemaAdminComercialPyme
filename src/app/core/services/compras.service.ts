import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

// 📌 Interfaces
export interface DetalleCompra {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: {
    productoId: number;
    nombre: string;
  };
}

export interface Compra {
  compraId?: number;
  proveedorId: number;
  fecha: string;
  total: number;
  detalleCompras: DetalleCompra[];
  totalPagado?: number;
  estado?: 'Pendiente' | 'Pagada' | 'Cancelada';
  metodoPagoId?: number;
  fechaPago?: string;
  referenciaPago?: string;
  proveedor?: {
    proveedorId: number;
    nombre: string;
    email?: string;
  };
  clientSecret?: string; 
}

export interface PagoCompraDto {
  compraId: number;
  metodoPagoId: number;
  referencia?: string;
  montoPagado: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = `${environment.apiUrl}/admin/comprasadmin`; // 🔹 URL usando environment

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // 📌 CRUD de Compras
  getCompras(searchTerm: string = ''): Observable<Compra[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchString', searchTerm);
    return this.http.get<Compra[]>(this.apiUrl, { params });
  }

  getCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  createCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  updateCompra(id: number, compra: Compra): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, compra);
  }

  deleteCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // 📌 Métodos de Pago
  getMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/metodospago`);
  }

  // Efectivo o Tarjeta
  procesarPago(pago: PagoCompraDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-pago`, pago);
  }

  confirmarPago(pago: PagoCompraDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-pago`, pago);
  }

  generarPaymentIntent(compraId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generar-payment-intent/${compraId}`, {});
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// 📌 Interfaces
export interface DetalleCompra {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: {
    productoId: number;
    nombre: string;
  };
}

export interface Compra {
  compraId?: number;
  proveedorId: number;
  fecha: string;
  total: number;
  detalleCompras: DetalleCompra[];
  totalPagado?: number;
  estado?: 'Pendiente' | 'Pagada' | 'Cancelada';
  metodoPagoId?: number;   // ✅ ya lo agregamos
  fechaPago?: string;
  referenciaPago?: string;
  proveedor?: {
    proveedorId: number;
    nombre: string;
    email?: string;
  };
   clientSecret?: string; 
}

export interface PagoCompraDto {
  compraId: number;
  metodoPagoId: number;
  referencia?: string;
  montoPagado: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'https://localhost:7046/api/admin/comprasadmin';

  constructor(private http: HttpClient) {}

   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // 📌 CRUD de Compras
  getCompras(searchTerm: string = ''): Observable<Compra[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchString', searchTerm);
    return this.http.get<Compra[]>(this.apiUrl, { params });
  }

  getCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  createCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  updateCompra(id: number, compra: Compra): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, compra);
}

  deleteCompra(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

  // 📌 Métodos de Pago
  getMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/metodospago`);
  }

  // Efectivo o Tarjeta
  procesarPago(pago: PagoCompraDto): Observable<any> {
  return this.http.post(`${this.apiUrl}/confirmar-pago`, pago);
}

  confirmarPago(pago: PagoCompraDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-pago`, pago);
  }
  generarPaymentIntent(compraId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/generar-payment-intent/${compraId}`, {});
}

}
*/