import { TestBed } from '@angular/core/testing';

import { ReportesComprasService } from './reportes-compras.service';

describe('ReportesComprasService', () => {
  let service: ReportesComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
