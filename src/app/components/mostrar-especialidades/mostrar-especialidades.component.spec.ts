import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEspecialidadesComponent } from './mostrar-especialidades.component';

describe('MostrarEspecialidadesComponent', () => {
  let component: MostrarEspecialidadesComponent;
  let fixture: ComponentFixture<MostrarEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarEspecialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
