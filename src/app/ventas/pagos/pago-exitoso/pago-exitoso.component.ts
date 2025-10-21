import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  imports: [],
  templateUrl: './pago-exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit {
  ventaId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.ventaId = this.route.snapshot.queryParamMap.get('ventaId')!;
  }
}
