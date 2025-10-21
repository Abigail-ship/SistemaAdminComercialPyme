import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../core/services/usuarios.service';
import { RolesService } from '../core/services/roles.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  usuariosCount = 0;
  rolesCount = 0;
  userRole: string = ''; 

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    this.userRole = localStorage.getItem('role') ?? '';
  }

  loadCounts() {
    this.usuariosService.getUsuarios().subscribe(u => this.usuariosCount = u.length);
    this.rolesService.getRoles().subscribe(r => this.rolesCount = r.length);
  }

  goToUsuarios() { this.router.navigate(['/usuarios']); }
  goToRoles() { this.router.navigate(['/roles']); }
  goToCategorias() { this.router.navigate(['/categorias']); }
  goToProductos() { this.router.navigate(['/productos']); }
  goToClientes() { this.router.navigate(['/clientes']); }
  goToProveedores() { this.router.navigate(['/proveedores']); }
  goToCompras() { this.router.navigate(['/compras']); }
  goToPagos() { this.router.navigate(['/pagos']); }
  goToVentas() { this.router.navigate(['/ventas']); }
}
