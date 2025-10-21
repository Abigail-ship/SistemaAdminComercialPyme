import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Venta {
  ventaId?: number;
  ClienteId: number;
  Total?: number;
  TotalPagado?: number;
  MetodoPagoId?: number;
  Pagado?: boolean;
  FechaPago?: string;
  ReferenciaPago?: string;
  StripePaymentIntentId?: string;
  Estado?: string;
  Detalleventa?: DetalleVenta[];
  Fecha?: string;
  cliente?: { clienteId: number; nombres: string; apellidos: string; nombreComercial: string; direccion?: string; activo?: number };
  metodoPago?: { metodoPagoId: number; nombre: string; descripcion?: string; activo?: number };
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  // 🔹 Usa la URL base desde environment
  private apiUrl = `${environment.apiUrl}/ventasadmin`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  crearVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  obtenerVentaPorId(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  actualizarVenta(id: number, venta: Venta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  obtenerPrecioProducto(productoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/precio/${productoId}`);
  }

  crearCheckoutSession(ventaId: number) {
    return this.http.post(`${this.apiUrl}/crear-checkout-session`, { ventaId });
  }
}



/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Venta {
  ventaId?: number; 
  ClienteId: number; // debe coincidir con C# (mayúscula inicial)
  Total?: number;
  TotalPagado?: number;
  MetodoPagoId?: number;
  Pagado?: boolean;
  FechaPago?: string;
  ReferenciaPago?: string;
  StripePaymentIntentId?: string;
  Estado?: string;
  Detalleventa?: DetalleVenta[]; // coincide con el backend
  Fecha?: string; // incluir para enviar la fecha
  cliente?: { clienteId: number; nombres: string; apellidos: string; nombreComercial: string; direccion?: string; activo?: number };
  metodoPago?: { metodoPagoId: number; nombre: string; descripcion?: string; activo?: number };
  
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = 'https://localhost:7046/api/ventasadmin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  crearVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  obtenerVentaPorId(id: number): Observable<Venta> {
  return this.http.get<Venta>(`${this.apiUrl}/${id}`);
}

  actualizarVenta(id: number, venta: Venta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

  obtenerPrecioProducto(productoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/precio/${productoId}`);
  }
  crearCheckoutSession(ventaId: number) {
  return this.http.post(`${this.apiUrl}/crear-checkout-session`, { ventaId });
}
}
*/

