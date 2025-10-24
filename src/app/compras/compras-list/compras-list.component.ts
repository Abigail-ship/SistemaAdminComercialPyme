import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComprasService, Compra } from '../../core/services/compras.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'; 

@Component({
  selector: 'app-compras-list',
  templateUrl: './compras-list.component.html',
  styleUrls: ['./compras-list.component.scss'],

  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // para ngModel
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule 
    
  ]
})
export class ComprasListComponent implements OnInit {
  compras: Compra[] = [];
  searchTerm: string = '';
  userRole: string = '';
  displayedColumns: string[] = ['compraId', 'proveedor', 'fecha', 'total', 'estado', 'acciones'];
    private searchSubject = new Subject<string>(); 

  constructor(
    private comprasService: ComprasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') ?? '';
    this.loadCompras();
    this.searchSubject.pipe(
      debounceTime(100), // espera 300 ms antes de buscar
      distinctUntilChanged() // evita búsquedas repetidas con el mismo texto
    ).subscribe(searchText => {
      this.searchTerm = searchText;
      this.loadCompras();
    });
  }

  // 📌 Cargar compras
  loadCompras(): void {
  this.comprasService.getCompras(this.searchTerm).subscribe({
    next: (data: Compra[]) => {
      console.log('Datos del backend:', data);
      this.compras = data ?? [];
    },
    error: (err) => console.error('Error al cargar compras:', err)
  });
}

  // 📌 Buscar compras
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
  // 📌 Ver detalle de la compra
  viewCompra(compra: Compra): void {
    this.router.navigate(['/compras', compra.compraId]);
  }

  // 📌 Editar compra
  editCompra(compra: Compra): void {
    this.router.navigate(['/compras/editar', compra.compraId]);
  }

  // 📌 Eliminar compra
  deleteCompra(compra: Compra): void {
    if (confirm('¿Seguro que deseas eliminar esta compra?')) {
      this.comprasService.deleteCompra(compra.compraId!).subscribe({
        next: () => this.loadCompras(),
        error: (err) => console.error('Error al eliminar compra', err)
      });
    }
  }

  // 📌 Nueva compra
  newCompra(): void {
    this.router.navigate(['/compras/nuevo']);
  }
  // 📌 Ir a la página de Reporte de Compras
goToReporte(): void {
  this.router.navigate(['/reportes/compras']);
}


}
