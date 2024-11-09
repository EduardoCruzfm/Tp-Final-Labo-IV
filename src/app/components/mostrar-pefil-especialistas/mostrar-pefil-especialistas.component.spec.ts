import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPefilEspecialistasComponent } from './mostrar-pefil-especialistas.component';

describe('MostrarPefilEspecialistasComponent', () => {
  let component: MostrarPefilEspecialistasComponent;
  let fixture: ComponentFixture<MostrarPefilEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarPefilEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarPefilEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
