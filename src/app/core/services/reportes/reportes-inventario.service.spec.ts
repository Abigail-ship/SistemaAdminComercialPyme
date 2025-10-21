import { TestBed } from '@angular/core/testing';

import { ReportesInventarioService } from './reportes-inventario.service';

describe('ReportesInventarioService', () => {
  let service: ReportesInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
