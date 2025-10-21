import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagosService } from '../../core/services/pagos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-procesar-pago-dialog',
  templateUrl: './procesar-pago-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class ProcesarPagoDialogComponent {
  metodosPago: any[] = [];
  metodoSeleccionado: number | null = null;
  referencia: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public venta: any,
    private dialogRef: MatDialogRef<ProcesarPagoDialogComponent>,
    private pagosService: PagosService
  ) {}

  ngOnInit(): void {
    this.pagosService.obtenerMetodosPago()
      .subscribe(data => this.metodosPago = data);
  }

  esTransferencia(): boolean {
    const metodo = this.metodosPago.find(m => m.metodoPagoId === this.metodoSeleccionado);
    return metodo ? metodo.nombre.toLowerCase().includes('transferencia') : false;
  }

  esTarjeta(): boolean {
    const metodo = this.metodosPago.find(m => m.metodoPagoId === this.metodoSeleccionado);
    return metodo ? metodo.nombre.toLowerCase().includes('tarjeta') : false;
  }

  procesarPago(): void {
  if (!this.metodoSeleccionado) return;

  const pagoData = {
    metodoPagoId: this.metodoSeleccionado,
    referencia: this.referencia
  };

  this.pagosService.procesarPago(this.venta.ventaId, pagoData.metodoPagoId, pagoData.referencia)
    .subscribe(res => {
      if (res.success) {
        alert('Pago procesado con éxito');
        this.dialogRef.close(true);
      } else {
        alert(res.error);
      }
    });
}

}
