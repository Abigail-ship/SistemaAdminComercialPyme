import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PagosProveedoresService, CompraPendiente } from '../../core/services/pagos-proveedores.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pagos-form',
  templateUrl: './pagos-form.component.html',
  standalone: true,
  imports: [
    MatCardModule, CommonModule
  ]
})
export class PagosFormComponent implements OnInit {
  @Input() compra!: CompraPendiente;
  @Output() pagoCompletado = new EventEmitter<void>();

  stripe: Stripe | null = null; 
  card?: StripeCardElement;
  mensaje: string = '';

  constructor(private pagosService: PagosProveedoresService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51R1F7L4Fr0zfDnjL6BnnFLuSJk8Grv8p7cMKZRlsXfFiC2lilnYf1SIgWqBS8qe548cnPD2P6MBPjbS39AWxCdou0028fBOrUD'); // 🔑 pon tu public key real
    if (!this.stripe) {
      this.mensaje = 'Error al cargar Stripe';
      return;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async pagar() {
  if (!this.stripe || !this.card) return;

  this.mensaje = 'Procesando pago...';

  try {
    // 1️⃣ Crear PaymentIntent en backend
    const result = await this.pagosService.crearPaymentIntent(this.compra.compraId).toPromise();

    if (!result?.clientSecret) {
      this.mensaje = 'Error al crear el PaymentIntent';
      return;
    }

    const clientSecret = result.clientSecret;

    // 2️⃣ Confirmar el pago con Stripe
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: this.card }
    });

    if (error) {
      this.mensaje = 'Error: ' + error.message;
      return;
    }

    // 3️⃣ Si el pago se completó, actualizar la compra en el backend
    if (paymentIntent?.status === 'succeeded') {
      await this.pagosService.confirmarPago(this.compra.compraId).toPromise();

      this.mensaje = '✅ Pago realizado con éxito';
      this.pagoCompletado.emit(); // refresca la lista de compras pendientes
    } else {
      this.mensaje = `Estado del pago: ${paymentIntent?.status}`;
    }
  } catch (err) {
    console.error(err);
    this.mensaje = 'Error al procesar el pago';
  }
}

}
