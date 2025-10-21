import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RolesService, Rol } from '../../core/services/roles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {
  rol: Rol = { rolId: 0, nombre: '' };
  isEdit = false;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.rolesService.getRol(id).subscribe(r => this.rol = r);
    }
  }

  saveRol() {
    if (this.isEdit) {
      this.rolesService.updateRol(this.rol.rolId, this.rol).subscribe(() => {
        this.router.navigate(['/roles']);
      });
    } else {
      this.rolesService.createRol(this.rol).subscribe(() => {
        this.router.navigate(['/roles']);
      });
    }
  }
}

