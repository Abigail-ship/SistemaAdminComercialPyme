import { Component, OnInit } from '@angular/core';
import { ClientesService, Cliente } from '../../core/services/clientes.service';
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

@Component({
  selector: 'app-clientes-list',
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
    MatPaginatorModule
  ],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = true;
  searchTerm = '';
  page = 1;
  pageSize = 10;
  total = 0;
  displayedColumns: string[] = ['nombres', 'apellidos', 'nombreComercial', 'tipoCliente', 'acciones'];
  private searchSubject = new Subject<string>();

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.loadClientes();
    this.searchSubject.pipe(
      debounceTime(100),            // espera 300 ms tras dejar de escribir
      distinctUntilChanged()        // evita búsquedas repetidas
    ).subscribe(searchText => {
      this.searchTerm = searchText;
      this.loadClientes();
    });
  }

  loadClientes() {
    this.loading = true;
    this.clientesService.getClientes(this.searchTerm, this.page, this.pageSize).subscribe({
      next: res => {
        this.clientes = res.data;
        this.total = res.total;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando clientes', err);
        this.loading = false;
      }
    });
  }

  onSearchChange(value: string) {
    if (value.trim() === '') {
      // Si borra todo, recargamos todos los productos
      this.loadClientes();
    } else {
      this.searchSubject.next(value);
    }
  }


  deleteCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clientesService.deleteCliente(id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: err => alert('Error al eliminar cliente: ' + err.message)
      });
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadClientes();
  }
}
