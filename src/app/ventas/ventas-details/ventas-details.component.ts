import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProcesarPagoDialogComponent } from '../../pagos-ventas/procesar-pago-dialog/procesar-pago-dialog.component';
import { DatePipe, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-ventas-details',
  standalone: true,
  templateUrl: './ventas-details.component.html',
    styleUrls: ['./ventas-details.component.scss'],
  imports: [
    NgIf,
    DatePipe,
    RouterModule,
    CurrencyPipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
]
})
export class VentasDetailsComponent implements OnInit {
  venta: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`${environment.apiUrl}/ventasadmin/${id}`)
      .subscribe(data => this.venta = data);
  }

  abrirDialogPago(): void {
    this.dialog.open(ProcesarPagoDialogComponent, {
      width: '600px',
      data: this.venta
    });
  }
  generarTicket(venta: any) {
  if (!venta) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200] // ticket pequeño
  });

  // ─── Cabecera ───
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Artesanías Pyme', 40, 10, { align: 'center' });

  const fechaVenta = new Date(venta.fecha);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Venta #${venta.ventaId}`, 5, 20);
  doc.text(`Cliente: ${venta.cliente?.nombres || ''} ${venta.cliente?.apellidos || ''}`, 5, 30);

  doc.setFont('helvetica', 'normal');
  doc.text(`${fechaVenta.toLocaleDateString()} ${fechaVenta.toLocaleTimeString()}`, 5, 25);

  // ─── Tabla de productos ───
  const rows = (venta.detalleventa || []).map((item: any) => [
    item.producto?.nombre || '',
    item.cantidad.toString(),
    `$${item.precioUnitario.toFixed(2)}`,
    `$${item.subtotal.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['Producto', 'Cant', 'Precio', 'Subt']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
  });

  const yAfterTable = (doc as any).lastAutoTable.finalY + 5;

  // ─── Totales ───
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${venta.total.toFixed(2)}`, 5, yAfterTable);
  if (venta.totalPagado !== undefined) {
    doc.text(`Total Pagado: $${venta.totalPagado.toFixed(2)}`, 5, yAfterTable + 5);
  }

  if (venta.totalPagado === undefined || venta.totalPagado < venta.total) {
    doc.text(`Saldo pendiente: $${(venta.total - (venta.totalPagado || 0)).toFixed(2)}`, 5, yAfterTable + 10);
    doc.text('¡¡Favor de completar el pago!!', 5, yAfterTable + 15);
  } else {
    doc.text('¡¡Venta totalmente pagada!!', 5, yAfterTable + 10);
  }

  // ─── Pie ───
  const horaActual = new Date();
  doc.setFont('helvetica', 'normal');
  doc.text(horaActual.toLocaleTimeString(), 5, yAfterTable + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('¡Gracias por su preferencia!', 40, yAfterTable + 25, { align: 'center' });

  // ─── Abrir en nueva pestaña ───
  const pdfBlob = doc.output('bloburl');
  window.open(pdfBlob);
}

}
