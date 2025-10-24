import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProveedoresService, Proveedor } from '../../core/services/proveedores.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule as AngularReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-proveedores-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatCheckboxModule, 
    AngularReactiveFormsModule
  ],
  templateUrl: './proveedores-form.component.html',
  styleUrls: ['./proveedores-form.component.scss']
})
export class ProveedoresFormComponent implements OnInit {
  proveedorForm: FormGroup;
  proveedorId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: [''],
       telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      direccion: [''],
      rfc: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.proveedorId) {
      this.isEditMode = true;
      this.proveedoresService.getProveedor(this.proveedorId).subscribe({
        next: proveedor => this.proveedorForm.patchValue(proveedor)
      });
    }
  }

  saveProveedor() {
    if (this.proveedorForm.invalid) return;

    const proveedor: Proveedor = this.proveedorForm.value;

    if (this.isEditMode && this.proveedorId) {
      proveedor.proveedorId = this.proveedorId;
      this.proveedoresService.updateProveedor(proveedor.proveedorId, proveedor).subscribe({
        next: () => this.router.navigate(['/proveedores'])
      });
    } else {
      this.proveedoresService.createProveedor(proveedor).subscribe({
        next: () => this.router.navigate(['/proveedores'])
      });
    }
  }
}
