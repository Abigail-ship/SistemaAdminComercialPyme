import { Component, OnInit } from '@angular/core';
import { ReportesVentasService, ReporteVenta } from '../../../core/services/reportes/reportes-ventas.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
    styleUrls: ['./reporte-ventas.component.scss'],
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
    CurrencyPipe,
    MatIconModule,
    MatCard
  ]
})
export class ReporteVentasComponent implements OnInit {

  reporte: ReporteVenta = {
    Tipo: 'mensual',
    TotalVentas: 0,
    TotalIngresos: 0,
    Ventas: []
  };
  dataSource = new MatTableDataSource<any>([]);

  tipoReporte: 'mensual' | 'semanal' = 'mensual';
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  week: number = 1;
  loading: boolean = false;

  displayedColumns: string[] = ['id', 'cliente', 'metodoPago', 'fecha', 'total', 'estado'];

  constructor(private reportesService: ReportesVentasService, private router: Router ) {}

  ngOnInit(): void {
    this.getReporte();
  }

  getReporte(): void {
    this.loading = true;
    this.reportesService.getReporteVentas(this.tipoReporte, this.year, this.month, this.week)
      .subscribe({
        next: (data) => {
          this.reporte = { ...data, Ventas: data.Ventas || [] };
          this.dataSource.data = this.reporte.Ventas;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener reporte:', err);
          this.loading = false;
        }
      });
  }
  regresarVentas(): void {
   this.router.navigate(['/ventas']);
}

  exportPDF(): void {
    if (!this.reporte) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 22);

    doc.setFontSize(12);
    let y = 32;

    doc.text(`Tipo: ${this.reporte.Tipo}`, 14, y); y += 8;
    doc.text(`Año: ${this.reporte.Año || ''}`, 14, y); y += 8;
    if (this.reporte.Mes) { doc.text(`Mes: ${this.reporte.Mes}`, 14, y); y += 8; }
    if (this.reporte.Semana) { doc.text(`Semana: ${this.reporte.Semana}`, 14, y); y += 8; }

    const body = this.reporte.Ventas.map(v => [
      v.VentaId?.toString() || '',
      v.Cliente || '',
      v.MetodoPago || '',
      v.Fecha ? new Date(v.Fecha).toLocaleDateString() : '',
      v.Total !== undefined ? Number(v.Total).toFixed(2) : '0.00',
      v.Estado || ''
    ]);

    autoTable(doc, {
      head: [['ID', 'Cliente', 'Método de Pago', 'Fecha', 'Total', 'Estado']],
      body,
      startY: y + 5
    });

    doc.save(`Reporte_Ventas_${this.reporte.Tipo}_${new Date().getTime()}.pdf`);
  }
}
