import { Routes } from '@angular/router';
import { LoginComponent } from './access/auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RolesFormComponent } from './roles/roles-form/roles-form.component';
import { UsuariosListComponent } from './usuarios/usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './usuarios/usuarios-form/usuarios-form.component';
import { ProductosListComponent } from './productos/productos-list/productos-list.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { CategoriasListComponent } from './categorias/categorias-list/categorias-list.component';
import { CategoriasFormComponent } from './categorias/categorias-form/categorias-form.component';
import { ClientesListComponent } from './clientes/clientes-list/clientes-list.component';
import { ClientesFormComponent } from './clientes/clientes-form/clientes-form.component';
import { ProveedoresListComponent } from './proveedores/proveedores-list/proveedores-list.component';
import { ProveedoresFormComponent } from './proveedores/proveedores-form/proveedores-form.component';
import { ComprasListComponent } from './compras/compras-list/compras-list.component';
import { ComprasFormComponent } from './compras/compras-form/compras-form.component';
import { ComprasDetailComponent } from './compras/compras-detail/compras-detail.component';
import { PagosFormComponent } from './pagos-proveedores/pagos-form/pagos-form.component';
import { PagosListComponent } from './pagos-proveedores/pagos-list/pagos-list.component';
import { VentasListComponent } from './ventas/ventas-list/ventas-list.component';
import { VentasFormComponent } from './ventas/ventas-form/ventas-form.component';
import { VentasDetailsComponent } from './ventas/ventas-details/ventas-details.component';
import { PagoExitosoComponent } from './ventas/pagos/pago-exitoso/pago-exitoso.component';
import { PagoCanceladoComponent } from './ventas/pagos/pago-cancelado/pago-cancelado.component';
import { ReporteComprasComponent } from './compras/reportes/reporte-compras/reporte-compras.component';
import { ReporteVentasComponent } from './ventas/reportes/reporte-ventas/reporte-ventas.component';
import { ReporteProductosComponent } from './productos/reportes/reporte-productos/reporte-productos.component';
import { ReporteInventarioComponent } from './productos/reportes/reporte-inventario/reporte-inventario.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  // Rutas para Roles
  { path: 'roles', component: RolesListComponent },
  { path: 'roles/nuevo', component: RolesFormComponent },
  { path: 'roles/editar/:id', component: RolesFormComponent },

  // Rutas para Usuarios
  { path: 'usuarios', component: UsuariosListComponent },
  { path: 'usuarios/nuevo', component: UsuariosFormComponent },
  { path: 'usuarios/editar/:id', component: UsuariosFormComponent },

  //Rutas para Categorias
  { path: 'categorias', component: CategoriasListComponent },
  { path: 'categorias/nueva', component: CategoriasFormComponent },
  { path: 'categorias/editar/:id', component: CategoriasFormComponent },

  //Rutas para Productos
   { path: 'productos', component: ProductosListComponent },
  { path: 'productos/nuevo', component: ProductosFormComponent },
  { path: 'productos/editar/:id', component: ProductosFormComponent },
  //Ruta para reportes
  {path: 'reportes/productos', component: ReporteProductosComponent},
  { path: 'reportes/inventario', component: ReporteInventarioComponent },


  //Rutas para Clientes
  {path: 'clientes', component: ClientesListComponent},
  {path: 'clientes/nuevo', component: ClientesFormComponent},
  {path: 'clientes/editar/:id', component: ClientesFormComponent},

  //Rutas para Proveedores
  {path: 'proveedores', component: ProveedoresListComponent},
  {path: 'proveedores/nuevo', component: ProveedoresFormComponent},
  {path: 'proveedores/editar/:id', component: ProveedoresFormComponent},

  //Rutas para Compras
  {path: 'compras', component: ComprasListComponent},
  {path: 'compras/nuevo', component: ComprasFormComponent},
  {path: 'compras/editar/:id', component: ComprasFormComponent},
  { path: 'compras/:id', component: ComprasDetailComponent},
   //Ruta de Reporte de Compras
{ path: 'reportes/compras', component: ReporteComprasComponent },


  //Rutas para pagos a proveedores
  { path: 'pagos', component: PagosListComponent },
  { path: 'pagos', component: PagosFormComponent },
  { path: 'pagos/:compraId', component: PagosFormComponent },

    //Rutas para ventas
  { path: 'ventas', component: VentasListComponent },
  { path: 'ventas/nuevo', component: VentasFormComponent},
  { path: 'ventas/editar/:id', component: VentasFormComponent },
  { path: 'ventas/:id', component: VentasDetailsComponent },
   { path: 'pago-exitoso', component: PagoExitosoComponent },
  { path: 'pago-cancelado', component: PagoCanceladoComponent },
  //Ruta para Reportes
  { path: 'reportes/ventas', component: ReporteVentasComponent },

  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard (para rutas no encontradas)
  { path: '**', redirectTo: 'home' }
];
