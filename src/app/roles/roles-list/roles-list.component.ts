import { Component, OnInit } from '@angular/core';
import { RolesService, Rol } from '../../core/services/roles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCard
],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  roles: Rol[] = [];
  loading = true;
  displayedColumns: string[] = ['rolId', 'nombre', 'acciones'];

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getRoles().subscribe({
      next: data => {
        this.roles = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando roles', err);
        this.loading = false;
      }
    });
  }

  deleteRol(id: number) {
    if (confirm('¿Seguro que deseas eliminar este rol?')) {
      this.rolesService.deleteRol(id).subscribe(() => {
        this.roles = this.roles.filter(r => r.rolId !== id);
      });
    }
  }
}


