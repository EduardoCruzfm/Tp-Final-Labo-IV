import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaClinicaFiltroComponent } from './historia-clinica-filtro.component';

describe('HistoriaClinicaFiltroComponent', () => {
  let component: HistoriaClinicaFiltroComponent;
  let fixture: ComponentFixture<HistoriaClinicaFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
