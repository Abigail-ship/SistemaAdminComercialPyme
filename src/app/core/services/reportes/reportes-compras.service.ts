import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.prod'; // 🔹 Importar environment

export interface ReporteCompra {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalCompras: number;
  TotalGastado: number;
  Compras: {
    CompraId: number;
    Proveedor: string;
    Fecha: string;
    Total: number;
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
export class ReportesComprasService {
  private apiUrl = `${environment.apiUrl}/reportescompras`; // 🔹 URL dinámica usando environment

  constructor(private http: HttpClient) {}

  getReporteCompras(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteCompra> {
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
        TotalCompras: data.totalCompras,
        TotalGastado: data.totalGastado,
        Compras: (data.compras || []).map((c: any) => ({
          CompraId: c.compraId,
          Proveedor: c.proveedor,
          Fecha: c.fecha,
          Total: c.total,
          Estado: c.estado,
          Productos: c.productos || []
        }))
      }))
    );
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ReporteCompra {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalCompras: number;
  TotalGastado: number;
  Compras: {
    CompraId: number;
    Proveedor: string;
    Fecha: string;
    Total: number;
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
export class ReportesComprasService {
  private apiUrl = 'https://localhost:7046/api/reportescompras';

  constructor(private http: HttpClient) {}

  getReporteCompras(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteCompra> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('year', year ? year.toString() : '')
      .set('month', month ? month.toString() : '')
      .set('week', week ? week.toString() : '');

    // Mapeamos la respuesta para que coincida con la interfaz
    return this.http.get<any>(this.apiUrl, { params }).pipe(
  map(data => ({
    Tipo: data.tipo || 'mensual',
    Año: data.año,
    Mes: data.mes,
    Semana: data.semana,
    TotalCompras: data.totalCompras,
    TotalGastado: data.totalGastado,
    Compras: (data.compras || []).map((c: any) => ({
      CompraId: c.compraId,
      Proveedor: c.proveedor,
      Fecha: c.fecha,
      Total: c.total,
      Estado: c.estado,
      Productos: c.productos || []
    }))
  }))
);

  }
}
*/