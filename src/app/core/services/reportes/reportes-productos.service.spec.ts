import { TestBed } from '@angular/core/testing';

import { ReportesProductosService } from './reportes-productos.service';

describe('ReportesProductosService', () => {
  let service: ReportesProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
