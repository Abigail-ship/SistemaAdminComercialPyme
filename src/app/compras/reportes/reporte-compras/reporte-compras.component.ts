import { Component, OnInit } from '@angular/core';
import { ReportesComprasService, ReporteCompra } from '../../../core/services/reportes/reportes-compras.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
    styleUrls: ['./reporte-compras.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    DatePipe,
    CurrencyPipe,
    MatIconModule,
    MatCard
]
})
export class ReporteComprasComponent implements OnInit {

  reporte: ReporteCompra = {
  Tipo: 'mensual',
  TotalCompras: 0,
  TotalGastado: 0,
  Compras: []
};
dataSource = new MatTableDataSource<any>([]); 

  tipoReporte: 'mensual' | 'semanal' = 'mensual';
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  week: number = 1;

  loading: boolean = false;

  displayedColumns: string[] = ['id', 'proveedor', 'fecha', 'total', 'estado'];
 // <-- inicializamos con array vacío

  
  constructor(private reportesService: ReportesComprasService, private router: Router) {}

  ngOnInit(): void {
    this.getReporte();
  }

  // Solo eliminamos los (change) y (selectionChange) y usamos el botón Filtrar
  getReporte(): void {
  this.loading = true;
  this.reportesService.getReporteCompras(this.tipoReporte, this.year, this.month, this.week)
  .subscribe({
    next: (data) => {
      console.log('Datos recibidos del backend:', data);

      // Usar "data.compras" en lugar de "data.Compras"
      this.reporte = { 
        ...data, 
        Compras: data.Compras || []  // <-- aquí está la corrección
      };

      console.log('Compras después de asignar:', this.reporte.Compras);
      this.dataSource.data = this.reporte.Compras;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al obtener reporte:', err);
      this.loading = false;
    }
  });
}
goToCompras(): void {
  this.router.navigate(['/compras']);
}


 exportPDF(): void {
  if (!this.reporte) return;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Reporte de Compras', 14, 22);

  doc.setFontSize(12);
  let y = 32; // posición inicial debajo del título

  doc.text(`Tipo: ${this.reporte.Tipo}`, 14, y);
  y += 8;

  doc.text(`Año: ${this.reporte.Año || ''}`, 14, y);
  y += 8;

  if (this.reporte.Mes) {
    doc.text(`Mes: ${this.reporte.Mes}`, 14, y);
    y += 8;
  }

  if (this.reporte.Semana) {
    doc.text(`Semana: ${this.reporte.Semana}`, 14, y);
    y += 8;
  }

  const body = this.reporte.Compras.map(c => [
    c.CompraId?.toString() || '',
    c.Proveedor || '',
    c.Fecha ? new Date(c.Fecha).toLocaleDateString() : '',
    c.Total !== undefined ? Number(c.Total).toFixed(2) : '0.00',
    c.Estado || ''
  ]);

  autoTable(doc, {
    head: [['ID', 'Proveedor', 'Fecha', 'Total', 'Estado']],
    body,
    startY: y + 5
  });

  doc.save(`Reporte_Compras_${this.reporte.Tipo}_${new Date().getTime()}.pdf`);
}



}
