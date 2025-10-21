import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.prod'; // 🔹 Importar environment

export interface ReporteVenta {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalVentas: number;
  TotalIngresos: number;
  Ventas: {
    VentaId: number;
    Cliente: string;
    MetodoPago: string;
    Fecha: string;
    Total: number;
    TotalPagado?: number;
    Estado?: string;
    Productos: {
      ProductoId: number;
      Cantidad: number;
      PrecioUnitario: number;
      Subtotal: number;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesVentasService {
  private apiUrl = `${environment.apiUrl}/reportesventas`; // 🔹 URL dinámica usando environment

  constructor(private http: HttpClient) {}

  getReporteVentas(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteVenta> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('year', year ? year.toString() : '')
      .set('month', month ? month.toString() : '')
      .set('week', week ? week.toString() : '');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(data => ({
        Tipo: data.tipo || 'mensual',
        Año: data.año,
        Mes: data.mes,
        Semana: data.semana,
        TotalVentas: data.totalVentas,
        TotalIngresos: data.totalIngresos,
        Ventas: (data.ventas || []).map((v: any) => ({
          VentaId: v.ventaId,
          Cliente: v.cliente,
          MetodoPago: v.metodoPago,
          Fecha: v.fecha,
          Total: v.total,
          TotalPagado: v.totalPagado,
          Estado: v.pagado ? 'Pagado' : 'Pendiente',
          Productos: v.productos || []
        }))
      }))
    );
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ReporteVenta {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalVentas: number;
  TotalIngresos: number;
  Ventas: {
    VentaId: number;
    Cliente: string;
    MetodoPago: string;
    Fecha: string;
    Total: number;
    TotalPagado?: number;
    Estado?: string;
    Productos: {
      ProductoId: number;
      Cantidad: number;
      PrecioUnitario: number;
      Subtotal: number;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesVentasService {
  private apiUrl = 'https://localhost:7046/api/reportesventas';

  constructor(private http: HttpClient) {}

  getReporteVentas(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteVenta> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('year', year ? year.toString() : '')
      .set('month', month ? month.toString() : '')
      .set('week', week ? week.toString() : '');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(data => ({
        Tipo: data.tipo || 'mensual',
        Año: data.año,
        Mes: data.mes,
        Semana: data.semana,
        TotalVentas: data.totalVentas,
        TotalIngresos: data.totalIngresos,
        Ventas: (data.ventas || []).map((v: any) => ({
          VentaId: v.ventaId,
          Cliente: v.cliente,
          MetodoPago: v.metodoPago,
          Fecha: v.fecha,
          Total: v.total,
          TotalPagado: v.totalPagado,
          Estado: v.pagado ? "Pagado" : "Pendiente", 
          Productos: v.productos || []
        }))
      }))
    );
  }
}
*/