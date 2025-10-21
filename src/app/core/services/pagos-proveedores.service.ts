import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

export interface CompraPendiente {
  compraId: number;
  proveedor: { nombre: string, email?: string };
  total: number;
  totalPagado?: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagosProveedoresService {
  // ✅ Usa la URL base del environment
  private apiUrl = `${environment.apiUrl}/api/admin/pagosadmin`;

  constructor(private http: HttpClient) {}

  getComprasPendientes(): Observable<CompraPendiente[]> {
    return this.http.get<CompraPendiente[]>(`${this.apiUrl}/pendientes`);
  }

  crearPaymentIntent(compraId: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/crear-payment-intent`,
      { compraId } // ✅ Manda como objeto JSON
    );
  }

  confirmarPago(compraId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-pago`, { compraId });
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompraPendiente {
  compraId: number;
  proveedor: { nombre: string, email?: string };
  total: number;
  totalPagado?: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagosProveedoresService {
  private apiUrl = 'https://localhost:7046/api/admin/pagosadmin';

  constructor(private http: HttpClient) {}

  getComprasPendientes(): Observable<CompraPendiente[]> {
    return this.http.get<CompraPendiente[]>(`${this.apiUrl}/pendientes`);
  }

  crearPaymentIntent(compraId: number): Observable<{ clientSecret: string }> {
    // 👇 importante: mandar JSON, no el número plano
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/crear-payment-intent`,
      { compraId }  // <-- así tu backend lo recibirá como propiedad
    );
  }
  confirmarPago(compraId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/confirmar-pago`, { compraId });
}

}
*/