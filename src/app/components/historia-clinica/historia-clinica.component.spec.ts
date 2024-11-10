import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaClinicaComponent } from './historia-clinica.component';

describe('HistoriaClinicaComponent', () => {
  let component: HistoriaClinicaComponent;
  let fixture: ComponentFixture<HistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
