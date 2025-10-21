import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService, Cliente } from '../../core/services/clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule as AngularReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    AngularReactiveFormsModule
  ],
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.scss']
})
export class ClientesFormComponent implements OnInit {
  clienteForm: FormGroup;
  clienteId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      nombreComercial: [''],
      direccion: [''],
      telefono: [''],
      email: ['', [Validators.email]],
      tipoCliente: ['Minorista']
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clienteId) {
      this.isEditMode = true;
      this.clientesService.getCliente(this.clienteId).subscribe({
        next: cliente => this.clienteForm.patchValue(cliente)
      });
    }
  }

  saveCliente() {
    if (this.clienteForm.invalid) return;

    const cliente: Cliente = this.clienteForm.value;

    if (this.isEditMode && this.clienteId) {
      cliente.clienteId = this.clienteId;
      this.clientesService.updateCliente(cliente.clienteId, cliente).subscribe({
        next: () => this.router.navigate(['/clientes'])
      });
    } else {
      this.clientesService.createCliente(cliente).subscribe({
        next: () => this.router.navigate(['/clientes'])
      });
    }
  }
}
