import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasDetailsComponent } from './ventas-details.component';

describe('VentasDetailsComponent', () => {
  let component: VentasDetailsComponent;
  let fixture: ComponentFixture<VentasDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
