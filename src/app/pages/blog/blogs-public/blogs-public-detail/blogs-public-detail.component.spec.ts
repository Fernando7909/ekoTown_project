import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsPublicDetailComponent } from './blogs-public-detail.component';

describe('BlogsPublicDetailComponent', () => {
  let component: BlogsPublicDetailComponent;
  let fixture: ComponentFixture<BlogsPublicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsPublicDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsPublicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
