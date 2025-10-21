import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuariosService, Usuario } from '../../core/services/usuarios.service';
import { RolesService, Rol } from '../../core/services/roles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss']
})
export class UsuariosFormComponent implements OnInit {
  usuario: Usuario = { usuarioId: 0, nombreUsuario: '', nombreCompleto: '', activo: true, rolId: 0 };
  roles: Rol[] = [];
  isEdit = false;

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rolesService.getRoles().subscribe(r => this.roles = r);
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.usuariosService.getUsuario(id).subscribe(u => this.usuario = u);
    }
  }

  saveUsuario() {
  if (this.isEdit) {
    this.usuariosService.updateUsuario(this.usuario.usuarioId!, this.usuario)
      .subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar usuario: ' + error.error);
        }
      });
  } else {
    console.log('Creando usuario:', this.usuario); // Debug
    this.usuariosService.createUsuario(this.usuario)
      .subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (error) => {
          console.error('Error al crear:', error);
          alert('Error al crear usuario: ' + error.error);
        }
      });
  }
}
}
