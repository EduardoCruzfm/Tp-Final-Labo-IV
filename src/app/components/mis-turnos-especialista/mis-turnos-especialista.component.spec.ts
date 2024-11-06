import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTurnosEspecialistaComponent } from './mis-turnos-especialista.component';

describe('MisTurnosEspecialistaComponent', () => {
  let component: MisTurnosEspecialistaComponent;
  let fixture: ComponentFixture<MisTurnosEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisTurnosEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
