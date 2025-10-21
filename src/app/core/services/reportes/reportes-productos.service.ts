import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.prod'; // 🔹 Importar environment

export interface ReporteProducto {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalProductos: number;
  Productos: {
    ProductoId: number;
    Nombre: string;
    CantidadVendida: number;
    TotalGenerado: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesProductosService {
  private apiUrl = `${environment.apiUrl}/reportesproductos`; // 🔹 URL dinámica usando environment

  constructor(private http: HttpClient) {}

  getReporteProductos(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteProducto> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('year', year ? year.toString() : '')
      .set('month', month ? month.toString() : '')
      .set('week', week ? week.toString() : '');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(data => ({
        Tipo: data.tipo,
        Año: data.año,
        Mes: data.mes,
        Semana: data.semana,
        TotalProductos: data.totalProductos,
        Productos: (data.productos || []).map((p: any) => ({
          ProductoId: p.productoId,
          Nombre: p.nombre,
          CantidadVendida: p.cantidadVendida,
          TotalGenerado: p.totalGenerado
        }))
      }))
    );
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ReporteProducto {
  Tipo: string;
  Año?: number;
  Mes?: number;
  Semana?: number;
  TotalProductos: number;
  Productos: {
    ProductoId: number;
    Nombre: string;
    CantidadVendida: number;
    TotalGenerado: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesProductosService {
  private apiUrl = 'https://localhost:7046/api/reportesproductos';

  constructor(private http: HttpClient) {}

  getReporteProductos(
    tipo: 'mensual' | 'semanal',
    year?: number,
    month?: number,
    week?: number
  ): Observable<ReporteProducto> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('year', year ? year.toString() : '')
      .set('month', month ? month.toString() : '')
      .set('week', week ? week.toString() : '');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
  map(data => ({
    Tipo: data.tipo,
    Año: data.año,
    Mes: data.mes,
    Semana: data.semana,
    TotalProductos: data.totalProductos,
    Productos: (data.productos || []).map((p: any) => ({
      ProductoId: p.productoId,
      Nombre: p.nombre,
      CantidadVendida: p.cantidadVendida,
      TotalGenerado: p.totalGenerado
    }))
  }))
);

  }
}
*/