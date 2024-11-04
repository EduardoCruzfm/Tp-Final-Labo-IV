import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseniaComponent } from './resenia.component';

describe('ReseniaComponent', () => {
  let component: ReseniaComponent;
  let fixture: ComponentFixture<ReseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
