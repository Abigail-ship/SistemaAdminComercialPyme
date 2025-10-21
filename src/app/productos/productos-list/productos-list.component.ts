import { Component, OnInit } from '@angular/core';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { CategoriasService, Categoria } from '../../core/services/categorias.service';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-list',
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
    FormsModule
  ],
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.scss']
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  loading = true;
  searchTerm = '';
  displayedColumns: string[] = ['nombre', 'categoria', 'precio', 'stock', 'acciones'];

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
     private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos() {
    this.productosService.getProductos(this.searchTerm).subscribe({
      next: data => {
        this.productos = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando productos', err);
        this.loading = false;
      }
    });
  }

  loadCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => console.error('Error cargando categorías', err)
    });
  }

  getCategoriaNombre(categoriaId?: number): string {
    if (!categoriaId) return 'Sin categoría';
    const categoria = this.categorias.find(c => c.categoriaId === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  search() {
    this.loading = true;
    this.loadProductos();
  }
  // 📌 Ir a la página de Reporte de Productos
goToReporteProductos(): void {
  this.router.navigate(['/reportes/productos']);
}

  // 📌 Ir a la página de Reporte de Inventario
goToReporteInventario(): void {
  this.router.navigate(['/reportes/inventario']);
}


  deleteProducto(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.productoId !== id);
        },
        error: (err) => {
          alert('Error al eliminar producto: ' + err.message);
        }
      });
    }
  }
}