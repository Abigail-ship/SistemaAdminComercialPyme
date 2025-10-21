import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod'; // 🔹 Importar environment

export interface ReporteInventario {
  productoId: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteInventarioService {
  private apiUrl = `${environment.apiUrl}/ReportesInventario/estado-inventario`; // 🔹 URL dinámica usando environment

  constructor(private http: HttpClient) {}

  getEstadoInventario(): Observable<ReporteInventario[]> {
    return this.http.get<ReporteInventario[]>(this.apiUrl);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReporteInventario {
  productoId: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
  estado: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReporteInventarioService {
  private apiUrl = 'https://localhost:7046/api/ReportesInventario/estado-inventario';

  constructor(private http: HttpClient) {}

  getEstadoInventario(): Observable<ReporteInventario[]> {
    return this.http.get<ReporteInventario[]>(this.apiUrl);
  }
}
*/