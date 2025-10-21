import { Component, OnInit } from '@angular/core';
import { PagosProveedoresService, CompraPendiente } from '../../core/services/pagos-proveedores.service';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagosFormComponent } from "../pagos-form/pagos-form.component";


@Component({
  selector: 'app-pagos-list',
  templateUrl: './pagos-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    PagosFormComponent
]
})
export class PagosListComponent implements OnInit {
  compras: CompraPendiente[] = [];
  selectedCompra?: CompraPendiente;

  constructor(private pagosService: PagosProveedoresService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.pagosService.getComprasPendientes().subscribe(res => this.compras = res);
  }

  seleccionarCompra(compra: CompraPendiente) {
    this.selectedCompra = compra;
  }

  pagoExitoso() {
    this.selectedCompra = undefined;
    this.cargarPendientes(); // refrescar lista después del pago
  }
}
