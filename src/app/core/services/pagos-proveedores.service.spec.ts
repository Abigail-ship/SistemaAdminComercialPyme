import { TestBed } from '@angular/core/testing';

import { PagosProveedoresService } from './pagos-proveedores.service';

describe('PagosProveedoresService', () => {
  let service: PagosProveedoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagosProveedoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
