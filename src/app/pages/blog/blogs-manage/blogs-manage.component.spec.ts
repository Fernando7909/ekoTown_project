import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsManageComponent } from './blogs-manage.component';

describe('BlogsManageComponent', () => {
  let component: BlogsManageComponent;
  let fixture: ComponentFixture<BlogsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
