import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProgramDetailComponent } from './my-program-detail.component';

describe('MyProgramDetailComponent', () => {
  let component: MyProgramDetailComponent;
  let fixture: ComponentFixture<MyProgramDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProgramDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProgramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
