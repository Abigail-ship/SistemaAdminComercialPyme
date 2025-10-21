import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService, Categoria } from '../../core/services/categorias.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from "@angular/material/card"; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias-form',
  templateUrl: './categorias-form.component.html',
  styleUrls: ['./categorias-form.component.scss'],
  standalone:true,
  imports: [CommonModule, MatInputModule, RouterModule, FormsModule, MatCardModule], 
})
export class CategoriasFormComponent implements OnInit {
  categoria: Categoria = { nombre: '' };
  id?: number;

  constructor(
    private categoriasService: CategoriasService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.categoriasService.getCategoria(this.id).subscribe({
        next: data => this.categoria = data
      });
    }
  }

  save(): void {
    if (this.id) {
      this.categoriasService.updateCategoria(this.id, this.categoria).subscribe({
        next: () => {
          this.snackBar.open('Categoría actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/categorias']);
        }
      });
    } else {
      this.categoriasService.createCategoria(this.categoria).subscribe({
        next: () => {
          this.snackBar.open('Categoría creada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/categorias']);
        }
      });
    }
  }
}
