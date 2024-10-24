import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionUsuariosComponent } from './seccion-usuarios.component';

describe('SeccionUsuariosComponent', () => {
  let component: SeccionUsuariosComponent;
  let fixture: ComponentFixture<SeccionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
