import { Component, OnInit } from '@angular/core';
import { CategoriasService, Categoria } from '../../core/services/categorias.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-categorias-list',
  templateUrl: './categorias-list.component.html',
  styleUrls: ['./categorias-list.component.scss'],
  standalone:true,
  imports: [MatCard, CommonModule, RouterModule, MatIconModule, MatCard]
})
export class CategoriasListComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => this.snackBar.open('Error cargando categorías', 'Cerrar', { duration: 3000 })
    });
  }

  deleteCategoria(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriasService.deleteCategoria(id).subscribe({
        next: () => {
          this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 3000 });
          this.loadCategorias();
        },
        error: err => this.snackBar.open(err.error?.mensaje || 'Error al eliminar', 'Cerrar', { duration: 3000 })
      });
    }
  }
}
