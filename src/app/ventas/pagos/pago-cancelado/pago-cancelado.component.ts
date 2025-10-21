import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pago-cancelado',
  imports: [],
  templateUrl: './pago-cancelado.component.html',
})
export class PagoCanceladoComponent {
ventaId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.ventaId = this.route.snapshot.queryParamMap.get('ventaId')!;
  }
}
