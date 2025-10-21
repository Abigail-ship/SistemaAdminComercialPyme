import { Component, OnInit } from '@angular/core';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { CategoriasService, Categoria } from '../../core/services/categorias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class ProductosFormComponent implements OnInit {
  producto: Producto = {
    productoId: 0,
    codigo: '',
    nombre: '',
    descripcion: '',
    categoriaId: undefined,
    costo: null,
  precioVenta: null,
  stock: null,
  stockMinimo: null,
    fechaCreacion: undefined,
    imagen: ''
  };

  id?: number;
  categorias: Categoria[] = [];
  imagenFile?: File;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar categorías para el select
    this.categoriasService.getCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => this.snackBar.open('Error cargando categorías', 'Cerrar', { duration: 3000 })
    });

    // Verificar si es edición
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.productosService.getProducto(this.id).subscribe({
        next: p => {
          this.producto = p;
          if (p.imagen) this.previewUrl = p.imagen;
        },
        error: err => this.snackBar.open('Error cargando producto', 'Cerrar', { duration: 3000 })
      });
    }
  }

  onFileSelected(event: any): void {
    this.imagenFile = event.target.files[0];
    if (this.imagenFile) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(this.imagenFile);
    }
  }

  save(form: NgForm): void {
  if (form.invalid) {
    // Marca todos los campos como tocados para mostrar errores
    form.control.markAllAsTouched();
    this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    return; // evita que se guarde
  }

  if (this.id) {
    // Actualizar producto
    this.productosService.updateProducto(this.id, this.producto, this.imagenFile).subscribe({
      next: () => {
        this.snackBar.open('Producto actualizado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/productos']);
      },
      error: err => this.snackBar.open('Error actualizando producto', 'Cerrar', { duration: 3000 })
    });
  } else {
    // Crear nuevo producto
    this.productosService.createProducto(this.producto, this.imagenFile).subscribe({
      next: () => {
        this.snackBar.open('Producto creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/productos']);
      },
      error: err => this.snackBar.open('Error creando producto', 'Cerrar', { duration: 3000 })
    });
  }
}

}
