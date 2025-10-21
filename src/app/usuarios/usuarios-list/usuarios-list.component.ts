import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService, Usuario } from '../../core/services/usuarios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;

  displayedColumns: string[] = ['usuarioId', 'nombreUsuario', 'rol', 'activo', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: data => {
        this.usuarios = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando usuarios', err);
        this.loading = false;
      }
    });
  }

  deleteUsuario(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.usuarioId !== id);
      });
    }
  }
}
