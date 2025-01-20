import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsPublicComponent } from './blogs-public.component';

describe('BlogsPublicComponent', () => {
  let component: BlogsPublicComponent;
  let fixture: ComponentFixture<BlogsPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
