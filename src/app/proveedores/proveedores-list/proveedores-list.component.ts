import { Component, OnInit } from '@angular/core';
import { ProveedoresService, Proveedor } from '../../core/services/proveedores.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.scss']
})
export class ProveedoresListComponent implements OnInit {
  proveedores: Proveedor[] = [];
  loading = true;
  searchTerm = '';
  page = 1;
  pageSize = 10;
  total = 0;
  displayedColumns: string[] = ['nombre', 'contacto', 'telefono', 'email', 'activo', 'acciones'];

  private searchSubject = new Subject<string>();

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.loadProveedores();
     this.searchSubject.pipe(
      debounceTime(100),            // espera 300 ms tras dejar de escribir
      distinctUntilChanged()        // evita búsquedas repetidas
    ).subscribe(searchText => {
      this.searchTerm = searchText;
      this.loadProveedores();
    });
  }

  loadProveedores() {
  this.loading = true;
  this.proveedoresService.getProveedores(this.searchTerm).subscribe({
    next: res => {
      this.proveedores = res as unknown as Proveedor[]; // aquí res ya es el array completo
      this.total = this.proveedores.length;  // total para el paginator
      this.loading = false;
    },
    error: err => {
      console.error('Error cargando proveedores', err);
      this.loading = false;
    }
  });
}


  onSearchChange(value: string) {
    if (value.trim() === '') {
      // Si borra todo, recargamos todos los productos
      this.loadProveedores();
    } else {
      this.searchSubject.next(value);
    }
  }

  deleteProveedor(id: number) {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.proveedoresService.deleteProveedor(id).subscribe({
        next: () => this.loadProveedores(),
        error: err => alert('Error al eliminar proveedor: ' + err.message)
      });
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProveedores();
  }
}
