import { TestBed } from '@angular/core/testing';

import { ReportesVentasService } from './reportes-ventas.service';

describe('ReportesVentasService', () => {
  let service: ReportesVentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesVentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
