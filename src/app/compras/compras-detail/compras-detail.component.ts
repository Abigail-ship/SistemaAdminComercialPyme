import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComprasService, Compra, PagoCompraDto } from '../../core/services/compras.service';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-compras-detail',
  templateUrl: './compras-detail.component.html',
    styleUrls: ['./compras-detail.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule
]
})
export class ComprasDetailComponent implements OnInit {
  compra?: Compra;   // ahora opcional
  mostrarPago: boolean = false;
  metodosPago: any[] = [];
  pagoForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private comprasService: ComprasService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    // 🔹 Solo carga detalle si existe un id válido en la ruta
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.cargarCompra(id);
      }
    }

    this.cargarMetodosPago();

    this.pagoForm = this.fb.group({
      metodoPagoId: ['', Validators.required],
      monto: ['', Validators.required],
      referencia: [''],
      tarjetaNumero: [''],
      tarjetaExpiracion: [''],
      tarjetaCvc: ['']
    });
  }

  cargarCompra(id: number) {
    this.comprasService.getCompra(id).subscribe({
      next: (data: Compra) => this.compra = data,
      error: () => alert("❌ Error: no se pudo cargar la compra")
    });
  }

  cargarMetodosPago() {
    this.comprasService.getMetodosPago().subscribe({
      next: (data: any[]) => this.metodosPago = data,
      error: () => alert("❌ Error: no se pudieron cargar los métodos de pago")
    });
  }

  generarTicket(compra: Compra) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200]
  });

  // ─── Cabecera ───
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Artesanías Pyme', 40, 10, { align: 'center' });

  const fechaCompra = new Date(compra.fecha);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Compra #${compra.compraId}`, 5, 20);
  doc.text(`Proveedor: ${compra.proveedor?.nombre || ''}`, 5, 30);

  doc.setFont('helvetica', 'normal');
  doc.text(`${fechaCompra.toLocaleDateString()} ${fechaCompra.toLocaleTimeString()}`, 5, 25);

  // ─── Tabla de productos ───
  const rows = compra.detalleCompras.map(item => [
    item.producto?.nombre || '',
    item.cantidad.toString(),
    `$${item.precioUnitario.toFixed(4)}`,
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
  doc.text(`Total: $${compra.total.toFixed(2)}`, 5, yAfterTable);
  if (compra.totalPagado !== undefined) {
    doc.text(`Total Pagado: $${compra.totalPagado.toFixed(2)}`, 5, yAfterTable + 5);
  }

  if (compra.totalPagado === undefined || compra.totalPagado < compra.total) {
    doc.text(`Saldo pendiente: $${(compra.total - (compra.totalPagado || 0)).toFixed(2)}`, 5, yAfterTable + 10);
    doc.text('¡¡Favor de completar el pago!!', 5, yAfterTable + 15);
  } else {
    doc.text('¡¡Compra totalmente pagada!!', 5, yAfterTable + 10);
  }

  // ─── Pie ───
  const horaActual = new Date();
  doc.setFont('helvetica', 'normal');
  doc.text(horaActual.toLocaleTimeString(), 5, yAfterTable + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('¡Gracias por su preferencia!', 40, yAfterTable + 25, { align: 'center' });

  // ─── Abrir en otra pestaña ───
  const pdfBlob = doc.output('bloburl');
  window.open(pdfBlob);
}



}
