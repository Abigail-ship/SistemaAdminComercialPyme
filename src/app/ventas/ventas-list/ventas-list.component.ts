import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentasService, Venta } from '../../core/services/ventas.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon"; 

@Component({
  selector: 'app-ventas-list',
  templateUrl: './ventas-list.component.html',
  styleUrls: ['./ventas-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
]
})
export class VentasListComponent implements OnInit {
  ventas: Venta[] = [];
  userRole: string = '';

  constructor(
    private ventasService: VentasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') ?? '';
    this.cargarVentas();
  }

  cargarVentas(): void {
  this.ventasService.obtenerVentas().subscribe({
    next: (data: any) => {
      // Si tu API envía { data: [...] }, usa data.data
      this.ventas = Array.isArray(data) ? data : data.data || [];
      console.log('Ventas cargadas:', this.ventas);
    },
    error: (err) => {
      console.error('Error al cargar ventas:', err);
    }
  });
}
goToReporte(): void {
  this.router.navigate(['/reportes/ventas']);
}


  crearNuevaVenta(): void {
    this.router.navigate(['/ventas/nuevo']); // ruta hacia el componente de crear venta
  }
  editarVenta(ventaId: number): void {
  this.router.navigate(['/ventas/editar', ventaId]);
}
  eliminarVenta(ventaId: number): void {
  if (confirm('¿Seguro que quieres eliminar esta venta?')) {
    this.ventasService.eliminarVenta(ventaId).subscribe({
      next: () => {
        alert('Venta eliminada correctamente');
        this.cargarVentas();
      },
      error: err => {
        console.error('Error al eliminar venta:', err);
        alert('No se pudo eliminar la venta');
      }
    });
  }
}
}
