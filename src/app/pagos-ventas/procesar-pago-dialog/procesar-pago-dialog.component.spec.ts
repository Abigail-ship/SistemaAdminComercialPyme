import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarPagoDialogComponent } from './procesar-pago-dialog.component';

describe('ProcesarPagoDialogComponent', () => {
  let component: ProcesarPagoDialogComponent;
  let fixture: ComponentFixture<ProcesarPagoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesarPagoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesarPagoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
