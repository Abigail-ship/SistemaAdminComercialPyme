import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ReporteInventarioService, ReporteInventario } from '../../../core/services/reportes/reportes-inventario.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-reporte-inventario',
  standalone: true,
    imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule
],
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.scss']
})
export class ReporteInventarioComponent implements OnInit {
  inventario: ReporteInventario[] = [];
  // 🔹 Filtro de estado
  filtroEstado: string = 'Todos';

  // 🔹 Columnas para la tabla
  displayedColumns: string[] = ['nombre', 'stock', 'stockMinimo', 'estado'];


  constructor(private reporteInventarioService: ReporteInventarioService) {}

  ngOnInit(): void {
    this.reporteInventarioService.getEstadoInventario().subscribe(data => {
      this.inventario = data;
    });
  }
  // 🔹 Filtrar productos según estado
  get inventarioFiltrado() {
    if (this.filtroEstado === 'Todos') return this.inventario;
    return this.inventario.filter(p => p.estado === this.filtroEstado);
  }

  // 🔹 Contar productos por estado
  contarPorEstado(estado: string): number {
    return this.inventario.filter(p => p.estado === estado).length;
  }
}
