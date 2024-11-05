import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselLogosComponent } from './carrusel-logos.component';

describe('CarruselLogosComponent', () => {
  let component: CarruselLogosComponent;
  let fixture: ComponentFixture<CarruselLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselLogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
