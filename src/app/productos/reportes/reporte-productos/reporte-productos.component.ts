import { Component, OnInit } from '@angular/core';
import { ReportesProductosService, ReporteProducto } from '../../../core/services/reportes/reportes-productos.service';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.scss'],
   imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
  ]
})
export class ReporteProductosComponent implements OnInit {

  reporte: ReporteProducto = {
    Tipo: 'mensual',
    TotalProductos: 0,
    Productos: []
  };

  dataSource = new MatTableDataSource<any>([]);
  tipoReporte: 'mensual' | 'semanal' = 'mensual';
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  week: number = 1;

  loading = false;

  displayedColumns: string[] = ['productoId', 'nombre', 'cantidad', 'total'];

  constructor(private reportesService: ReportesProductosService) {}

  ngOnInit(): void {
    this.getReporte();
  }

  getReporte(): void {
    this.loading = true;
    this.reportesService.getReporteProductos(this.tipoReporte, this.year, this.month, this.week)
      .subscribe({
        next: (data) => {
          this.reporte = data;
          this.dataSource.data = data.Productos;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener reporte:', err);
          this.loading = false;
        }
      });
  }

  exportPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Productos Más Vendidos', 14, 22);

    let y = 32;
    doc.setFontSize(12);
    doc.text(`Tipo: ${this.reporte.Tipo}`, 14, y); y += 8;
    doc.text(`Año: ${this.reporte.Año || ''}`, 14, y); y += 8;

    if (this.reporte.Mes) {
      doc.text(`Mes: ${this.reporte.Mes}`, 14, y); y += 8;
    }
    if (this.reporte.Semana) {
      doc.text(`Semana: ${this.reporte.Semana}`, 14, y); y += 8;
    }

    const body = this.reporte.Productos.map(p => [
      p.ProductoId.toString(),
      p.Nombre,
      p.CantidadVendida.toString(),
      p.TotalGenerado.toFixed(2)
    ]);

    autoTable(doc, {
      head: [['ID', 'Nombre', 'Cantidad Vendida', 'Total Generado']],
      body,
      startY: y + 5
    });

    doc.save(`Reporte_Productos_${this.reporte.Tipo}_${new Date().getTime()}.pdf`);
  }
}
