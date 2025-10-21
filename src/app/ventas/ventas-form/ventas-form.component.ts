import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VentasService, Venta, DetalleVenta } from '../../core/services/ventas.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-ventas-form',
  templateUrl: './ventas-form.component.html',
  styleUrls: ['./ventas-form.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,RouterModule, CommonModule, MatInputModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule
  ]
})
export class VentasFormComponent implements OnInit {
  ventaForm!: FormGroup;
  clientes: any[] = [];
  productos: Producto[] = [];
  esEdicion = false;
  pagoEnProceso: boolean = false;
  metodoSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ventasService: VentasService,
    private productosService: ProductosService,
    private http: HttpClient,
    private notificacionesService: NotificacionesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      ventaId: [null],
      ClienteId: [null, Validators.required],
      Fecha: [new Date(), Validators.required],
      MetodoPagoId: [null, Validators.required],
      Total: [0],
      TotalPagado: [0],
      detalleVentas: this.fb.array([])
    });

    this.cargarClientes();
    this.cargarProductos();

    this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.esEdicion = true;
      this.ventasService.obtenerVentaPorId(+id).subscribe({
        next: (venta) => this.cargarVentaEnFormulario(venta),
        error: (err) => console.error("Error al cargar venta:", err)
      });
    } else {
      this.agregarProducto();
    }
  });

  // Inicia conexión para notificaciones
  this.notificacionesService.startConnection();

  // 🔹 Notificación cuando el cliente paga la venta
  this.notificacionesService.onVentaPagada((data) => {
    if (this.ventaForm.value.ventaId === data.ventaId) {
      this.pagoEnProceso = false;

      // Refresca la venta desde backend para reflejar saldo real
      this.ventasService.obtenerVentaPorId(data.ventaId).subscribe({
        next: (ventaActualizada) => {
          this.cargarVentaEnFormulario(ventaActualizada);

          // Notificación al admin: pago recibido
          alert('¡El cliente ya realizó el pago de esta venta!');
          console.log('Venta pagada actualizada:', ventaActualizada);
        },
        error: (err) => console.error('Error al refrescar venta después de pago:', err)
      });
    }
  });
}

  get detalleVentas(): FormArray {
    return this.ventaForm.get('detalleVentas') as FormArray;
  }

  agregarProducto(): void {
    this.detalleVentas.push(this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, Validators.required],
      subtotal: [{ value: 0, disabled: true }]
    }));
    // Solo marcar pago pendiente si es edición y hay deuda nueva
    if (this.esEdicion && this.calcularTotal() > (this.ventaForm.value.TotalPagado ?? 0)) {
      this.marcarPagoPendiente();
    }
  }

  eliminarProducto(index: number): void {
    this.detalleVentas.removeAt(index);
    this.ventaForm.patchValue({ Total: this.calcularTotal() });
    if (this.esEdicion && this.calcularTotal() > (this.ventaForm.value.TotalPagado ?? 0)) {
      this.marcarPagoPendiente();
    }
  }

  onProductoChange(index: number): void {
    const detalle = this.detalleVentas.at(index);
    const productoId = detalle.get('productoId')?.value;
    const producto = this.productos.find(p => p.productoId === productoId);

    if (producto) {
      detalle.patchValue({
        precioUnitario: producto.precioVenta,
        cantidad: 1
      });
      this.calcularSubtotal(index);
    }
  }

  calcularSubtotal(index: number): void {
    const detalle = this.detalleVentas.at(index);
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precio = detalle.get('precioUnitario')?.value || 0;
    detalle.get('subtotal')?.setValue(cantidad * precio);
    this.ventaForm.patchValue({ Total: this.calcularTotal() });
  }

  calcularTotal(): number {
    return this.detalleVentas.controls.reduce((acc, ctrl) =>
      acc + (ctrl.get('subtotal')?.value || 0), 0
    );
  }

  cargarClientes(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/clientesadmin`)
      .subscribe({
        next: data => this.clientes = data.data || [],
        error: err => console.error('Error al cargar clientes:', err)
      });
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => this.productos = Array.isArray(data) ? data : [],
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  cargarVentaEnFormulario(venta: any): void {
  const totalPagado = venta.totalPagado ?? 0;

  this.ventaForm.patchValue({
    ventaId: venta.ventaId,
    ClienteId: venta.clienteId,
    Fecha: venta.fecha ? new Date(venta.fecha) : null,
    MetodoPagoId: venta.metodoPagoId,
    TotalPagado: totalPagado
  });

  this.detalleVentas.clear();

  const detalles: DetalleVenta[] = venta.detalleventa || [];
  detalles.forEach((det: DetalleVenta) => {
    this.detalleVentas.push(this.fb.group({
      productoId: [det.productoId, Validators.required],
      cantidad: [det.cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [det.precioUnitario, Validators.required],
      subtotal: [{ value: det.subtotal, disabled: true }]
    }));
  });

  // Actualizar Total y verificar saldo pendiente
  const total = this.calcularTotal();
  this.ventaForm.patchValue({ Total: total });

  // Marcar saldo pendiente solo si hay deuda
  if (total > totalPagado) {
    this.marcarPagoPendiente();
  } else {
    this.metodoSeleccionado = null;
  }
}

  guardarVenta(): void {
  if (this.ventaForm.invalid || this.detalleVentas.length === 0) {
    alert("Complete todos los campos requeridos y agregue productos.");
    return;
  }

  const total = this.calcularTotal();
  const totalPagado = this.ventaForm.value.TotalPagado ?? 0;

  // 🔹 Base común de la venta
  const ventaBase: any = {
    ClienteId: this.ventaForm.value.ClienteId,
    Fecha: this.ventaForm.value.Fecha instanceof Date
      ? this.ventaForm.value.Fecha.toISOString()
      : new Date(this.ventaForm.value.Fecha).toISOString(),
    MetodoPagoId: this.ventaForm.value.MetodoPagoId,
    Total: total,
    TotalPagado: totalPagado,
    Detalleventa: this.detalleVentas.controls.map(d => ({
      productoId: d.get('productoId')?.value,
      cantidad: d.get('cantidad')?.value,
      precioUnitario: d.get('precioUnitario')?.value
    }))
  };

  if (this.esEdicion) {
    // 🔹 En edición sí enviamos ventaId
    const ventaEdicion = { ...ventaBase, ventaId: this.ventaForm.value.ventaId };

    this.ventasService.actualizarVenta(ventaEdicion.ventaId, ventaEdicion).subscribe({
      next: () => {
        this.ventasService.obtenerVentaPorId(ventaEdicion.ventaId).subscribe({
          next: (ventaActualizada) => {
            this.cargarVentaEnFormulario(ventaActualizada);

            const saldoPendiente =
              (ventaActualizada.Total ?? 0) - (ventaActualizada.TotalPagado ?? 0);

            if (saldoPendiente > 0) {
              this.pagoEnProceso = false;
              alert(`La venta se actualizó. Saldo pendiente: $${saldoPendiente}`);
            } else {
              this.pagoEnProceso = false;
              this.metodoSeleccionado = null;
            }
          },
          error: (err) => console.error("Error al refrescar venta:", err)
        });
      },
      error: (err) => console.error("Error al actualizar venta:", err)
    });
  } else {
    // 🔹 En creación NO enviamos ventaId
    this.ventasService.crearVenta(ventaBase).subscribe({
      next: (ventaCreada) => {
        this.ventaForm.patchValue({ ventaId: ventaCreada.ventaId });

        if (total > 0 && ventaBase.MetodoPagoId !== 1) {
          this.pagoEnProceso = true;
          this.ventasService.crearCheckoutSession(ventaCreada.ventaId!).subscribe({
            next: (res: any) => console.log("Link Stripe:", res.url),
            error: (err) => {
              this.pagoEnProceso = false;
              console.error("Error Stripe:", err);
            }
          });
        } else {
          this.router.navigate(["/ventas"]);
        }
      },
      error: (err) => console.error("Error al guardar venta:", err)
    });
  }
}


  marcarPagoPendiente(): void {
  const total = this.calcularTotal();
  const totalPagado = this.ventaForm.get('TotalPagado')?.value ?? 0;
  
  if (total <= totalPagado) {
    this.metodoSeleccionado = null;
    this.pagoEnProceso = false;
  }
}

  pagarSaldo(): void {
  if (!this.ventaForm.value.ventaId) {
    alert('Primero debe guardar los cambios de la venta.');
    return;
  }

  const saldoPendiente = this.calcularTotal() - (this.ventaForm.value.TotalPagado ?? 0);
  if (saldoPendiente <= 0) {
    alert('No hay saldo pendiente.');
    return;
  }

  if (!this.metodoSeleccionado) {
    alert('Seleccione un método de pago para el saldo pendiente.');
    return;
  }

  if ([2, 3].includes(this.metodoSeleccionado)) {
    // Pago con Stripe
    this.ventasService.crearCheckoutSession(this.ventaForm.value.ventaId).subscribe({
      next: (res: any) => {
        this.pagoEnProceso = true;
        alert('Se generó el link de pago para el cliente.');
        console.log('Link Stripe:', res.url);
      },
      error: (err) => { console.error('Error al generar sesión de pago:', err); this.pagoEnProceso = false; }
    });
  } else {
    // Pago en efectivo u otro método
    const ventaActualizada = {
      ventaId: this.ventaForm.value.ventaId, 
      ClienteId: this.ventaForm.value.ClienteId,
      Fecha: this.ventaForm.value.Fecha,
      MetodoPagoId: this.metodoSeleccionado,
      Total: this.calcularTotal(),
      TotalPagado: (this.ventaForm.value.TotalPagado ?? 0) + saldoPendiente,
      Detalleventa: this.detalleVentas.controls.map(d => ({
        productoId: d.get('productoId')?.value,
        cantidad: d.get('cantidad')?.value,
        precioUnitario: d.get('precioUnitario')?.value
          }))
    };
    this.ventasService.actualizarVenta(this.ventaForm.value.ventaId, ventaActualizada).subscribe({
      next: () => {
        alert('Pago registrado con éxito.');
        this.ventasService.obtenerVentaPorId(this.ventaForm.value.ventaId)
          .subscribe(venta => this.cargarVentaEnFormulario(venta));
      },
      error: (err) => console.error('Error al registrar pago:', err)
    });
  }
}
cancelarFormulario(): void {
  // Reset del formulario con valores por defecto
  this.ventaForm.reset({
    ClienteId: null,
    Fecha: new Date(),
    MetodoPagoId: null,
    Total: 0,
    TotalPagado: 0
  });

  // Limpiar los detalles de productos
  this.detalleVentas.clear();

  // Agregar un producto vacío por defecto
  this.agregarProducto();

  // Reiniciar estado de pago
  this.pagoEnProceso = false;
  this.metodoSeleccionado = null;

  // Navegar a la lista de ventas
  this.router.navigate(['/ventas']);
}


}
