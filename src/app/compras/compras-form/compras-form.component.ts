import { Component, OnInit, AfterViewInit } from '@angular/core'; 
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComprasService, Compra, PagoCompraDto } from '../../core/services/compras.service';
import { ProveedoresService, Proveedor } from '../../core/services/proveedores.service';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-compras-form',
  templateUrl: './compras-form.component.html',
  styleUrls: ['./compras-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class ComprasFormComponent implements OnInit, AfterViewInit {
  compraForm!: FormGroup;
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  compraId?: number;

  metodosPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Tarjeta de Crédito' },
    { id: 3, nombre: 'Tarjeta de Débito' }
  ];

  stripePromise: Promise<Stripe | null>;
  pagoProcesando = false;
  stripeCard!: StripeCardElement;
  stripeMounted = false;
  clientSecret!: string;
  mostrarTarjeta = false;

  constructor(
    private fb: FormBuilder,
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stripePromise = loadStripe('pk_test_51R1F7L4Fr0zfDnjL6BnnFLuSJk8Grv8p7cMKZRlsXfFiC2lilnYf1SIgWqBS8qe548cnPD2P6MBPjbS39AWxCdou0028fBOrUD');
  }

  ngOnInit(): void {
    this.compraForm = this.fb.group({
      proveedorId: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      detalleCompras: this.fb.array([]),
      metodoPagoId: [1, Validators.required],
      totalPagado: [0]
    });

    // Cargar proveedores
    this.proveedoresService.getProveedores().subscribe({
      next: res => {
        this.proveedores = res;
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
          this.compraId = Number(idParam);
          setTimeout(() => this.cargarCompra(this.compraId!), 0);
        } else {
          this.agregarDetalle();
        }
      },
      error: err => console.error('Error proveedores', err)
    });

    // Cargar productos
    this.productosService.getProductos().subscribe({
      next: res => this.productos = res,
      error: err => console.error('Error productos', err)
    });

    // Detectar cambio de método de pago
    this.compraForm.get('metodoPagoId')?.valueChanges.subscribe(val => {
      this.mostrarTarjeta = val === 2 || val === 3;
      if (this.mostrarTarjeta) setTimeout(() => this.montarStripe(), 0);
    });

    if (this.compraForm.value.metodoPagoId === 2 || this.compraForm.value.metodoPagoId === 3) {
      this.mostrarTarjeta = true;
      setTimeout(() => this.montarStripe(), 0);
    }
  }

  ngAfterViewInit(): void {
    const metodo = this.compraForm.value.metodoPagoId;
    if (metodo === 2 || metodo === 3) this.montarStripe();
  }

  get detalleCompras(): FormArray {
    return this.compraForm.get('detalleCompras') as FormArray;
  }

  agregarDetalle(): void {
    this.detalleCompras.push(this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      subtotal: [{ value: 0, disabled: true }]
    }));
  }

  eliminarDetalle(i: number): void {
    this.detalleCompras.removeAt(i);
  }

  calcularSubtotal(i: number): void {
    const detalle = this.detalleCompras.at(i);
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precio = detalle.get('precioUnitario')?.value || 0;
    detalle.get('subtotal')?.setValue(cantidad * precio, { emitEvent: false });
  }

  get total(): number {
    return this.detalleCompras.controls.reduce((sum, d) => sum + (d.get('subtotal')?.value || 0), 0);
  }

  compararProveedores = (p1: number, p2: number) => p1 && p2 ? p1 === p2 : false;

  private async montarStripe() {
    if (this.stripeMounted) return;
    const stripe = await this.stripePromise;
    if (!stripe) return;

    const elements = stripe.elements();
    this.stripeCard = elements.create('card', { hidePostalCode: false });
    this.stripeCard.mount('#card-element');
    this.stripeMounted = true;
  }

  async guardar(): Promise<void> {
    if (this.compraForm.invalid || this.detalleCompras.length === 0) return;

    const totalCompra = this.total;
    const metodoSeleccionado = this.metodosPago.find(m => m.id === Number(this.compraForm.value.metodoPagoId));
    if (!metodoSeleccionado) {
      alert('Seleccione un método de pago válido.');
      return;
    }

    const compra: Compra = {
      proveedorId: Number(this.compraForm.value.proveedorId),
      fecha: this.compraForm.value.fecha.toISOString(),
      total: totalCompra,
      detalleCompras: this.detalleCompras.getRawValue().map(d => ({
        detalleCompraId: d.detalleCompraId ?? 0,
        productoId: Number(d.productoId),
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
        subtotal: Number(d.subtotal)
      })),
      metodoPagoId: metodoSeleccionado.id
    };

    try {
      let compraGuardada: any;

      if (this.compraId) {
        // 🔄 EDITANDO COMPRA EXISTENTE
        compra.compraId = this.compraId;
        compraGuardada = await this.comprasService.updateCompra(this.compraId, compra).toPromise();
        
        if (!compraGuardada || !compraGuardada.compraId) {
          alert('Ocurrió un problema al actualizar la compra.');
          return;
        }

        // 🎯 SOLO ACTUALIZAR LA INTERFAZ, NO PROCESAR PAGO AQUÍ
        this.compraForm.patchValue({
          totalPagado: compraGuardada.totalPagado
        });

        alert('Compra actualizada correctamente.');
        
        // Si hay saldo pendiente y no es efectivo, mostrar opción de pago
        if (compraGuardada.saldoPendiente > 0 && compraGuardada.requierePago) {
          const saldoFormateado = new Intl.NumberFormat('es-MX', { 
            style: 'currency', 
            currency: 'MXN' 
          }).format(compraGuardada.saldoPendiente);
          
          const confirmarPago = confirm(`Hay un saldo pendiente de ${saldoFormateado}. ¿Desea pagarlo ahora?`);
          if (confirmarPago) {
            // El usuario puede usar el botón "Pagar Saldo Pendiente"
            return;
          }
        }
        
        this.router.navigate(['/compras']);
        
      } else {
        // ✅ COMPRA NUEVA - lógica existente
        compraGuardada = await this.comprasService.createCompra(compra).toPromise();

        if (!compraGuardada || !compraGuardada.compraId) {
          alert('Ocurrió un problema al guardar la compra.');
          return;
        }

        if (metodoSeleccionado.nombre === 'Efectivo') {
        // ⚡ El backend ya la marca como pagada en efectivo
        alert('Compra guardada correctamente y pagada en efectivo.');
        this.router.navigate(['/compras']);
      } else {
          // Pago con tarjeta para compra nueva
          this.pagoProcesando = true;
          this.clientSecret = compraGuardada.clientSecret;

          const stripe = await this.stripePromise;
          if (!stripe) return;

          const { error, paymentIntent } = await stripe.confirmCardPayment(this.clientSecret, {
            payment_method: { card: this.stripeCard }
          });

          this.pagoProcesando = false;

          if (error) {
            alert(error.message);
            return;
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            const pago: PagoCompraDto = {
              compraId: compraGuardada.compraId!,
              metodoPagoId: metodoSeleccionado.id,
              montoPagado: totalCompra,
              referencia: paymentIntent.id
            };
            await this.comprasService.procesarPago(pago).toPromise();
            alert('Pago con tarjeta exitoso. Se notificará al proveedor.');
            this.router.navigate(['/compras']);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocurrió un error al guardar la compra.');
      this.pagoProcesando = false;
    }
  }

  async pagarSaldoPendiente(): Promise<void> {
    if (!this.compraId) return;

    const totalPendiente = this.total - (this.compraForm.value.totalPagado ?? 0);
    if (totalPendiente <= 0) {
      alert('No hay saldo pendiente para pagar.');
      return;
    }

    const metodoSeleccionado = this.metodosPago.find(m => m.id === Number(this.compraForm.value.metodoPagoId));
    if (!metodoSeleccionado) {
      alert('Seleccione un método de pago válido.');
      return;
    }

    try {
      this.pagoProcesando = true;

      if (metodoSeleccionado.nombre === 'Efectivo') {
        // Pago en efectivo del saldo pendiente
        const pago: PagoCompraDto = {
          compraId: this.compraId,
          metodoPagoId: metodoSeleccionado.id,
          montoPagado: totalPendiente
        };
        await this.comprasService.procesarPago(pago).toPromise();
        
        // Actualizar interfaz
        this.compraForm.patchValue({
          totalPagado: (this.compraForm.value.totalPagado ?? 0) + totalPendiente
        });
        
        alert('Saldo pendiente pagado en efectivo correctamente.');
        this.router.navigate(['/compras']);
        
      } else {
        // Pago con tarjeta del saldo pendiente
        const resp = await this.comprasService.generarPaymentIntent(this.compraId).toPromise();
        this.clientSecret = resp.clientSecret;

        const stripe = await this.stripePromise;
        if (!stripe) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(this.clientSecret, {
          payment_method: { card: this.stripeCard }
        });

        this.pagoProcesando = false;

        if (error) {
          alert(error.message);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          const pago: PagoCompraDto = {
            compraId: this.compraId,
            metodoPagoId: metodoSeleccionado.id,
            montoPagado: totalPendiente,
            referencia: paymentIntent.id
          };
          await this.comprasService.procesarPago(pago).toPromise();
          
          // Actualizar interfaz
          this.compraForm.patchValue({
            totalPagado: (this.compraForm.value.totalPagado ?? 0) + totalPendiente
          });
          
          alert('Pago con tarjeta exitoso. Saldo pendiente liquidado.');
          this.router.navigate(['/compras']);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocurrió un error al pagar el saldo pendiente: ' + err.message);
    } finally {
      this.pagoProcesando = false;
    }
  }
// Agrega este método para formatear currency en el template
formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  }).format(value);
}
  // 🔧 MÉTODO CARGAR COMPRA QUE FALTABA
  private cargarCompra(id: number): void {
    this.comprasService.getCompra(id).subscribe({
      next: (data: Compra) => {
        this.compraForm.patchValue({
          proveedorId: data.proveedor?.proveedorId,
          fecha: new Date(data.fecha),
          metodoPagoId: Number(data.metodoPagoId) || 1,
          totalPagado: data.totalPagado ?? 0
        });

        this.detalleCompras.clear();
        data.detalleCompras.forEach(det => {
          this.detalleCompras.push(this.fb.group({
            productoId: Number(det.productoId),
            cantidad: [Number(det.cantidad), [Validators.required, Validators.min(1)]],
            precioUnitario: [Number(det.precioUnitario), [Validators.required, Validators.min(0.01)]],
            subtotal: [{ value: Number(det.subtotal), disabled: true }]
          }));
        });
      },
      error: err => console.error('Error cargando compra', err)
    });
  }
}